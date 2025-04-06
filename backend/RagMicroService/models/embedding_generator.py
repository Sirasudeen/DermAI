from transformers import AutoModel, AutoTokenizer
import torch
import os
import numpy as np
import pandas as pd
from tqdm import tqdm

MODEL_NAME = "cambridgeltl/SapBERT-from-PubMedBERT-fulltext"


print(" Loading BioBERT model...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
print(f" Model loaded on {device}")

BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "Final_Dermatology_SNOMED.csv")
SAVE_PATH = os.path.join(BASE_DIR, "..", "data", "biobert_snomed_embeddings.npy")

try:
    df = pd.read_csv(DATA_PATH)
    print(f" Loaded dataset with {len(df)} medical terms.")
except FileNotFoundError:
    print(f" Error: Dataset not found at {DATA_PATH}.")
    exit()

df["Definition"] = df["Definition"].fillna("No definition available.")

df["Text"] = df["Term"] + " - " + df["Definition"]

def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    embedding = outputs.last_hidden_state.mean(dim=1).cpu().numpy().squeeze()
    embedding = embedding / np.linalg.norm(embedding)
    
    return embedding  

print(" Generating embeddings... This may take a while ")
embeddings = np.array([get_embedding(text) for text in tqdm(df["Text"].tolist(), desc="Processing")])

np.save(SAVE_PATH, embeddings)
print(f" Saved {len(embeddings)} BioBERT embeddings successfully at {SAVE_PATH}!")
