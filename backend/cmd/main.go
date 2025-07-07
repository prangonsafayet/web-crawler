package main

import (
	"os"

	"github.com/safayetprangon/web-crawler/backend/config"
	"github.com/safayetprangon/web-crawler/backend/models"
)

func main() {
	config.ConnectDatabase()

	// Auto-migrate tables
	config.DB.AutoMigrate(&models.URL{}, &models.Result{}, &models.Link{})

	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "8080"
	}
}
