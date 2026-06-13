import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfInfo, setPdfInfo] = useState(null);

  // When user picks a PDF file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploaded(false);
    setMessages([]);
  };

  // Upload the PDF to backend
  const handleUpload = async () => {
    if (!file) return alert('Please select a PDF first!');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/upload', formData);
      setPdfInfo(res.data);
      setUploaded(true);
      setMessages([{ 
        role: 'system', 
        text: `✅ "${file.name}" uploaded! ${res.data.pages} pages. Now ask me anything about it.` 
      }]);
    } catch (err) {
      alert('Failed to upload PDF. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Send question to backend
  const handleAsk = async () => {
    if (!question.trim()) return;
    if (!uploaded) return alert('Please upload a PDF first!');

    const userMessage = { role: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/chat', { question });
      const aiMessage = { role: 'ai', text: res.data.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Allow pressing Enter to send question
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAsk();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📄 AI PDF Chat</h1>
        <p>Upload a PDF and ask questions about it</p>
      </header>

      <div className="container">
        {/* Upload Section */}
        <div className="upload-section">
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange}
            id="file-input"
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? `📄 ${file.name}` : '📂 Choose a PDF file'}
          </label>
          <button 
            onClick={handleUpload} 
            disabled={!file || loading}
            className="upload-btn"
          >
            {loading && !uploaded ? 'Uploading...' : 'Upload PDF'}
          </button>
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          <div className="messages">
            {messages.length === 0 && (
              <p className="placeholder">Upload a PDF to start chatting with it 👆</p>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <span className="role-label">
                  {msg.role === 'user' ? '🧑 You' : msg.role === 'ai' ? '🤖 AI' : 'ℹ️'}
                </span>
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && uploaded && (
              <div className="message ai">
                <span className="role-label">🤖 AI</span>
                <p>Thinking...</p>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="input-area">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your PDF..."
              disabled={!uploaded || loading}
              className="question-input"
            />
            <button 
              onClick={handleAsk} 
              disabled={!uploaded || loading || !question.trim()}
              className="ask-btn"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;