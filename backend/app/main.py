from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
import anthropic

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Language map — file extension to Piston language and version
LANGUAGE_MAP = {
    '.py': ('python', '3.10.0'),
    '.c': ('gcc', '10.2.0'),
    '.cpp': ('gcc', '10.2.0'),
    '.js': ('node', '18.15.0'),
    '.java': ('java', '15.0.2'),
}

class CodeRequest(BaseModel):
    code: str
    filename: str = 'main.py'

class ChatRequest(BaseModel):
    messages: list
    mode: str
    code: str
    model: str = 'claude-haiku-4-5-20251001'

@app.post("/execute")
async def execute_code(req: CodeRequest):
    ext = '.' + req.filename.split('.')[-1]
    language, version = LANGUAGE_MAP.get(ext, ('python', '3.10.0'))

    async with httpx.AsyncClient() as client_http:
        response = await client_http.post(
            'http://localhost:2000/api/v2/execute',
            json={
                'language': language,
                'version': version,
                'files': [{ 
                    'name': req.filename,
                    'content': req.code 
                }]
            },
            timeout=30
        )
        result = response.json()

    print(result)  # debug — check terminal output
    run = result.get('run', {})
    return {
        'stdout': run.get('stdout', ''),
        'stderr': run.get('stderr', ''),
        'returncode': run.get('code', 0)
    }
@app.post("/chat")
async def chat(req: ChatRequest):
    response = client.messages.create(
        model=req.model,
        max_tokens=400,
        system=f"""You are a Socratic coding tutor. Never give the answer directly.
Ask guiding questions. Keep replies short and focused.
Current code the student has written:
{req.code}
Mode: {req.mode}""",
        messages=req.messages
    )
    return {"reply": response.content[0].text}