import os
import faiss
import pickle
import numpy as np
import pandas as pd
import torch
import logging
from typing import List, Dict, Tuple
from rank_bm25 import BM25Okapi
from transformers import AutoModel, AutoTokenizer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "Final_Dermatology_SNOMED.csv")
FAISS_INDEX_PATH = os.path.join(BASE_DIR, "..", "data", "faiss_ivfpq_latest.index")
BM25_PATH = os.path.join(BASE_DIR, "..", "data", "faiss_bm25.pkl")

try:
    df = pd.read_csv(DATA_PATH, encoding='utf-8')
    logger.info(f"Loaded dataset with {len(df)} terms")
except Exception as e:
    logger.error(f"Error loading dataset: {str(e)}")
    raise

try:
    index = faiss.read_index(FAISS_INDEX_PATH)
    logger.info(f"FAISS index loaded with {index.ntotal} vectors")
except FileNotFoundError:
    logger.error(f"Error: FAISS index not found at {FAISS_INDEX_PATH}.")
    exit()

try:
    with open(BM25_PATH, "rb") as f:
        bm25, tokenized_corpus = pickle.load(f)
    logger.info("BM25 index loaded.")
except FileNotFoundError:
    logger.error(f"Error: BM25 index not found at {BM25_PATH}.")
    exit()

MODEL_NAME = "cambridgeltl/SapBERT-from-PubMedBERT-fulltext"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)



def get_embedding(text: str) -> np.ndarray:
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state[:, 0, :].cpu().numpy().squeeze()


def normalize_scores(scores: np.ndarray) -> np.ndarray:
    """Normalize scores to 0-1 range."""
    if len(scores) == 0 or np.max(scores) == np.min(scores):
        return np.zeros_like(scores)
    return (scores - np.min(scores)) / (np.max(scores) - np.min(scores))


def normalize_dict(scores: List[Tuple[int, float]]) -> Dict[int, float]:
    values = np.array([score for _, score in scores])
    norm_scores = normalize_scores(values)
    return {idx: float(score) for (idx, _), score in zip(scores, norm_scores)}



def bm25_search(query: str, top_k: int = 5) -> List[Tuple[int, float]]:
    tokenized_query = query.split()
    scores = bm25.get_scores(tokenized_query)
    top_indices = np.argsort(scores)[-top_k:][::-1]
    return [(idx, float(scores[idx])) for idx in top_indices]


def semantic_search(query: str, top_k: int = 5) -> List[Tuple[int, float]]:
    try:
        query_embedding = get_embedding(query).reshape(1, -1).astype('float32')
        distances, indices = index.search(query_embedding, top_k)
        similarities = 1 / (1 + distances[0])
        return [(int(idx), float(sim)) for idx, sim in zip(indices[0], similarities)]
    except Exception as e:
        logger.error(f"Error in semantic search: {str(e)}")
        return []


def hybrid_search(query: str, top_k: int = 5, bm25_weight: float = 0.3, semantic_weight: float = 0.7) -> List[Dict]:
    try:
        bm25_scores = normalize_dict(bm25_search(query, top_k * 2))
        semantic_scores = normalize_dict(semantic_search(query, top_k * 2))

        combined_scores = {}

        for idx, score in bm25_scores.items():
            combined_scores[idx] = score * bm25_weight

        for idx, score in semantic_scores.items():
            if idx in combined_scores:
                combined_scores[idx] += score * semantic_weight
            else:
                combined_scores[idx] = score * semantic_weight

        sorted_indices = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)[:top_k]

        results = []
        for idx, score in sorted_indices:
            results.append({
                'term': df.iloc[idx]['Term'],
                'definition': df.iloc[idx]['Definition'],
                'score': score
            })

        return results
    except Exception as e:
        logger.error(f"Error in hybrid search: {str(e)}")
        return []


if __name__ == "__main__":
    query = "What are the recommended medications for treating vitiligo?"
    results = hybrid_search(query)


