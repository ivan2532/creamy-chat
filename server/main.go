package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", hello)

	fmt.Println("Server listening on port 8080.")
	http.ListenAndServe(":8080", nil)
}

func hello(responseWriter http.ResponseWriter, request *http.Request) {
	fmt.Fprintln(responseWriter, "Hello from creamy-chat!")
}
