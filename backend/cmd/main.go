package main

import (
	"fmt"
	"log"

	"github.com/safayetprangon/web-crawler/backend/config"
)

func main() {
	// Initialize DB connection
	config.ConnectDatabase()

	// Optional test query using GORM to fetch current time from MySQL
	var now string
	result := config.DB.Raw("SELECT NOW()").Scan(&now)
	if result.Error != nil {
		log.Fatalf("❌ Failed test query: %v", result.Error)
	}

	fmt.Println("🕒 Current time from DB:", now)
}
