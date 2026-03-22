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

## 🧠 Architecture & AI Strategy

### Architecture Overview
The application follows a clean client-server architecture. The frontend is a lightweight vanilla JS/HTML/CSS interface that communicates with a Node.js/Express backend. When a URL is submitted, the backend uses `axios` to fetch the raw HTML and `cheerio` to parse the DOM, extracting hard metrics (word count, headers, links, images). This factual JSON data is then piped securely into the Gemini 2.5 Flash model via the `@google/generative-ai` SDK. The final API response strictly separates the factual scraping payload from the generative AI insights.

### AI Design Decisions
To ensure the AI produces actionable, non-generic insights rather than hallucinated advice, the system relies on strict prompt engineering. 
1. **Data Grounding:** The model is explicitly provided with the scraped JSON metrics in the prompt.
2. **System Constraints:** The system prompt restricts the AI from making assumptions outside of the provided data points. For example, if the H1 count is 0, the AI is forced to address that specific structural flaw.
3. **Structured Output:** The AI is instructed to return its insights in a categorized format covering SEO, Messaging, UX, and Prioritized Recommendations to seamlessly map to the frontend UI.

### Trade-offs
Given the 24-hour time constraint, several deliberate trade-offs were made:
- **Scraping vs. Rendering:** I opted for static HTML parsing (`axios` + `cheerio`) rather than a headless browser (like Puppeteer). This makes the tool incredibly fast and lightweight, but it means client-side rendered content (like heavy React SPAs) might not be fully read.
- **Local Deployment:** I prioritized building a polished frontend UI and resilient error handling over setting up cloud hosting. The app runs locally with simple, reproducible setup instructions.

### What I Would Improve With More Time
- **Multi-Page Crawling:** Expanding the scope to crawl a site's sitemap to provide a holistic domain score rather than a single-page audit.
- **Headless Browser Integration:** Implementing Playwright or Puppeteer to execute JavaScript on the target pages, allowing the extraction of metrics from dynamically loaded web apps.
- **Proxy Rotation:** Adding proxy management to bypass aggressive anti-bot protections (like Cloudflare) that occasionally block standard `axios` requests.
- **PDF Export:** Allowing agencies to download the audit report as a branded PDF for immediate client presentation.

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
