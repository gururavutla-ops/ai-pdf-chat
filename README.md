# 📄 AI PDF Chat

An AI-powered web app that lets you upload any PDF and chat with it using natural language.

## Features
- Upload any PDF file
- Ask questions about the document
- Get instant AI-powered answers using Groq LLM (Llama 3.1)
- Clean chat interface

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI:** Groq API (Llama 3.1)
- **PDF Parsing:** pdf-parse

## How to Run Locally

### Backend
```bash
cd backend
npm install
# Create .env file with GROQ_API_KEY=your_key
node server.js
---
### Fronted
```bash
cd frontend
npm install
npm run dev
