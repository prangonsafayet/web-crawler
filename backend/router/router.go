package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/safayetprangon/web-crawler/backend/handlers"
	"github.com/safayetprangon/web-crawler/backend/middleware"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "DELETE"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.Use(middleware.AuthMiddleware())

	r.POST("/urls", handlers.CreateURL)
	r.GET("/urls", handlers.GetAllURLs)
	r.GET("/urls/:id", handlers.GetURLDetail)
	r.POST("/urls/:id/rerun", handlers.RerunURL)
	r.DELETE("/urls/:id", handlers.DeleteURL)

	return r
}
