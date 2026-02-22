from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
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


class CodeRequest(BaseModel):
    code: str


class ChatRequest(BaseModel):
    messages: list
    mode: str
    code: str


@app.post("/execute")
def execute_code(req: CodeRequest):
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(req.code)
        tmp_path = f.name

    result = subprocess.run(
        ["python3", tmp_path],
        capture_output=True,
        text=True,
        timeout=10
    )
    os.unlink(tmp_path)

    return {
        "stdout": result.stdout,
        "stderr": result.stderr,
        "returncode": result.returncode
    }


@app.post("/chat")
def chat(req: ChatRequest):
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=400,
        system=f"""You are a Socratic coding tutor. Never give the answer directly.
Ask guiding questions. Keep replies short and focused.
Current code the student has written:
{req.code}
Mode: {req.mode}""",
        messages=req.messages
    )
    return {"reply": response.content[0].text}