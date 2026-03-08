# increspec

So basically I was doing my OS assignment on my Mac and everything was a mess. Architecture mismatch, logging into remote servers, setting up emulators just to run like 20 lines of C. I thought there had to be a better way.

increspec is a browser-based IDE where you upload your assignment, write your code, run it, and get guided through it by an AI that makes you think instead of handing you the answer. No installs. No VM. Open browser, start working.

It uses AI, but not in the way most tools do. It won't write your code. It reads your assignment, looks at what you've written, figures out where you're at, and asks you questions. The kind that make you go "oh okay, I see what I did wrong." That's the whole point.

---

## What It Does

Upload your assignment PDF and it automatically pulls out all the tasks and structures them. Write code directly in the browser. Run Python and C/C++ in sandboxed containers. The AI tutor knows your assignment and your code so every hint it gives is actually relevant to what you're working on. Multi-file support so you can manage a real project, not just a single script.

---

## Technical Highlights

**Self-Hosted Sandboxed Code Execution**

Instead of calling a third-party API, increspec runs its own [Piston](https://github.com/engineer-man/piston) execution engine inside Docker. Every time you hit run, the code goes into an isolated container that gets destroyed after. Student code never touches the host machine. Supports Python, C, C++, JavaScript, Java and 30+ other languages.

**AI-Powered PDF Task Extraction**

Upload any assignment PDF and Claude reads it, pulls out the tasks, and puts them in an editable markdown panel. You can add, remove, or edit tasks manually if Claude gets something wrong. Every chat message automatically includes the full requirements so the AI always knows the whole assignment without you having to re-explain it every time.

**Socratic Prompting with Token Management**

Every message to Claude includes the assignment, the current code, and a sliding window of the last 8 messages only. Keeps it tight and cheap. Haiku handles the chat since it's fast and around 20x cheaper than Opus. Sonnet is only used for the one-time PDF parsing where you actually need the stronger model.

**Monaco Editor**

Same editor as VS Code, running in the browser. Syntax highlighting, line numbers, shortcuts, all of it.

---

## Architecture

```
Browser (React + TypeScript)
    ├── Monaco Editor        — code editing
    ├── Chat Panel           — Socratic AI tutor
    ├── Requirements Panel   — PDF upload + task extraction
    └── File Tree            — multi-file project management
          │
          ▼
FastAPI Backend (Python)
    ├── /execute             — sends code to Piston
    ├── /chat                — sends to Claude with full context
    └── /parse-requirements  — sends PDF to Claude for extraction
          │
          ├── Piston (Docker)  — sandboxed code execution
          └── Anthropic API    — Claude Haiku / Sonnet
```

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Editor | Monaco Editor |
| Backend | FastAPI, Python, Uvicorn |
| AI | Anthropic Claude API (Haiku + Sonnet) |
| Code Execution | Piston (self-hosted via Docker) |
| Markdown | react-markdown, remark-gfm |

---

## Running Locally

You need Docker Desktop, Node.js 18+, Python 3.10+, and an Anthropic API key.

**Start Piston:**
```bash
docker run --privileged -d -p 2000:2000 --platform linux/amd64 -v piston-data:/piston ghcr.io/engineer-man/piston

curl -X POST http://localhost:2000/api/v2/packages \
  -H "Content-Type: application/json" \
  -d '{"language": "python", "version": "3.10.0"}'

curl -X POST http://localhost:2000/api/v2/packages \
  -H "Content-Type: application/json" \
  -d '{"language": "gcc", "version": "10.2.0"}'
```

**Start the backend:**
```bash
cd backend
pip install -r requirements.txt
echo "ANTHROPIC_API_KEY=your_key_here" > .env
uvicorn app.main:app --reload --port 8000
```

**Start the frontend:**
```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5174`

---

## Why I Made Certain Calls

The original plan for code execution was to just hit the Piston public API, one HTTP call, done. But it went whitelist-only in February 2026 so that was out. Self-hosting via Docker ended up being better anyway because now every execution is properly isolated and the whole setup is more legit from an infrastructure standpoint. The constraint pushed toward the right architecture.

State management was kept simple on purpose. Everything shared between components lives in App.tsx and flows down as props. No Redux, no Context API for now. The component tree is shallow enough that adding a global store would have been complexity for no real benefit.

Python for the backend because the execution layer was already Python and the Anthropic SDK is solid there. FastAPI over Django because this is an API-only backend and FastAPI is async-native, which matters when you are making calls to both Piston and Claude at the same time.

---

## What's Next

- Resizable panels and better markdown rendering in chat
- Task-scoped conversation history so each assignment task gets its own isolated context window and the AI does not carry confusion from task 1 into task 3
- Notes panel so students can save AI explanations mid-conversation and come back to them when studying
- Auth and persistent projects so nothing gets lost on refresh
- OS visualization: when you are writing a page fault handler or a process scheduler, it is really hard to track what is actually happening inside the machine. The plan is to generate live D3.js animations showing memory, CPU state, and process queues updating in real time as the code runs. Claude describes what is happening at each execution step and the frontend renders it. You would see your code and watch the OS respond to it at the same time.

---

## Author

Built by Phue Phyu
