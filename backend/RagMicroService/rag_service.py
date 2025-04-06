from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import openai
from models.hybrid_search import hybrid_search
from dotenv import load_dotenv
import hashlib

load_dotenv()

openai_api_key = os.getenv('OPENAI_API_KEY')
openai.api_key = openai_api_key

app = Flask(__name__)
CORS(app)

cache = {}

SYSTEM_PROMPT = [{
    'role': 'system',
    'content': """You are a friendly and knowledgeable dermatology assistant. Your role is to provide accurate and helpful information about skin conditions, symptoms, and treatments while maintaining a warm and supportive tone.

Guidelines:
1. Use the provided medical information to answer questions accurately
2. If the provided information doesn't fully answer the question, acknowledge this limitation
3. Always emphasize that you are an AI assistant and not a replacement for professional medical advice
4. For any serious or persistent skin conditions, recommend consulting a healthcare provider
5. Be clear and concise in your explanations
6. If the provided context doesn't contain relevant information, say so and suggest consulting a healthcare provider
7. Focus on the most relevant information from the provided context
8. Maintain a friendly and supportive tone while being professional

Example response style:
- "I understand you're concerned about that rash. Based on the information provided, it could be eczema. Let me explain what that means and what you can do about it..."
- "While I can provide general information about acne, it's important to remember that everyone's skin is different. Here's what we know from the medical literature..."

Remember to be informative, supportive, and clear in your responses while maintaining a professional medical tone."""
}]

def hash_query(query):
    return hashlib.sha256(query.encode()).hexdigest()

def create_prompt_with_context(query, search_results, chat_history):
    context = "Relevant medical information:\n"
    relevant_terms = []
    
    if isinstance(search_results, list):
        for result in search_results:
            if result.get('definition') and result.get('definition') != "No definition available":
                context += f"- {result['term']}: {result['definition']}\n"
                relevant_terms.append(result['term'])
    else:
        # Handle DataFrame case
        for _, row in search_results.iterrows():
            if row['Definition'] and row['Definition'] != "No definition available":
                context += f"- {row['Term']}: {row['Definition']}\n"
                relevant_terms.append(row['Term'])
    
    if not relevant_terms:
        context = "No specific medical information was found for this query. "
    
    # Create the full prompt
    prompt = f"""
    Based on the chat history and medical context below, please provide a helpful response to the user's question.

    Chat History:
    {chat_history}

    Medical Context:
    {context}

    User Question: {query}

    Please provide a clear, accurate, and supportive response based on the above information. If the information provided is not relevant to the question, please say so and recommend consulting a healthcare provider.
    """
    return prompt

@app.route('/chat', methods=['POST'])
def handle_query():
    try:
        data = request.json
        
        query = data.get('text').lower()
        chat_history = data.get('history', [])
        
        if not query:
            return jsonify({'error': 'No query provided'}), 400

        query_hash = hash_query(query)
        if query_hash in cache:
            return jsonify({
                'data': cache[query_hash],
                'answer': cache[query_hash],
                'context': []
            })

        search_results = hybrid_search(query, top_k=5)
        
        prompt = create_prompt_with_context(query, search_results, chat_history)
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=SYSTEM_PROMPT + chat_history + [{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        
        answer = response.choices[0].message.content
        
        cache[query_hash] = answer
        
        return jsonify({
            'data': answer, 
        }),200

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 