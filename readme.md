# Ionic RAG Chatbot

A modern mobile-first Retrieval-Augmented Generation (RAG) chatbot platform built using:

* [Ionic Framework](https://ionicframework.com<ion-content class="messages-content">)
* [Angular](https://angular.dev<ion-content class="messages-content">)
* [Capacitor](https://capacitorjs.com<ion-content class="messages-content">)
* [FastAPI](https://fastapi.tiangolo.com<ion-content class="messages-content">)
* [LangChain](https://www.langchain.com<ion-content class="messages-content">)
* [Groq](https://groq.com<ion-content class="messages-content">)
* [FAISS](https://github.com/facebookresearch/faiss<ion-content class="messages-content">)

This project provides a complete AI assistant platform with:

* Document ingestion
* Semantic search
* RAG pipelines
* Persistent conversations
* Speech-to-text
* Text-to-speech
* Mobile-first UI
* Android support
* Conversation memory
* Source citations

---

# Features

## Authentication

* Login page
* Route guards
* Persistent sessions
* User-based conversations

---

# Chatbot

* ChatGPT-style UI
* Persistent conversations
* Conversation sidebar
* Auto conversation titles
* Conversation history
* Multi-chat support
* User/assistant message rendering
* Typing loaders
* Source display
* Mobile responsive layout

---

# RAG Pipeline

* PDF ingestion
* Document uploads
* FAISS vector database
* Semantic retrieval
* LangChain pipelines
* Context-aware responses
* Source extraction
* Rebuild vector index
* Document deletion
* Duplicate prevention support

---

# Voice Features

## Speech-to-Text (STT)

* Browser microphone recording
* FastAPI STT endpoint
* Voice transcription
* Append transcription to prompt
* Recording states/spinners

## Text-to-Speech (TTS)

* Generate assistant voice responses
* Play/Pause support
* Audio caching
* Reuse generated audio
* Per-message playback controls

---

# Tech Stack

## Frontend

* [Ionic Angular](https://ionicframework.com<ion-content class="messages-content">)
* [Angular Standalone Components](https://angular.dev/guide/standalone-components<ion-content class="messages-content">)
* [Capacitor](https://capacitorjs.com<ion-content class="messages-content">)
* TypeScript
* SCSS
* RxJS

---

## Backend

* [FastAPI](https://fastapi.tiangolo.com<ion-content class="messages-content">)
* [LangChain](https://www.langchain.com<ion-content class="messages-content">)
* [Groq](https://groq.com<ion-content class="messages-content">)
* SQLite
* SQLAlchemy Async
* FAISS
* Python

---

# Architecture

```text
Frontend (Ionic Angular)
        │
        ▼
FastAPI Backend
        │
        ├── Authentication
        ├── Conversation APIs
        ├── STT/TTS APIs
        ├── RAG APIs
        │
        ▼
LangChain Pipeline
        │
        ▼
FAISS Vector Store
        │
        ▼
LLM (Groq/OpenAI)
```

---

# Project Structure

```bash
ionic_rag/
│
├── backend/
│   │
│   ├── app.py
│   │
│   ├── config/
│   │
│   ├── database/
│   │   ├── database.py
│   │   └── models.py
│   │
│   ├── dependencies/
│   │
│   ├── routers/
│   │   ├── chat.py
│   │   ├── conversations.py
│   │   ├── upload.py
│   │   ├── rag.py
│   │   └── health.py
│   │
│   ├── schemas/
│   │
│   ├── services/
│   │   ├── rag_service.py
│   │   ├── llm_service.py
│   │   ├── vectorstore_service.py
│   │   ├── conversation_service.py
│   │   ├── stt_service.py
│   │   └── audio_service.py
│   │
│   ├── uploads/
│   │
│   ├── vectorstore/
│   │
│   ├── chatbot.db
│   │
│   └── requirements.txt
│
├── frontend/
│   │
│   └── myapp/
│       │
│       ├── src/
│       │   ├── app/
│       │   ├── pages/
│       │   ├── core/
│       │   └── guards/
│       │
│       ├── android/
│       │
│       ├── capacitor.config.ts
│       │
│       └── package.json
│
└── README.md
```

---

# Backend Setup

## Create Environment

```bash
conda create -n botenv python=3.11

conda activate botenv
```

---

# Install Dependencies

## Core Backend

```bash
pip install fastapi uvicorn python-dotenv
```

## LangChain

```bash
pip install langchain
pip install langchain-groq
pip install langchain-community
```

## Database

```bash
pip install sqlalchemy aiosqlite
```

## Vector Store

```bash
pip install faiss-cpu
```

## PDF Processing

```bash
pip install pypdf
```

## Embeddings

```bash
pip install sentence-transformers
```

## Speech-to-Text

```bash
pip install openai-whisper
```

## Text-to-Speech

```bash
pip install gtts
```

---

# Environment Variables

Create:

```bash
backend/.env
```

Example:

```env
GROQ_API_KEY=your_groq_api_key

OPENAI_API_KEY=your_openai_api_key
```

---

# Run Backend

```bash
cd backend

uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger Docs:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

```bash
cd frontend/myapp
```

---

# Install Dependencies

```bash
npm install
```

---

# Run Web App

```bash
ionic serve
```

Frontend:

```text
http://localhost:8100
```

---

# Android Setup

## Add Android

```bash
ionic capacitor add android
```

---

# Build Frontend

```bash
ionic build
```

---

# Sync Capacitor

```bash
npx cap sync android
```

---

# Open Android Studio

```bash
ionic cap open android
```

---

# Run On Real Android Device

Enable:

* Developer Options
* USB Debugging

---

# Verify Device

```bash
adb devices
```

---

# Reverse Backend Port

```bash
adb reverse tcp:8000 tcp:8000
```

---

# Run App

```bash
ionic cap run android
```

---

# Live Reload

```bash
ionic cap run android -l --external
```

---

# API Endpoints

## Conversations

### Create Conversation

```http
POST /api/v1/conversations
```

### Get User Conversations

```http
GET /api/v1/conversations
```

### Get Messages

```http
GET /api/v1/conversations/{conversation_id}
```

### Delete Conversation

```http
DELETE /api/v1/conversations/{conversation_id}
```

---

## Chat

### Send Message

```http
POST /api/v1/chat
```

---

## Documents

### Upload Documents

```http
POST /api/v1/documents/upload
```

### List Documents

```http
GET /api/v1/documents
```

### Delete Documents

```http
DELETE /api/v1/documents
```

### Delete All Documents

```http
DELETE /api/v1/documents/all
```

---

## Speech

### Speech-to-Text

```http
POST /api/v1/chat/speech-to-text
```

### Text-to-Speech

```http
POST /api/v1/chat/audio
```

---

# Current Capabilities

* Persistent conversations
* Mobile responsive UI
* Vector retrieval
* Voice input/output
* RAG chat pipeline
* Conversation memory
* Source-aware responses
* FAISS vector search
* Android support
* Chat history
* User-based chat isolation

---

# Planned Features

* JWT authentication
* Streaming responses
* Markdown rendering
* Image uploads
* OCR support
* Hybrid search
* Conversation export
* User management
* Docker deployment
* Kubernetes deployment
* Multi-model routing
* WebSocket streaming
* Offline embeddings
* Redis caching

---

# Development Status

🚧 Active Development

This project is under continuous development and improvement.

---

# Author

**Moinuddin**
