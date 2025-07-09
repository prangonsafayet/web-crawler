package models

type Result struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	URLID         uint   `json:"url_id"`
	Title         string `json:"title"`
	HTMLVersion   string `json:"html_version"`
	HasLoginForm  bool   `json:"has_login_form"`
	H1Count       int    `json:"h1"`
	H2Count       int    `json:"h2"`
	H3Count       int    `json:"h3"`
	InternalLinks int    `json:"num_internal_links"`
	ExternalLinks int    `json:"num_external_links"`
	BrokenLinks   int    `json:"num_inaccessible_links"`
}
