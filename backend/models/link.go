package models

type Link struct {
  ID         uint   `gorm:"primaryKey" json:"id"`
  URLID      uint   `json:"url_id"`
  Href       string `json:"href"`
  Internal   bool   `json:"internal"`
  StatusCode int    `json:"status_code"`
}
