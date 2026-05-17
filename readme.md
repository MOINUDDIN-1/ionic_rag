# Ionic RAG Chatbot App

🚧 Work In Progress (WIP)

A mobile-first Retrieval-Augmented Generation (RAG) chatbot system built using:

- Ionic Angular
- Capacitor
- FastAPI
- LangChain
- Groq / OpenAI LLMs

This project is currently under active development.

---

# Features (Current)

- Mobile AI Chat UI
- FastAPI backend
- LangChain prompt pipelines
- Groq/OpenAI integration
- Android real-device support
- Ionic Angular frontend
- Capacitor native runtime

---

# Planned RAG Features

- PDF ingestion
- Document chunking
- Vector embeddings
- Semantic search
- Vector database integration
- Context-aware chat
- Multi-document retrieval
- Streaming responses
- Conversation memory
- Chat history
- Authentication
- Voice input

---

# Tech Stack

## Frontend
- Ionic Angular
- Capacitor
- TypeScript
- SCSS

## Backend
- FastAPI
- LangChain
- Groq / OpenAI
- Python

---

# Project Structure

```bash
ionic_rag_app/
│
├── backend/
│   ├── app.py
│   ├── llm_service.py
│   └── .env
│
├── myapp/
│   ├── src/
│   ├── android/
│   └── capacitor.config.ts
│
└── README.md
```

---

# Backend Setup

## Create Python Environment

```bash
conda create -n ionic python=3.11
conda activate ionic
```

## Install Dependencies

```bash
pip install fastapi uvicorn python-dotenv
pip install langchain langchain-openai langchain-groq
```

## Create `.env`

```env
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
```

## Run Backend

```bash
uvicorn app:app --reload --host 0.0.0.0
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Swagger docs:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

## Install Dependencies

```bash
npm install
```

## Run Web Version

```bash
ionic serve
```

---

# Android Setup

## Add Android Platform

```bash
ionic capacitor add android
```

## Build Frontend

```bash
ionic build
```

## Sync Capacitor

```bash
npx cap sync android
```

## Open Android Studio

```bash
ionic cap open android
```

---

# Run On Physical Android Device

Enable:
- Developer Options
- USB Debugging

Verify device:

```bash
adb devices
```

Reverse backend port:

```bash
adb reverse tcp:8000 tcp:8000
```

Run app:

```bash
ionic cap run android
```

---

# Live Reload

```bash
ionic cap run android -l --external
```

---

# Status

🚧 Under active development

This project is an experimental mobile RAG assistant currently being built and improved.

---

# Author

Moinuddin