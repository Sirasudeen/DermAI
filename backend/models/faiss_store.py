import faiss
import os
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "biobert_snomed_embeddings.npy")
SAVE_PATH = os.path.join(BASE_DIR, "..", "data", "faiss_ivfpq.index")

try:
    embeddings = np.load(DATA_PATH)
    print(f"Loaded {len(embeddings)} embeddings with dimension {embeddings.shape[1]}.")
except FileNotFoundError:
    print(f" Error: File not found at {DATA_PATH}. Please check the path.")
    exit()

dimension = embeddings.shape[1]  

num_clusters = min(10, len(embeddings) // 4)  

quantizer = faiss.IndexFlatL2(dimension)
index = faiss.IndexIVFPQ(quantizer, dimension, num_clusters, 64, 8)

if not index.is_trained:
    index.train(embeddings)
    print(" FAISS index trained.")
else:
    print(" FAISS index was already trained.")

index.add(embeddings)
print(f" Added {index.ntotal} vectors to FAISS index.")

faiss.write_index(index, SAVE_PATH)
print(f" FAISS IVF+PQ index created and saved at {SAVE_PATH}!")
