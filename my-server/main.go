package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type SaveRequest struct {
	JSONData  interface{} `json:"jsonData"`
	Directory string      `json:"directory"`
	FileName  string      `json:"fileName"`
}

func main() {
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Allow requests from React app
	r.Use(cors.New(config))

	r.POST("/api/save", func(c *gin.Context) {
		var req SaveRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Create directory if it doesn't exist
		if err := os.MkdirAll(req.Directory, os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		// Create file path
		filePath := filepath.Join(req.Directory, req.FileName)

		// Convert JSON data to bytes
		jsonBytes, err := json.MarshalIndent(req.JSONData, "", "  ")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal JSON"})
			return
		}

		// Write to file
		if err := ioutil.WriteFile(filePath, jsonBytes, 0644); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write file"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Data saved to %s", filePath)})
	})

	r.GET("/api/fetch", func(c *gin.Context) {
		directory := c.Query("directory")
		fileName := c.Query("fileName")

		filePath := filepath.Join(directory, fileName)

		// Read file
		jsonBytes, err := ioutil.ReadFile(filePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
			return
		}

		// Parse JSON
		var jsonData interface{}
		if err := json.Unmarshal(jsonBytes, &jsonData); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse JSON"})
			return
		}

		c.JSON(http.StatusOK, jsonData)
	})

	log.Fatal(r.Run(":8080"))
}