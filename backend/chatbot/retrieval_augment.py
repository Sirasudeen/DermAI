import pandas as pd
import os

from backend.models.hybrid_search import hybrid_search

# Load medical data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get current file path

df = pd.read_csv(os.path.join(BASE_DIR, "..", "data", "Final_Dermatology_SNOMED.csv"))

def retrieve_context(query, top_k=5):
    """
    Retrieve relevant medical terms and descriptions for the query.
    """
    retrieved_results = hybrid_search(query, top_k)
    
    # Format retrieved information as context
    context = "\n".join(
        f"{row['Term']}: {row['Definition'] if pd.notna(row['Definition']) else 'No definition available'}"
        for _, row in retrieved_results.iterrows()
    )

    return context

# Example test
if __name__ == "__main__":
    query = "red skin rash"
    context = retrieve_context(query)
    print("🔍 **Retrieved Context:**")
    print(context)
