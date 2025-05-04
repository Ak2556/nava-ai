from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from app.services.openrouter_service import call_openrouter
from app.services import chroma_service

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str

# New model for memory query
class MemoryQuery(BaseModel):
    query: str
    n_results: int = 3

@router.post("/openrouter")
async def generate_reply(req: ChatRequest):
    response = await call_openrouter(req.prompt)
    reply_text = response["content"]
    model_used = response["model"]

    # ✅ Fixed: Flattened response for ChromaDB compatibility
    chroma_service.add_memory(prompt=req.prompt, response=reply_text, model=model_used)

    return {
        "response": reply_text,
        "model": model_used,
        "request_id": str(uuid.uuid4())
    }


# New endpoint for memory search
@router.post("/search-memory")
async def search_memory(query: MemoryQuery):
    try:
        result = chroma_service.query_memory(query.query, query.n_results)
        formatted = []
        docs = result.get("documents", [[]])[0]
        metas = result.get("metadatas", [[]])[0]
        ids = result.get("ids", [[]])[0]

        for i in range(0, len(docs), 2):
            if i + 1 < len(docs):
                formatted.append({
                    "prompt": docs[i],
                    "response": docs[i+1],
                    "prompt_metadata": metas[i],
                    "response_metadata": metas[i+1],
                    "prompt_id": ids[i],
                    "response_id": ids[i+1]
                })

        return {"memories": formatted}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint to clear all memory
@router.delete("/memory/clear")
async def clear_memory():
    try:
        from app.services.chroma_service import wipe_memory
        wipe_memory()
        return {"message": "All memory cleared."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))