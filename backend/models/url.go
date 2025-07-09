package models

import (
	"time"
)

type URL struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	URL       string    `json:"url"`
	Status    string    `json:"status"`
	Results   Result    `gorm:"constraint:OnDelete:CASCADE;" json:"results"`
	Links     []Link    `gorm:"constraint:OnDelete:CASCADE;" json:"links"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt *time.Time `gorm:"index" json:"deleted_at,omitempty"`
}
