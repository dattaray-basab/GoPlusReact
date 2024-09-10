package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Config struct {
	AppBaseURL     string `json:"APP_BASE_URL"`
	HostAppPort    int    `json:"HOST_APP_PORT"`
	HostServerPort int    `json:"HOST_SERVER_PORT"`
}

func loadConfig() (Config, error) {
	var config Config
	configPath := os.Getenv("CONFIG_PATH")
	if configPath == "" {
		return config, fmt.Errorf("CONFIG_PATH environment variable is not set")
	}

	file, err := os.ReadFile(configPath)
	if err != nil {
		return config, fmt.Errorf("failed to read config file at %s: %v", configPath, err)
	}

	err = json.Unmarshal(file, &config)
	if err != nil {
		return config, fmt.Errorf("failed to parse config file: %v", err)
	}

	return config, nil
}

func main() {
	config, err := loadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{fmt.Sprintf("%s:%d", config.AppBaseURL, config.HostAppPort)}
	r.Use(cors.New(corsConfig))

	log.Printf("Starting server on :%d", config.HostServerPort)
	log.Fatal(r.Run(fmt.Sprintf(":%d", config.HostServerPort)))
}
