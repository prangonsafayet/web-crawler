package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/safayetprangon/web-crawler/backend/config"
	"github.com/safayetprangon/web-crawler/backend/models"
)

func CreateURL(c *gin.Context) {
	var input struct {
		URL string `json:"url"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	url := models.URL{URL: input.URL, Status: "queued"}
	config.DB.Create(&url)
	c.JSON(http.StatusCreated, url)
}

func GetAllURLs(c *gin.Context) {
	var urls []models.URL
	config.DB.Preload("Results").Find(&urls)
	c.JSON(http.StatusOK, urls)
}

func GetURLDetail(c *gin.Context) {
	id := c.Param("id")
	var url models.URL
	config.DB.Preload("Results").Preload("Links").First(&url, id)
	c.JSON(http.StatusOK, url)
}

func RerunURL(c *gin.Context) {
	id := c.Param("id")
	config.DB.Model(&models.URL{}).Where("id = ?", id).Update("status", "queued")
	c.JSON(http.StatusOK, gin.H{"status": "requeued"})
}

func DeleteURL(c *gin.Context) {
	id := c.Param("id")
	config.DB.Delete(&models.URL{}, id)
	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
