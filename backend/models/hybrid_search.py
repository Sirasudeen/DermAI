import faiss
import os
import pickle
import numpy as np
import pandas as pd
from rank_bm25 import BM25Okapi
from transformers import AutoModel, AutoTokenizer
import torch

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(BASE_DIR, "..", "data", "Final_Dermatology_SNOMED.csv")
try:
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded dataset with {len(df)} terms.")
except FileNotFoundError:
    print(f"Error: File not found at {DATA_PATH}.")
    exit()

# Load FAISS index
FAISS_INDEX_PATH = os.path.join(BASE_DIR, "..", "data", "faiss_ivfpq_latest.index")
try:
    index = faiss.read_index(FAISS_INDEX_PATH)
    print(f"FAISS index loaded with {index.ntotal} vectors.")
except FileNotFoundError:
    print(f"Error: FAISS index not found at {FAISS_INDEX_PATH}.")
    exit()

BM25_PATH = os.path.join(BASE_DIR, "..", "data", "faiss_bm25.pkl")
try:
    with open(BM25_PATH, "rb") as f:
        bm25, tokenized_corpus = pickle.load(f) 
    print("BM25 index loaded.")
except FileNotFoundError:
    print(f"Error: BM25 index not found at {BM25_PATH}.")
    exit()

MODEL_NAME = "dmis-lab/biobert-v1.1"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state[:, 0, :].cpu().numpy().squeeze()  

def normalize_scores(scores):
    """Normalize scores to a range of 0 to 1, avoiding NaN issues."""
    if len(scores) == 0 or np.max(scores) == np.min(scores):
        return np.zeros_like(scores)
    return (scores - np.min(scores)) / (np.max(scores) - np.min(scores))

def hybrid_search(query, top_k=5, bm25_weight=0.5, faiss_weight=0.5):
    query_embedding = np.array([get_embedding(query)], dtype="float32")

    # FAISS Search
    _, faiss_indices = index.search(query_embedding, top_k)
    faiss_results = df.iloc[faiss_indices[0]].copy()
    faiss_results["FAISS_Score"] = normalize_scores(np.linspace(1, 0, len(faiss_results)))  # Rank-based normalization

    # BM25 Search
    bm25_scores = bm25.get_scores(query.split())
    bm25_top_indices = np.argsort(bm25_scores)[::-1][:top_k]
    bm25_results = df.iloc[bm25_top_indices].copy()
    bm25_results["BM25_Score"] = normalize_scores(bm25_scores[bm25_top_indices])

    # Merge Results
    hybrid_results = pd.merge(faiss_results, bm25_results, on=["ConceptID", "Term", "Definition"], how="outer")

    # Fill missing scores with 0
    hybrid_results["FAISS_Score"] = hybrid_results["FAISS_Score"].fillna(0.0)
    hybrid_results["BM25_Score"] = hybrid_results["BM25_Score"].fillna(0.0)

    # Weighted Score Combination
    hybrid_results["Hybrid_Score"] = (
        bm25_weight * hybrid_results["BM25_Score"] +
        faiss_weight * hybrid_results["FAISS_Score"]
    )

    # Sort by Hybrid Score
    hybrid_results = hybrid_results.sort_values(by="Hybrid_Score", ascending=False)

    return hybrid_results

query = "red skin rash"
results = hybrid_search(query)

print("\n🔍 **Top Hybrid Search Results for 'red skin rash':**")
print(results)

query2 = "eczema"
print("\n🔍 **Top Hybrid Search Results for 'eczema':**")
print(hybrid_search(query2))
