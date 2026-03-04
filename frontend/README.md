# increspec

An AI-powered IDE that teaches you to code, not just complete assignments.

Built for CS students doing real coursework — OS assignments, data structures, algorithms — without copying code or fighting environment setup.

## The Problem
Students paste assignments into ChatGPT and copy the output. They complete the assignment but learn nothing. Existing AI tools optimise for speed of output, not depth of understanding.

## The Solution
increspec is a Socratic AI tutor built into a browser-based IDE. It guides students through their assignments step by step with questions, not answers. Zero environment setup — runs C, Python, and more directly in the browser.

## Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Monaco Editor
- Axios
- Lucide React

**Backend**
- FastAPI + Uvicorn
- Anthropic Claude API
- Piston API (sandboxed multi-language code execution)
- python-dotenv

## Running Locally

**Backend**
```bash
cd backend
pip3 install -r requirements.txt
echo "ANTHROPIC_API_KEY=your_key_here" > .env
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

App runs at http://localhost:5174

## Features
- Monaco code editor with syntax highlighting
- Sandboxed code execution via Piston API
- AI tutor chat powered by Claude
- Socratic mode — guides without giving answers
- Code context sent to AI automatically
- Model selector (Haiku / Sonnet / Opus)

## Roadmap
- [ ] Multi-file support with folder structure
- [ ] C/C++ support for OS assignments
- [ ] Markdown rendering in chat
- [ ] Mode chips (Walk-thru / Explain concept)
- [ ] Saved notes panel
- [ ] Token usage display
- [ ] Docker sandboxing for production