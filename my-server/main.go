package main

import (
	"encoding/json"
	"fmt"
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

var baseDir string

func init() {
	var err error
	baseDir, err = os.Getwd()
	if err != nil {
		log.Fatalf("Failed to get current directory: %v", err)
	}
	log.Printf("Base directory: %s", baseDir)
}

func getFilePath(directory, fileName string) string {
	return filepath.Join(baseDir, directory, fileName)
}

func main() {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:3000"}
	r.Use(cors.New(config))

	r.POST("/api/save", func(c *gin.Context) {
		var req SaveRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		filePath := getFilePath(req.Directory, req.FileName)
		log.Printf("Attempting to save file: %s", filePath)

		if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create directory: %v", err)})
			return
		}

		jsonBytes, err := json.MarshalIndent(req.JSONData, "", "  ")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to marshal JSON: %v", err)})
			return
		}

		if err := os.WriteFile(filePath, jsonBytes, 0644); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to write file: %v", err)})
			return
		}

		log.Printf("File saved successfully: %s", filePath)
		c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Data saved to %s", filePath)})
	})

	r.GET("/api/fetch", func(c *gin.Context) {
		directory := c.Query("directory")
		fileName := c.Query("fileName")

		filePath := getFilePath(directory, fileName)
		log.Printf("Attempting to read file: %s", filePath)

		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("File not found: %s", filePath)})
			return
		}

		info, err := os.Stat(filePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to get file info: %v", err)})
			return
		}
		log.Printf("File permissions: %v", info.Mode())

		jsonBytes, err := os.ReadFile(filePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to read file: %v", err)})
			return
		}

		var jsonData interface{}
		if err := json.Unmarshal(jsonBytes, &jsonData); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to parse JSON: %v", err)})
			return
		}

		log.Printf("File read successfully: %s", filePath)
		c.JSON(http.StatusOK, jsonData)
	})

	log.Printf("Starting server on :8080")
	log.Fatal(r.Run(":8080"))
}
