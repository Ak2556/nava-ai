import uuid
from chromadb import Client

client = Client()

def add_memory(prompt: str, response: str, model: str):
    doc_id = str(uuid.uuid4())
    collection = client.get_or_create_collection(name="nava_memory")

    document = {
        "documents": [response],
        "metadatas": [{"prompt": prompt, "response": response, "model": model}]
    }

    collection.add(
        ids=[doc_id],
        documents=document["documents"],
        metadatas=document["metadatas"]
    )
    return doc_id