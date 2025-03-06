from transformers import pipeline
from retrieval_augment import retrieve_context

qa_model = pipeline("text-generation", model="gpt-3.5-turbo")

def generate_response(query):
    """
    Generate chatbot response using retrieved context + GPT.
    """
    context = retrieve_context(query)

    if not context.strip():
        return "I'm sorry, I couldn't find any relevant information for your query."

    prompt = f"Question: {query}\nContext: {context}\nAnswer:"

    response = qa_model(prompt, max_length=150)[0]["generated_text"]

    return response.strip()

if __name__ == "__main__":
    query = "What are the causes of eczema?"
    response = generate_response(query)
    print("🤖 **Chatbot Response:**")
    print(response)
