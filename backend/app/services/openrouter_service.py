from fastapi import HTTPException
from app.core.config import get_openrouter_key
import httpx
from tenacity import retry, stop_after_attempt, wait_fixed

@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
async def call_openrouter(prompt: str) -> str:
    if len(prompt.split()) > 1500:
        raise HTTPException(status_code=400, detail="Prompt too long for current credit limit. Please shorten the prompt.")
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {get_openrouter_key()}",
        "Content-Type": "application/json"
    }

    def build_body(model: str):
        return {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 512,
        }

    fallback_models = ["openai/gpt-4o-mini", "openai/gpt-3.5-turbo", "anthropic/claude-3.5-sonnet"]
    last_error = None

    async with httpx.AsyncClient(timeout=10) as client:
        for model in fallback_models:
            body = build_body(model)
            response = await client.post(url, json=body, headers=headers)
            data = response.json()

            if response.status_code == 200 and "choices" in data:
                print(f"✅ Response from {model}")
                return {
                    "model": model,
                    "content": data["choices"][0]["message"]["content"]
                }
            
            print(f"❌ Failed with {model}: {data}")
            if "error" in data and data["error"].get("code") == 402:
                last_error = data["error"]["message"]
                continue
            raise HTTPException(status_code=response.status_code, detail=f"{model} error: {data}")

    raise HTTPException(status_code=402, detail=last_error or "All fallback models failed.")