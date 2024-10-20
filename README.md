# Open Law Philippines:

This thesis explores the innovations and applications of vector search embeddings in the legal field. It compares the performance of traditional BM25 search, vector embedding search, and a hybrid approach combining both methods. The research is aimed at professionals and learners in the legal field who are interested in understanding the impact of advanced retrieval methods on legal document search and analysis.

## Getting Started

### Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [Python](https://www.python.org/downloads/) (v3.10 or higher)
- [MongoDB](https://www.mongodb.com/) for vector database management

### Run Locally

#### Step 1: Set up the Frontend
1. Navigate to the `thesis_webapp/thesis_webapp` directory.
2. Install the required Node.js packages by running the following command:
   `npm i`
3. Do the previous steps for just root `thesis_webapp/` directory aswell

#### Step 2: Set up the Python Backend
1. Navigate to the `thesis_webapp/python_backend` directory.
2. Install the required Python dependencies by running:
   `pip install -r requirements.txt`
3. Start the backend for real-time embeddings and semantic searches by running:
   `python app.py`
4. In a separate terminal, for visualizing the document embeddings and in the same thesis_webapp/python_backend directory, run:
   `python umap.py`
5. Once the terminal shows the prompt `tensorboard --logdir=logs/mongo_embeddings/`, copy and paste this command into the terminal to open TensorBoard and visualize how the embeddings behave.

#### Step 3: Run the Application
1. Go back to `thesis_webapp/thesis_webapp` using another terminal
2. npm run dev
3. Your local development environment should now be set up, and the application will be accessible at http://localhost:3000.

### Features

* Vector Search Embeddings: Advanced search functionality using document embeddings for improved accuracy in legal document retrieval.
* BM25 Search: A traditional term-based search method for comparison.
* Hybrid Search: A combined approach of both BM25 and vector embedding search to balance precision and recall.
* UMAP Visualization: Visualization tool to understand the positioning of document embeddings using TensorFlow's Embedding Projector.
* Generated Summary: Generated Summary as recommended by professional to aid in assessing the search system's results quality.

### Authors

#### Priscilla Mariah 'PM' Licup
#### Andres 'Pipo' Clemente
#### Kenn Michael 'Kenny' Villarama
