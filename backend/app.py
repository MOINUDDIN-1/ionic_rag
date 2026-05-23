# app.py

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from config.settings import yaml_settings

from routers import (
    API_PREFIX,
    ALL_ROUTERS,
)


# =========================
# LIFESPAN
# =========================


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("===================================")
    print("Ionic RAG Chatbot API Started")
    print(f"Environment: {yaml_settings.app.env}")
    print("===================================")

    yield

    print("Shutting down API...")


# =========================
# APP
# =========================

app = FastAPI(title="Ionic RAG Chatbot API", version="0.0.1", lifespan=lifespan)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# HOME
# =========================


@app.get("/", response_class=HTMLResponse)
async def home():
    return """
    <html>
        <head>
            <title>Ionic RAG Chatbot API</title>
        </head>
        <body>
            <h1>Ionic RAG Chatbot API Running</h1>
        </body>
    </html>
    """


# =========================
# ROUTERS
# =========================

for router in ALL_ROUTERS:
    app.include_router(router, prefix=API_PREFIX)
