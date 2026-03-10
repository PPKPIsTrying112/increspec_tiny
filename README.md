# increspec

To tell you the inspiration behind this project, it is a mixture of 2 major gripes that I've been having when it comes to doing college CS coursework.

1. First is why colleges do not have centralized IDEs, meaning we students have to spend a good amount of time setting up the environments ourselves. I was taking an x86 assembly computer architecture course and an operating systems course in college, and fellow Mac users would understand how much of a headache it is to handle architecture mismatches, logging into remote servers, and setting up emulators just to run 20 lines of C or assembly.
2. Secondly, abusing the power of AI-generated results. I am a student. I've been there. Feeding the lab requirements to AI and being so tempted to just copy-paste, but catching onto how this is doing no good for my comprehension. I entered college in 2022 when AI wasn't *that* sharp, so I remember the times having to take the old approach of breaking down concepts, searching through different resources (books, YouTube, forums), or seeking help from instructors. With AI, there's a huge advantage in speeding up the process of finding the proper answer, so it would be foolish not to make use of it. I spent quite some time trying to figure out a workflow that helps efficiently understand requirements and build solid concepts with AI, without letting ourselves be tempted by the easy way out of just having it complete our assignments. To resolve this, I wanted to integrate an AI-assisted learning tool that isn't too generous with showing the whole solution right away, but forces us to work in chunks and solidify each layer of our understanding.

## What It Does 

increspec is a browser-based IDE where you upload your assignment, write your code, run it, and get guided through it by an AI that makes you think instead of just handing you the answer. No installs. No VMs. Open the browser, upload your assignment, and start working right away.

## Technical Highlights

**Self-Hosted Sandboxed Code Execution**
Instead of calling a third-party API, increspec runs its own [Piston](https://github.com/engineer-man/piston) execution engine inside Docker. Every time you hit run, the code goes into an isolated container that gets destroyed immediately after. Student code never touches the host machine. It currently supports Python, C, C++, JavaScript, Java, and 30+ other languages.

**AI-Powered PDF Task Extraction**
Upload any assignment PDF and Claude reads it, parses out the specific tasks, and organizes them into an editable markdown panel. You can add, remove, or edit tasks manually if the extraction misses nuances. Every chat message automatically includes these full requirements so the AI always has the complete context of the assignment without you having to re-explain it.

**Socratic Prompting with Token Management**
Every message sent to Claude includes the assignment requirements, the current state of the code, and a sliding window of only the last 8 messages. This keeps the context window tight and cost-effective. Claude 3 Haiku handles the ongoing chat since it's incredibly fast and significantly cheaper, while the more powerful Claude 3.5 Sonnet is reserved for the one-time, complex PDF parsing task.

**Monaco Editor Integration**
Features the exact same editor engine that powers VS Code, running natively in the browser. It includes syntax highlighting, line numbers, standard keyboard shortcuts, and a familiar developer experience.

## Architecture

```text
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

## Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS |
| **Editor** | Monaco Editor |
| **Backend** | FastAPI, Python, Uvicorn |
| **AI** | Anthropic Claude API (Haiku + Sonnet) |
| **Code Execution** | Piston (self-hosted via Docker) |
| **Markdown** | react-markdown, remark-gfm |

## Running Locally

**Prerequisites:** Docker Desktop, Node.js 18+, Python 3.10+, and an Anthropic API key.

**1. Start Piston (Code Execution Engine):**
```bash
docker run --privileged -d -p 2000:2000 --platform linux/amd64 -v piston-data:/piston ghcr.io/engineer-man/piston

# Install Python support
curl -X POST http://localhost:2000/api/v2/packages \
  -H "Content-Type: application/json" \
  -d '{"language": "python", "version": "3.10.0"}'

# Install C/C++ (GCC) support
curl -X POST http://localhost:2000/api/v2/packages \
  -H "Content-Type: application/json" \
  -d '{"language": "gcc", "version": "10.2.0"}'
```

**2. Start the Backend:**
```bash
cd backend
pip install -r requirements.txt
echo "ANTHROPIC_API_KEY=your_key_here" > .env
uvicorn app.main:app --reload --port 8000
```

**3. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```
The application will be running at `http://localhost:5174`.

## What's Next

* **UI Improvements:** Resizable panels and enhanced markdown rendering in the chat interface.
* **Task-Scoped Memory:** Implementing task-scoped conversation history so each assignment task gets its own isolated context window, preventing the AI from carrying confusion or irrelevant context from Task 1 into Task 3.
* **Study Notes:** A notes panel allowing students to save AI explanations mid-conversation to review later.
* **Persistence:** Authentication and persistent project states so progress isn't lost on browser refresh.
* **OS Visualization (Moonshot):** When writing a page fault handler or a process scheduler, it is incredibly hard to track what is actually happening inside the machine. The goal is to generate live D3.js animations showing memory, CPU state, and process queues updating in real time as the code runs. Claude will describe what is happening at each execution step while the frontend renders it, allowing users to watch the OS respond to their code simultaneously.

---

**Author:** Built by Phue Phyu
