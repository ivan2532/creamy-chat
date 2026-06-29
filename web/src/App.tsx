import { useEffect, useRef, useState } from 'react'
import './App.css'

interface ChatMessage {
  sender: string
  text: string
}

function App() {
  const [username, setUsername] = useState<string | null>(null)
  const [usernameInput, setUsernameInput] = useState("")

  const webSocket = useRef<WebSocket | null>(null)
  useEffect(() => {
    webSocket.current = new WebSocket("ws://localhost:8080/ws")

    webSocket.current.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as ChatMessage
      setMessages(prev => [...prev, message])
    }

    return () => {
      webSocket.current?.close()
    }
  }, [])

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState("")

  function handleSend() {
    if (inputText.trim() === "") return

    const newMessage: ChatMessage = { sender: username as string, text: inputText }
    webSocket.current?.send(JSON.stringify(newMessage))
    setInputText("")
  }

  if (!username)
  {
    return (
      <div className="username-input">
        <input
          type="text"
          value={usernameInput}
          onChange={(event) => setUsernameInput(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") setUsername(usernameInput) }}
          placeholder="Enter your username..."
        />
        <button onClick={() => setUsername(usernameInput)}>Submit</button>
      </div>
    )
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