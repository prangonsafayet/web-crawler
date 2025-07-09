package crawler

import (
	"net/http"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/safayetprangon/web-crawler/backend/config"
	"github.com/safayetprangon/web-crawler/backend/models"
)

func Start() {
	go func() {
		for {
			var urls []models.URL
			config.DB.Preload("Results").Where("status = ?", "queued").Find(&urls)

			for _, u := range urls {
				go crawl(u)
			}
			time.Sleep(5 * time.Second)
		}
	}()
}

func crawl(u models.URL) {
	config.DB.Model(&u).Update("status", "running")

	res, err := http.Get(u.URL)
	if err != nil {
		config.DB.Model(&u).Update("status", "error")
		return
	}
	defer res.Body.Close()

	doc, _ := goquery.NewDocumentFromReader(res.Body)

	result := models.Result{
		Title:        doc.Find("title").Text(),
		HTMLVersion:  getHTMLVersion(doc),
		HasLoginForm: doc.Find("input[type='password']").Length() > 0,
		H1Count:      doc.Find("h1").Length(),
		H2Count:      doc.Find("h2").Length(),
		H3Count:      doc.Find("h3").Length(),
	}

	base := strings.TrimPrefix(u.URL, "http://")
	base = strings.TrimPrefix(base, "https://")
	base = strings.Split(base, "/")[0]

	links := []models.Link{}
	internal, external, broken := 0, 0, 0

	doc.Find("a").Each(func(i int, s *goquery.Selection) {
		href, exists := s.Attr("href")
		if !exists || href == "" {
			return
		}

		if strings.HasPrefix(href, "#") ||
			strings.HasPrefix(href, "javascript:") ||
			strings.HasPrefix(href, "mailto:") ||
			strings.HasPrefix(href, "tel:") {
			return
		}

		fullURL := href
		if strings.HasPrefix(href, "/") {
			fullURL = "https://" + base + href
		} else if strings.HasPrefix(href, "//") {
			fullURL = "https:" + href
		} else if !strings.HasPrefix(href, "http") {
			return
		}

		alreadyAdded := false
		for _, l := range links {
			if l.Href == fullURL {
				alreadyAdded = true
				break
			}
		}
		if alreadyAdded {
			return
		}

		internalLink := strings.Contains(fullURL, base)
		status := getStatus(fullURL)

		if internalLink {
			internal++
		} else {
			external++
		}
		if status >= 400 {
			broken++
		}

		links = append(links, models.Link{
			Href:       fullURL,
			Internal:   internalLink,
			StatusCode: status,
		})
	})

	result.InternalLinks = internal
	result.ExternalLinks = external
	result.BrokenLinks = broken

	result.URLID = u.ID
	config.DB.Create(&result)

	for _, l := range links {
		l.URLID = u.ID
		config.DB.Create(&l)
	}

	config.DB.Model(&u).Update("status", "done")
}

func getStatus(url string) int {
	res, err := http.Get(url)
	if err != nil {
		return 500
	}
	defer res.Body.Close()
	return res.StatusCode
}
func getHTMLVersion(doc *goquery.Document) string {
	doctype := doc.Nodes[0].FirstChild.Data
	if strings.Contains(doctype, "HTML 4.01") {
		return "HTML 4.01"
	}
	if strings.Contains(doctype, "XHTML") {
		return "XHTML"
	}
	return "HTML5"
}
