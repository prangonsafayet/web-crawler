package models

type Result struct {
  ID              uint   `gorm:"primaryKey"`
  URLID           uint
  Title           string
  HTMLVersion     string
  HasLoginForm    bool
  H1Count         int
  H2Count         int
  H3Count         int
  InternalLinks   int
  ExternalLinks   int
  BrokenLinks     int
}
