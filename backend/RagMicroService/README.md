# RAG Microservice

This microservice provides a RAG (Retrieval-Augmented Generation) system for dermatology queries. It combines hybrid search (FAISS + BM25) with ChatGPT to provide accurate and context-aware responses about skin conditions.

## Features

- Hybrid search using FAISS and BM25
- Integration with OpenAI's GPT-3.5
- Context-aware responses
- Professional medical disclaimers
- CORS support for cross-origin requests

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key
```

## Running the Service

```bash
python rag_service.py
```

The service will run on `http://localhost:4000`

## API Endpoints

### POST /query

Send a query about dermatological conditions.

Request body:
```json
{
    "query": "What are the symptoms of eczema?"
}
```

Response:
```json
{
    "answer": "Based on the medical information...",
    "context": [
        {
            "ConceptID": "...",
            "Term": "Eczema",
            "Definition": "..."
        },
        ...
    ]
}
```

## Project Structure

```
RagMicroService/
├── models/
│   ├── hybrid_search.py
│   ├── embedding_generator.py
│   ├── bm25_store.py
│   └── faiss_store.py
├── rag_service.py
├── requirements.txt
└── README.md
```

## Dependencies

- Flask and Flask-CORS for the web server
- OpenAI for GPT-3.5 integration
- FAISS and BM25 for hybrid search
- Transformers for BioBERT embeddings
- Various utility libraries (numpy, pandas, etc.)

## Error Handling

The service includes comprehensive error handling for:
- Missing or invalid queries
- API errors
- Search failures
- Invalid responses

## Security

- CORS is enabled for cross-origin requests
- Environment variables for sensitive data
- Input validation and sanitization 