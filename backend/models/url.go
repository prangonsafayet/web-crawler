package models

import "gorm.io/gorm"

type URL struct {
  gorm.Model
  URL     string  `json:"url"`
  Status  string  `json:"status"` // queued, running, done, error
  Results Result  `json:"results"`
  Links   []Link  `json:"links"`
}
