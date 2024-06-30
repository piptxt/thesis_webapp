from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
import pymongo
from bson import ObjectId

app = Flask(__name__)

# MongoDB Connection
client = pymongo.MongoClient("mongodb+srv://priscillalicup:wovkk5sxg01rXYLW@cluster0.1xyfpdp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.supreme_court_jurisprudence
collection = db["flattened_zip_2021_gte"]

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

@app.route('/aggregate_results', methods=['POST'])
def aggregate_results():
    data = request.json
    text = data.get("text", "")

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
                    "path": "text_chunk_embedding",
                    "numCandidates": 100,
                    "limit": 5,
                    "index": "default_gte_1024",
                    "includeMetadata": True
                }
            },
            {
                "$project": {
                    "title": 1,
                    "text_chunk": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            }
        ])

        results = list(results)
        results = convert_objectid_to_str(results)

        for result in results:
            result["query_chunk"] = chunk
            all_results.append(result)

    # Aggregate results based on score (optional)
    # Here, we simply return all results, but you can add logic to combine scores if needed

    print(all_results)
    return jsonify(all_results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
