# AI Website Auditor 🚀

An intelligent, modern Node.js application that instantly scrapes websites for critical structural SEO & UX metrics and leverages Google's cutting-edge **Gemini 2.5 Flash AI** architecture to provide expert, prioritized website optimization recommendations. 

**Developed by Vethum Hewage**

---

## ✨ Features

- **Real-Time DOM Scraping**: Utilizes `axios` and `cheerio` to rapidly fetch and dissect target URLs.
- **Factual Metric Extraction**: Accurately counts words, header tags (H1-H3), internal/external links, and images (flagging those missing `alt` attributes).
- **Premium Frontend UI**: A bespoke, deeply customized vanilla HTML/CSS/JS interface featuring a dark maroon theme, glassmorphism UI elements, ambient glowing background animations, and responsive grids.
- **Gemini 2.5 AI Integration**: Automatically funnels factual metrics into an AI structured as an "Expert SEO & Web Auditor" to return specifically tailored improvements.
- **Resilient WAF Handling**: Natively identifies and intercepts requests halted by extreme `403` Cloudflare/Vercel Anti-Bot firewalls, passing intelligent failure UX to the frontend rather than crashing nodes.

## 🛠 Tech Stack

**Backend:**
- Node.js
- Express
- Axios & Cheerio (Scraping Engine)
- `@google/generative-ai` (Gemini API)
- `dotenv` 

**Frontend:**
- Vanilla HTML5 / CSS3 / JavaScript
- Google Fonts (`Outfit`)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed along with an active Google Gemini API Key.

### 2. Installation
Clone this repository and install the initial dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a file named `gapi.env` (or `.env`) in the root directory of the project, and add your exact Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run the Server
Start the Express API and static file web-server:
```bash
node index.js
```

### 5. Access the Platform
Open your browser and navigate to:
```
http://localhost:3000
```

Simply paste the URL of a website you'd like to analyze into the maroon search bar, and let the auditor provide its metrics and AI insights! 

---
Note : Gemini has only 20 API Requests allowed per date, when the quota Exceeded it will reset at 12AM
&copy; 2026 Vethum Hewage. All Rights Reserved.
