from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
import pymongo
import certifi
from bson import ObjectId

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB Connection
client = pymongo.MongoClient("mongodb+srv://pipo:snvQQfMSbJwDchjN@cluster0.yzkq3xh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",tlsCAFile=certifi.where())
db = client.Thesis
collection = db["Flattened"]

# Load the SentenceTransformer model
# model = SentenceTransformer("Alibaba-NLP/gte-large-en-v1.5", device='cuda', trust_remote_code=True)
model = SentenceTransformer("Alibaba-NLP/gte-large-en-v1.5", trust_remote_code=True)

# Text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=8000,
    chunk_overlap=50,
    separators=["\n\n", "\n", "(?<=\\. )", " "],
    length_function=len
)

def generate_embedding(text):
    return model.encode(text).tolist()

def split_chunks(text):
    # Chunk the document text
    chunks = text_splitter.split_text(text)
    return chunks

def convert_objectid_to_str(results):
    for result in results:
        if '_id' in result:
            result['_id'] = str(result['_id'])
    return results

def weighted_reciprocal_rank(doc_lists):
    c = 60  # constant from the RRF paper
    weights = [1] * len(doc_lists) #you can apply weights if you like, here they are all the same, ie 1
    
    if len(doc_lists) != len(weights):
        raise ValueError("Number of rank lists must be equal to the number of weights.")
    
    # Create a union of all unique documents in the input doc_lists  rq r   TODO why need unique? what if document appears in both lists? which rank will it choose? shouldn't it accomodate both ranks?
    all_documents = set()
    for doc_list in doc_lists:
        for doc in doc_list:
            all_documents.add(doc["_id"])
    
    # Initialize the RRF score dictionary for each document
    rrf_score_dict = {doc: 0.0 for doc in all_documents}
    
    # Calculate RRF scores for each document
    for doc_list, weight in zip(doc_lists, weights):
        for rank, doc in enumerate(doc_list, start=1):
            rrf_score = weight * (1 / (rank + c))
            rrf_score_dict[doc["_id"]] += rrf_score     # adds score to the key id in dictionary
    
    # Sort documents by their RRF scores in descending order
    sorted_documents = sorted(rrf_score_dict.keys(), key=lambda x: rrf_score_dict[x], reverse=True)
    # TRIAL ----------------------
    print("RRF Score Dict Results:")
    print(rrf_score_dict)
    print("--------------------------------------------------------")
    
    # Map the sorted page_content back to the original document objects
    page_content_to_doc_map = {
        doc["_id"]: doc for doc_list in doc_lists for doc in doc_list
    }
    sorted_docs = [
        # page_content_to_doc_map[_id] for _id in sorted_documents
        {**page_content_to_doc_map[_id], 'rrf_score': rrf_score_dict[_id]} for _id in sorted_documents
    ]
    
    return sorted_docs

def atlas_hybrid_search(query, category, top_k, vector_index_name, keyword_index_name):
    print(category)
    # Vector search
    query_vector = generate_embedding(query)

    vector_results = collection.aggregate([
        {
            "$vectorSearch": {
                "queryVector": query_vector,
                "path": "chunk_embedding",
                "numCandidates": 10000,
                "limit": top_k,
                "index": vector_index_name
            },
        },
        {
            "$match": {
                "category": {"$in": category}
            }
        },
        {
            "$project": {
                "_id": 1,
                "title": 1,
                "category": 1,
                "chunk": 1,
                "document_id": {"$toString": "$document_id"},
                "score": {"$meta": "vectorSearchScore"},
            }
        }
    ])
    vector_results = list(vector_results)
    # TRIAL ----------------------
    print("Vector Results:")
    print(len(vector_results))
    for doc in vector_results:
        print(f'Title: {doc["title"]}, Score: {doc["score"]}')
    print("--------------------------------------------------------")

    # Keyword search
    keyword_results = collection.aggregate([
        {
            "$search": {
                "index": keyword_index_name,
                "text": {
                    "query": query,
                    "path": "chunk"
                }
            }
        },
        {
            "$addFields": {"score": {"$meta": "searchScore"}}
        },
        {
            "$match": {
                "category": {"$in": category}
            }
        },
        {
            "$limit": top_k
        },
        {
            "$project": {
                "_id": 1,
                "title": 1,
                "category": 1,
                "chunk": 1,
                "document_id": {"$toString": "$document_id"},
                "score": {"$meta": "searchScore"},
            }
        }
    ])
    keyword_results = list(keyword_results)
    # TRIAL ----------------------
    print("Keyword Results:")
    for doc in keyword_results:
        print(f'Title: {doc["title"]}, Score: {doc["score"]}')
    print("--------------------------------------------------------")

    doc_lists = [vector_results, keyword_results]
    # TRIAL ----------------------
    print("Doc Lists Results:")
    for doc_list in doc_lists:
        for doc in doc_list:
            print(f'Title: {doc["title"]}, Score: {doc["score"]}')
        print("---------------------------")
    print("--------------------------------------------------------")

    # Enforce that retrieved docs are the same form for each list in retriever_docs
    for i in range(len(doc_lists)):
        doc_lists[i] = [
            {"_id": doc["_id"], "title": doc["title"], "category": doc["category"], "chunk": doc["chunk"], "document_id": doc["document_id"], "score": doc["score"]}
            for doc in doc_lists[i]
        ]

    # Apply rank fusion
    fused_documents = weighted_reciprocal_rank(doc_lists)
    print("Fused Docs Results:")
    for doc in fused_documents:
        print(f'Title: {doc["title"]}, Document ID: {doc["document_id"]}, Score: {doc["rrf_score"]}')
    print("--------------------------------------------------------")
    return fused_documents


@app.route('/vector_results', methods=['POST'])
def vector_results():
    data = request.json
    text = data.get("text", "")
    category = data.get("category", [])

    # Split the category string into a list if it's a string
    if isinstance(category, str):
        category = category.split(',')

    # Determine if the query is a string, paragraph, or document
    if isinstance(text, str):
        chunks = split_chunks(text)
    else:
        # If the query is a document, read and chunk the document text
        with open(text, 'r') as file:
            text = file.read()
            chunks = split_chunks(text)
    
    all_results = []

    for chunk in chunks:
        results = collection.aggregate([
            {
                "$vectorSearch": {
                    "queryVector": generate_embedding(chunk),
                    "path": "chunk_embedding",
                    "numCandidates": 10000,
                    "limit": 100,
                    "index": "vectorsearch_index",
                    "includeMetadata": True
                }
            },
            {
                "$match": {
                    "category": {"$in": category}
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "title": 1,
                    "category": 1,
                    "chunk": 1,
                    "document_id":  {"$toString": "$document_id"},
                    "score": {"$meta": "vectorSearchScore"},
                }
            }
        ])

        results = list(results)
        results = convert_objectid_to_str(results)

        for result in results:
            # result["query_chunk"] = chunk
            all_results.append(result)

    # Aggregate results based on score (optional)
    # Here, we simply return all results, but you can add logic to combine scores if needed

    # print(all_results)
    print(category)
    return jsonify(all_results)

@app.route('/hybrid_results', methods=['POST'])
def hybrid_results():
    data = request.json
    text = data.get("text", "")
    category = data.get("category", [])

    # Split the category string into a list if it's a string
    if isinstance(category, str):
        category = category.split(',')

    if isinstance(text, str):
        chunks = split_chunks(text)
    else:
        with open(text, 'r') as file:
            text = file.read()
            chunks = split_chunks(text)
    
    all_results = []

    for chunk in chunks:
        results = atlas_hybrid_search(chunk, category, top_k=100, vector_index_name="vectorsearch_index", keyword_index_name="keyword_index")
        all_results.extend(results)
    
    return jsonify(convert_objectid_to_str(all_results))

@app.route('/split_to_chunks', methods=['POST'])
def split_to_chunks():
    data = request.json
    text = data.get("text", "")
    chunks = split_chunks(text)
    print(chunks)
    return jsonify(chunks)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
