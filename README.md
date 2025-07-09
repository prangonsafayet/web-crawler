# 🕷️ Web Crawler App

A full-stack web crawler that analyzes website URLs and displays structured data about:

- HTML version  
- Page title  
- Heading tag counts (H1–H6)  
- Internal vs. external links  
- Broken/inaccessible links (4xx/5xx)  
- Presence of a login form  

---

## 🧰 Tech Stack

- **Frontend**: React (Vite, TypeScript, Tailwind CSS, Chart.js, TanStack Table)  
- **Backend**: Golang (Gin, GORM, goquery)  
- **Database**: MySQL 8  
- **Containerized**: Docker & Docker Compose  

---

## 🚀 Features

### ✅ Backend

- Crawl and analyze a website  
- Parse and store structured metadata  
- Detect presence of login form  
- Differentiate between internal and external links  
- Detect broken links (HTTP 4xx/5xx)

### ✅ Frontend

- Add URLs for crawling  
- Live crawling status: **Queued → Running → Done/Error**  
- Sortable, filterable, paginated table  
- Global fuzzy search  
- Detail view: Donut chart + broken links list  
- Bulk actions: Re-run or delete selected URLs  
- Toast notifications and loading indicators  

---

## 📂 Project Structure
```
├── backend/                 → Go backend (Gin API)
├── frontend/                → React frontend (Vite + Tailwind CSS)
├── docker-compose.yml       → Docker Compose
├── .env                     → Environment variables file
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
# Database
DB_USER=root
DB_PASSWORD=
DB_NAME=crawler

# Backend Auth
AUTH_SECRET=yoursecretkey


FRONTEND_PORT=3000
BACKEND_PORT=8080

```

Create a `.env` file in the **backend** directory:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=''
DB_NAME=crawler
AUTH_SECRET=yoursecretkey
SELF_PORT=8080
```

Create a `.env` file in the **frontend** directory:

```
VITE_API_URL=http://localhost:8080
VITE_AUTH_TOKEN=yoursecretkey

```

---

## 🛠️ Development Setup

### 🔧 Prerequisites

- Docker & Docker Compose  
- (Optional) Node.js and Go (for running services locally)

### ▶️ Run Dev Stack

```bash
docker-compose up --build
```

**Available at:**

Frontend: http://localhost:3000

Backend API: http://localhost:8080

MySQL: localhost:3306

### 🧪 Frontend Testing

Basic happy-path tests using Vitest:

```bash
cd frontend
npm install
npm run test
```

## 🔐 API Security
All endpoints are secured via Bearer token.

Example:

http
```
GET /api/urls
Authorization: Bearer supersecrettoken
```
The token must match AUTH_SECRET from .env.


## 🧩 API Endpoints

| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| POST   | `/api/urls`               | Queue a new URL for crawling     |
| GET    | `/api/urls`               | List all crawled URLs            |
| GET    | `/api/urls/:id`           | Get details for one URL          |
| POST   | `/api/urls/:id/rerun`     | Re-run analysis for a URL        |
| DELETE | `/api/urls/:id`           | Delete a URL and its results     |

---

## 📸 Screenshots
![Web Crawler Dashboard](https://raw.githubusercontent.com/prangonsafayet/web-crawler/main/screenshots/dashboard.png)
![Web Crawler Dashboard](https://raw.githubusercontent.com/prangonsafayet/web-crawler/main/screenshots/detail-page.png)



