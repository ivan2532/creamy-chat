package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var hub = newHub()

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(request *http.Request) bool {
		return true
	},
}

func main() {
	go hub.run()

	http.HandleFunc("/", hello)
	http.HandleFunc("/ws", handleWebSocket)

	fmt.Println("Server listening on port 8080.")
	http.ListenAndServe(":8080", nil)
}

func hello(responseWriter http.ResponseWriter, request *http.Request) {
	fmt.Fprintln(responseWriter, "Hello from creamy-chat!")
}

func handleWebSocket(responseWriter http.ResponseWriter, request *http.Request) {
	connection, upgradeError := upgrader.Upgrade(responseWriter, request, nil)

	if upgradeError != nil {
		return
	}

	client := Client{
		hub:        hub,
		connection: connection,
		send:       make(chan []byte, 256),
	}

	hub.register <- &client

	go client.readPump()
	go client.writePump()
}
