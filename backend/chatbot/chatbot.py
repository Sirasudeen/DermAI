from response_generator import generate_response

def chatbot_response(user_query):
    """
    Main chatbot function that returns an AI-generated response.
    """
    return generate_response(user_query)

# Example test
if __name__ == "__main__":
    while True:
        query = input("👤 You: ")
        if query.lower() in ["exit", "quit"]:
            break
        response = chatbot_response(query)
        print(f"🤖 Bot: {response}\n")
