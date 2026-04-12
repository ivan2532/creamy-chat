import { useState } from 'react'
import './App.css'

interface ChatMessage {
  sender: string
  text: string
}

const initialMessages: ChatMessage[] = [
  { sender: "Alice", text: "Hey! Can you hear me?" },
  { sender: "Bob", text: "Loud and clear! WebRTC when?" },
  { sender: "Alice", text: "Soon. First we learn React." },
]

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputText, setInputText] = useState("")

  function handleSend() {
    if (inputText.trim() === "") return

    const newMessage: ChatMessage = { sender: "You", text: inputText }
    setMessages([...messages, newMessage])
    setInputText("")
  }

  return (
    <div className="chat-container">
      <div className="chat-header">creamy-chat</div>

      <div className="message-list">
        {
          messages.map((message, index) =>
            <div className="message" key={index}>
              <div className="sender">{message.sender}</div>
              <div className="text">{message.text}</div>
            </div>
          )
        }
      </div>

      <div className="message-input">
        <input
          type="text"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") handleSend() }}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>

    </div>
  )
}

export default App