# Needed packages to install pymongo, numpy, and tensorflow

# HOW TO RUN: 
# 1.) run umap.py in terminal: python umap.py
# 2.) run tensorboard in terminal: tensorboard --logdir=logs/mongo_embeddings/

import os
import numpy as np
import tensorflow as tf
from tensorboard.plugins import projector
from pymongo import MongoClient

# MongoDB Database
client = MongoClient('mongodb+srv://pipo:melgeoffrey@cluster0.yzkq3xh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['Thesis']
collection = db['Documents']

cursor = collection.find({}, no_cursor_timeout=True)

embeddings = []
titles = []  
categories = []

try:
    for doc in cursor:
        embeddings.append(doc['embed'])
        titles.append(doc.get('title', 'unknown')) 
        categories.append(doc.get('category', 'unknown')) 
finally:
    cursor.close()

# Convert to NumPy array
embeddings = np.array(embeddings)

# Set up a directory to store logs for TensorBoard
log_dir = 'logs/mongo_embeddings/'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

# Save embeddings in a TensorFlow variable
embedding_var = tf.Variable(embeddings, name='mongo_embeddings')

# Save the metadata in a .tsv file for TensorBoard with utf-8 encoding
metadata_path = os.path.join(log_dir, 'metadata.tsv')
with open(metadata_path, 'w', encoding='utf-8') as f:
    f.write("Title\tCategory\n")  # Write header
    for title, category in zip(titles, categories):
        f.write(f"{title}\t{category}\n")  # Tab-separated values

# Create a checkpoint from embedding, the filename and key are the name of the tensor
checkpoint = tf.train.Checkpoint(embedding=embedding_var)
checkpoint.save(os.path.join(log_dir, "embedding.ckpt"))

# Set up TensorBoard config
config = projector.ProjectorConfig()
embedding = config.embeddings.add()
embedding.tensor_name = "mongo_embeddings/.ATTRIBUTES/VARIABLE_VALUE"
embedding.metadata_path = 'metadata.tsv'

# Save the config file for TensorBoard projector
projector.visualize_embeddings(log_dir, config)

# Launch TensorBoard
print("To visualize embeddings, run the following command:")
print(f"tensorboard --logdir={log_dir}")
