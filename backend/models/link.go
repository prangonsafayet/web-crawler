package models

type Link struct {
  ID         uint   `gorm:"primaryKey"`
  URLID      uint
  Href       string
  Internal   bool
  StatusCode int
}
