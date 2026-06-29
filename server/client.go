package main

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

// Client is the server-side representation of a single WebSocket connection.
type Client struct {
	hub        *Hub
	connection *websocket.Conn
	send       chan []byte
}

// readPump reads messages from the WebSocket and forwards them to the Hub.
func (client *Client) readPump() {
	defer func() {
		client.hub.unregister <- client
		client.connection.Close()
	}()

	for {
		_, rawMessage, readError := client.connection.ReadMessage()
		if readError != nil {
			break
		}

		var message Message
		unmarshalError := json.Unmarshal(rawMessage, &message)
		if unmarshalError != nil {
			continue
		}

		broadcastBytes, marshalError := json.Marshal(message)
		if marshalError != nil {
			continue
		}

		client.hub.broadcast <- broadcastBytes
	}
}

// writePump reads messages from the send channel and writes them to the WebSocket.
func (client *Client) writePump() {
	defer client.connection.Close()

	for {
		message, channelOpen := <-client.send

		if !channelOpen {
			break
		}

		writeError := client.connection.WriteMessage(websocket.TextMessage, message)

		if writeError != nil {
			break
		}
	}
}
