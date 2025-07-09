package main

import (
	"os"

	"github.com/safayetprangon/web-crawler/backend/config"
	"github.com/safayetprangon/web-crawler/backend/crawler"
	"github.com/safayetprangon/web-crawler/backend/models"
	"github.com/safayetprangon/web-crawler/backend/router"
)

func main() {
	config.ConnectDatabase()

	// Auto-migrate tables
	config.DB.AutoMigrate(&models.URL{}, &models.Result{}, &models.Link{})

	crawler.Start()

	r := router.SetupRouter()
	port := os.Getenv("8080")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
