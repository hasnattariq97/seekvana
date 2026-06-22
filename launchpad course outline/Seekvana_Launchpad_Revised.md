# Seekvana Launchpad — Pre-course Curriculum

**From zero to AI-ready — everything you need before building agents**

- 9 Modules · 93 Topics · 93 Tasks
- Zero experience needed
- June 2026

---

## About This Course

Launchpad is the mandatory pre-course for the Seekvana Agentic AI curriculum. Designed for complete beginners — no coding experience, no developer tools installed, no prior AI knowledge beyond using a chatbot once or twice.

**By the end, learners will have:**
- Every tool installed, every account created
- A working understanding of how the web and code work at a surface level
- The confidence to write, run, and deploy simple AI-powered scripts
- Genuine readiness for the Beginner Agentic AI course

**What you need:**
- A computer (Windows, Mac, or Linux)
- An internet connection
- A free Anthropic account
- 3—5 hours total across all modules
- No prior coding experience, no paid subscriptions required

Every topic includes a hands-on task completable in under 5 minutes.

---

## Course Overview

| # | Module | Topics | Focus |
|---|---|---|---|
| 01 | The AI landscape | 8 | Orientation — understanding the world you're stepping into |
| 02 | Terminal & command line | 7 | The black box explained first |
| 03 | Your developer environment | 11 | Setup with terminal confidence |
| 04 | GitHub & version control | 11 | Save, share, never lose your work |
| 05 | Python without fear | 12 | Just enough Python for AI code |
| 06 | Web basics: frontend & backend | 10 | HTML, CSS, JS, APIs |
| 07 | Backend, databases & AI architecture | 8 | FastAPI, SQL, Supabase, where agents live |
| 08 | AI coding tools ecosystem | 11 | Your toolkit |
| 09 | Deployment: taking your work live | 14 | Ship it |
| 10 | Mini projects | 9 | Put it all together |

---

## Module 01 — The AI Landscape

*Orientation — understanding the world you are stepping into*

- 01.01 What AI actually is — and what it is not
  - Task: Find one AI tool you already use (Google Maps, Spotify, YouTube) and write one sentence on how you think it uses AI.
- 01.02 ML â†’ Deep Learning â†’ LLMs â†’ Generative AI â†’ Agentic AI family tree
  - Task: Draw or type the five-step family tree from memory. Check it against the lesson.
- 01.03 How large language models work — tokens, training, inference, no math
  - Task: Type a sentence into claude.ai and count roughly how many tokens it might be using.
- 01.04 The difference between a chatbot and an agent
  - Task: Give one real-world example of a chatbot and one of an agent. Share them in the community forum.
- 01.05 Key players: ChatGPT, Claude, Gemini, Grok — what makes each different
  - Task: Open all four in separate tabs. Ask each the same question and note one difference in their responses.
- 01.06 Paid vs free tiers — what you actually need to get started
  - Task: List the tools you will use on a free tier. Confirm you do not need to spend anything to begin.
- 01.07 AI applications you already use without knowing it
  - Task: Identify three apps on your phone that use AI. Write what you think the AI is doing in each one.
- 01.08 How to think about AI as a collaborator, not a magic box
  - Task: Write a two-sentence description of a task you would like AI to help you with by the end of this course.

---

## Module 02 — Terminal & Command Line

*The black box explained — commands that make everything work*

- 02.01 What the terminal actually is and why developers use it
  - Task: Open your terminal. Type: `echo Hello from the terminal` and press Enter.
- 02.02 PowerShell (Windows) vs Terminal (Mac/Linux) — setup and first look
  - Task: Identify which terminal you are using. Run: `pwd` to print your current location.
- 02.03 The 15 commands you will use 90% of the time: cd, ls/dir, mkdir, cp, mv, rm, cat, clear
  - Task: Create a folder, create a file inside it, rename it, then delete it — using only terminal commands.
- 02.04 File paths: absolute vs relative — why this trips everyone up
  - Task: Navigate to a folder using a relative path, then navigate using an absolute path.
- 02.05 Package managers — what npm install and pip install actually do
  - Task: Run: `pip install requests` and then: `npm install -g nodemon`. Confirm both install.
- 02.06 Environment variables — setting, reading, and understanding them
  - Task: In PowerShell run: `$env:MY_NAME='YourName'` then: `echo $env:MY_NAME`.
- 02.07 Reading error messages — how to decode what went wrong
  - Task: Intentionally type a wrong command: `pytohn --version`. Write one sentence explaining the error.

---

## Module 03 — Your Developer Environment

*Setup — installing every tool you need, one step at a time*

- 03.01 VS Code — the free universal code editor; installing and configuring it
  - Task: Install VS Code. Install the Prettier extension. Open any text file.
- 03.02 Cursor — the AI-first editor; why non-coders use it
  - Task: Install Cursor. Open it and send your first AI message inside the editor chat panel.
- 03.03 Node.js — what it is, why AI tools need it, how to install it
  - Task: Run: `node --version`. Confirm a version number appears.
- 03.04 Python — installation on Windows, Mac, Linux; understanding versions
  - Task: Run: `python --version`. Confirm Python 3.x is installed.
- 03.05 Git — what version control is; installing Git
  - Task: Run: `git --version`. Confirm Git is installed.
- 03.06 What an API key is and why it is like a password
  - Task: Go to console.anthropic.com and generate your first API key.
- 03.07 Creating a .env file to store secrets safely
  - Task: Create a folder called `my-first-project`. Inside it, create a `.env` file with: `ANTHROPIC_API_KEY=your-key-here`
- 03.08 Understanding what PATH is and why terminal errors happen
  - Task: Run: `echo $PATH` (Mac/Linux) or `echo $env:PATH` (Windows). Find Python or Node in the output.
- 03.09 Free accounts to create: Anthropic, OpenAI, Google AI Studio, GitHub, Hugging Face
  - Task: Create all five accounts. Write down your username for each.
- 03.10 How to install Claude Code via terminal
  - Task: Run the Claude Code installer. Confirm: `claude --version` prints a version number.
- 03.11 Verify your full setup: one final checklist
  - Task: Run `node --version`, `python --version`, `git --version`, and `claude --version`. Screenshot all four.

---

## Module 04 — GitHub & Version Control

*Save, share, and never lose your work again*

- 04.01 What version control is and why every developer uses it
  - Task: Write one sentence on how Git would have helped with a time you wished you could undo a file change.
- 04.02 Git vs GitHub — Git is the tool, GitHub is the cloud home
  - Task: Open github.com and find one public AI project repository. Explore its files for two minutes.
- 04.03 Core workflow: git init â†’ git add â†’ git commit â†’ git push
  - Task: Create a new folder, run `git init`, create a README.md, then add, commit, and push to a new GitHub repo.
- 04.04 Cloning a repo: downloading someone else's project to your machine
  - Task: Clone any small public GitHub repository using: `git clone [url]`.
- 04.05 Branches: what they are, why they exist, how to create one
  - Task: Run: `git checkout -b my-first-branch`. Make a small change and commit it.
- 04.06 Pull requests: how teams review and merge code
  - Task: On GitHub, open a pull request from your branch to main. Merge it yourself.
- 04.07 The .gitignore file — keeping .env and API keys out of GitHub
  - Task: Add a .gitignore file with `.env` on the first line. Confirm `.env` no longer appears in `git status`.
- 04.08 Reading a GitHub repository: README, file structure, issues, stars
  - Task: Star three AI repositories you find interesting. Leave a comment on one open Issue.
- 04.09 GitHub Desktop — the visual starting point before you go full terminal
  - Task: Install GitHub Desktop. Open your existing repo and confirm you can see your commit history visually.
- 04.10 GitHub as a portfolio: why your repos matter when learning AI
  - Task: Make your GitHub profile public. Add a short bio mentioning you are learning Agentic AI.
- 04.11 Common beginner mistakes: accidentally pushing secrets, merge conflicts
  - Task: Review your last three commits on GitHub. Confirm no API keys were accidentally committed.

---

## Module 05 — Python Without Fear

*Just enough Python to read, run, and modify AI code*

- 05.01 Why Python is the language of AI — and why you do not need to master it
  - Task: Open a Python file from any public AI repo on GitHub. Identify three things you can already guess the meaning of.
- 05.02 Variables, strings, numbers, and booleans in plain English
  - Task: Open a Python shell and create one variable of each type. Print all four.
- 05.03 Lists and dictionaries — the data structures AI code uses constantly
  - Task: Create a dictionary with three keys: name, model, and temperature. Print each value individually.
- 05.04 Functions: what they are, how to call them, how to read one
  - Task: Write a function called `greet` that takes a name and prints: `Hello, [name]!` Call it three times.
- 05.05 Loops: for and while — reading them without panic
  - Task: Write a for loop that prints the numbers 1 to 10. Then modify it to print only even numbers.
- 05.06 Reading files and writing files
  - Task: Write a Python script that creates a file called `notes.txt`, writes two lines, then reads and prints it back.
- 05.07 What a library/package is: import explained
  - Task: Run: `import datetime` then: `print(datetime.date.today())`. Confirm today's date prints correctly.
- 05.08 Loading .env files in Python with python-dotenv
  - Task: Install python-dotenv. Write a script that loads your `.env` file and prints your API key (first 8 chars only).
- 05.09 Making your first API call in Python — sending a message to Claude
  - Task: Use the provided code snippet to send: "What is an AI agent?" to Claude via the API. Read the response.
- 05.10 Reading JSON: the data format that AI APIs speak in
  - Task: Copy a sample API response JSON. Use `json.loads()` to parse it and print just the content field.
- 05.11 Error handling: try/except without crying
  - Task: Wrap your API call in a try/except block. Intentionally break the API key and confirm the error is caught.
- 05.12 Virtual environments (venv) — why you need them and how to use them
  - Task: Create a venv in your project folder, activate it, and install the anthropic package inside it.

---

## Module 06 — Web Basics: Frontend & Backend

*HTML, CSS, JavaScript and APIs — how the web works at the surface*

- 06.01 What HTML is: structure. What CSS is: style. What JavaScript is: behaviour
  - Task: Create `index.html` with a heading, a paragraph, and one coloured button using all three.
- 06.02 Reading an HTML file without panicking — tags, attributes, nesting
  - Task: Open any website, right-click, choose View Page Source. Find the main heading tag and one link tag.
- 06.03 CSS: what a class is, how to change a colour or font
  - Task: Add a CSS class to your button that changes its background colour and font size.
- 06.04 JavaScript basics: variables, functions, console.log, fetch()
  - Task: Add a script that runs `console.log('Page loaded')` when the page opens. Confirm it in DevTools.
- 06.05 What an API is — the concept that connects everything
  - Task: Describe in plain English what happens when a weather app shows today's forecast. Identify where the API call happens.
- 06.06 REST APIs: GET vs POST — what a request and response look like
  - Task: Open: `https://api.github.com/users/your-username` in the browser. Read the JSON response.
- 06.07 The browser developer tools — inspect what is happening on any webpage
  - Task: Open DevTools on any website. Go to the Network tab, reload the page, and find one API request.
- 06.08 npm vs the browser: understanding the two worlds of JavaScript
  - Task: Create a Node.js script that prints: `Hello from Node`. Run it with: `node script.js`.
- 06.09 What a frontend is vs a backend — and why AI agents need both
  - Task: Draw a simple diagram: user â†’ frontend â†’ backend â†’ AI model â†’ response back to user.
- 06.10 How prompting connects to code — writing prompts that get useful results
  - Task: Write three versions of the same prompt (vague, better, best). Compare response quality.

---

## Module 07 — Backend, Databases & AI Architecture

*FastAPI, SQL, Supabase, and where agents live in a real application*

- 07.01 What a backend server does and how it talks to the frontend
  - Task: Install FastAPI: `pip install fastapi uvicorn`. Run the hello world example in your browser.
- 07.02 Common backend languages: Python/FastAPI and Node.js/Express — surface level
  - Task: Find the Express.js hello world example online. Identify the route, method, and response.
- 07.03 What a database is: storing and retrieving data
  - Task: Open Supabase, create a free account, and create a new project. Explore the table editor.
- 07.04 SQL vs NoSQL — when to use which, with examples
  - Task: In the Supabase SQL editor run: `SELECT * FROM your_table`. Note what a table view looks like.
- 07.05 Reading a basic SQL query: SELECT, INSERT, WHERE
  - Task: Write a SQL query that selects all rows from a table where a column equals a specific value.
- 07.06 What a database table looks like and how AI agents query it
  - Task: Create a table called `messages` with columns: id, role, content. Insert two rows manually.
- 07.07 How the three layers connect: frontend â†’ backend â†’ database
  - Task: Trace a single user message in an AI chat app from browser to database and back.
- 07.08 Where AI agents typically live in a real application
  - Task: Sketch the architecture of a simple AI agent app. Label where the LLM call, tool call, and database read happen.

---

## Module 08 — AI Coding Tools Ecosystem

*Every AI coding tool explained and compared — choose what works for you*

- 08.01 Claude Code — terminal-based AI coding; what it is and when to use it
  - Task: Open Claude Code in your terminal. Type: `claude` and send a simple message.
- 08.02 Cursor — the AI IDE; integrating Claude or GPT-4 into your editor
  - Task: Open a project in Cursor. Use Cmd/Ctrl+K to ask it to write a simple Python function.
- 08.03 Windsurf — closest alternative to Cursor with generous free tier
  - Task: Install Windsurf. Open the same project and compare how the AI chat feels.
- 08.04 GitHub Copilot — AI inside any editor via extension
  - Task: Install the GitHub Copilot extension in VS Code. Start typing a function name and observe autocomplete.
- 08.05 Gemini CLI — 1,000 free requests/day; most generous free tier
  - Task: Install Gemini CLI and run your first command. Compare response quality to Claude Code on the same prompt.
- 08.06 Cline — free open-source, runs in VS Code, works with any model
  - Task: Install Cline in VS Code and connect it to the Anthropic API using your .env key.
- 08.07 Aider — terminal-based, git-native, completely free with your own API key
  - Task: Install Aider and run it inside your git repo. Ask it to add a comment to one of your Python files.
- 08.08 Continue.dev — open-source Copilot alternative for VS Code/JetBrains
  - Task: Install Continue.dev in VS Code. Use it to explain a piece of code you don't fully understand.
- 08.09 Bolt.new and v0.dev — generate full apps from a text prompt
  - Task: Go to bolt.new. Type: "Build a simple to-do list app." Observe what gets generated in under 60 seconds.
- 08.10 Replit — browser-based coding with AI, no local setup needed
  - Task: Create a free Replit account. Start a new Python repl and use Replit AI to write a hello world script.
- 08.11 Decision guide: how to choose based on budget, skill level, use case
  - Task: Fill in the decision framework for your own situation: budget, skill level, and primary use case.

---

## Module 09 — Deployment: Taking Your Work Live

*Ship it — moving your work from your laptop to the world*

- 09.01 What deployment means — moving code from laptop to a live server
  - Task: In one sentence, explain deployment to someone who has never coded.
- 09.02 Frontend vs backend vs full-stack deployment — how they differ
  - Task: Identify which type of deployment you would need for: a static portfolio, a Python API, and a full chat app.
- 09.03 Vercel — go-to for frontend; free tier, auto-deploys from GitHub
  - Task: Create a Vercel account. Connect your GitHub and deploy your `index.html` file. Get a live URL.
- 09.04 Render — supports Python and Node; free tier for backend
  - Task: Create a Render account. Deploy your FastAPI hello world app. Confirm the API endpoint is accessible.
- 09.05 Supabase as deployment target — your live database in production
  - Task: Add your `ANTHROPIC_API_KEY` as an environment variable in Vercel or Render.
- 09.06 Alternatives overview: Netlify, GitHub Pages, Railway, Fly.io, Cloudflare Pages
  - Task: Read through the comparison table. Write one sentence on why you would or would not choose each.
- 09.07 The deployment workflow: push to GitHub â†’ connect to platform â†’ auto-deploy
  - Task: Make a small change, push to GitHub, and confirm the platform auto-deploys within seconds.
- 09.08 Environment variables on server: keeping API keys safe in production
  - Task: Add your `ANTHROPIC_API_KEY` as an environment variable in Vercel. Confirm the app works without a local .env.
- 09.09 What a build process is — why code gets transformed before going live
  - Task: In Vercel, open the deployment logs and find the build step. Read what commands ran.
- 09.10 Reading deployment logs: finding and fixing what broke
  - Task: Intentionally introduce a typo in your code and push it. Read the deployment log error and fix it.
- 09.11 What a domain is, what DNS is, why your app needs both
  - Task: Search for a domain name you would like for a future project. Note availability and cost.
- 09.12 Custom domains: connecting a domain name to your deployed app
  - Task: In Vercel, navigate to Domain Settings and read the steps for adding a custom domain.
- 09.13 Free vs paid: when the free tier runs out and what happens next
  - Task: Check the current usage limits on Vercel and Render free tiers. Estimate how much traffic hits the limit.
- 09.14 Decision framework: matching project type and budget to the right platform
  - Task: Apply the decision framework to your own first real project. Write down which platforms you will use and why.

---

## Module 10 — Mini Projects

*Put it all together — nine small projects that prove you are ready*

- 10.01 Project 1: Hello Claude — a Python script that calls the API and prints a response
- 10.02 Project 2: Prompt tester — send three different prompts and compare outputs
- 10.03 Project 3: .env reader — a script that loads credentials securely and confirms they work
- 10.04 Project 4: File summariser — read a .txt file and ask Claude to summarise it
- 10.05 Project 5: Commit log — a git repo with at least five meaningful commits
- 10.06 Project 6: Static webpage — a deployed HTML page with your name and a short bio
- 10.07 Project 7: FastAPI endpoint — a /chat route that accepts a message and returns a Claude response
- 10.08 Project 8: Supabase logger — save every API response to a database table
- 10.09 Project 9: Capstone — a deployed chat interface that calls Claude and logs conversations

---

## What Comes Next

After completing all 9 modules, learners move directly into the Beginner tier of the Seekvana Agentic AI curriculum.

**At that point they will have:**
- A fully configured development environment
- Confidence using the terminal and reading code
- A working GitHub profile with committed projects
- A live deployed project with a real URL
- Experience making real API calls to Claude
- A surface-level understanding of frontend, backend, and databases
- Familiarity with the full AI coding tools ecosystem

**They will not be expert coders.** They will be exactly what the Agentic AI course needs: curious, tool-equipped, and unafraid to run a command.

---

## A Taste of What's Ahead in the Agentic AI Curriculum

- **Module 1:** Build your first autonomous agent that browses the web, reads pages, and summarises findings
- **Module 2:** Give that agent memory — so it remembers context across conversations
- **Module 3:** Connect it to real tools: email, calendar, and APIs
- **By the end of the Beginner tier:** Ship a working AI assistant you built yourself, from scratch

---

*Launchpad · Seekvana Agentic AI Pre-course · June 2026*
*9 modules · 93 topics · 93 hands-on tasks*
