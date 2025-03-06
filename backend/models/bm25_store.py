import pandas as pd
import os
import pickle
import nltk
from nltk.corpus import stopwords
from rank_bm25 import BM25Okapi

nltk.download("stopwords")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "Final_Dermatology_SNOMED.csv")
SAVE_PATH = os.path.join(BASE_DIR, "..", "data", "faiss_bm25.pkl")

try:
    df = pd.read_csv(DATA_PATH)
    print(f" Loaded dataset with {len(df)} terms.")
except FileNotFoundError:
    print(f" Error: File not found at {DATA_PATH}. Please check the path.")
    exit()

df["Term"] = df["Term"].fillna("")  

corpus = df["Term"].astype(str).tolist()

stop_words = set(stopwords.words("english"))  
tokenized_corpus = [[word.lower() for word in term.split() if word.lower() not in stop_words] for term in corpus]
bm25 = BM25Okapi(tokenized_corpus)

with open(SAVE_PATH, "wb") as f:
    pickle.dump((bm25, tokenized_corpus), f)

print(f"BM25 index stored successfully at: {SAVE_PATH}")
