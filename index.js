const path = require('path');
const fs = require('fs');

// Dynamically load the correct environment file where your Gemini key is stored
const envFilePath = fs.existsSync(path.join(__dirname, 'gapi.env')) ? 'gapi.env' : '.env';
require('dotenv').config({ path: envFilePath });

const express = require('express');
const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');
const { URL } = require('url');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/audit', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Please provide a "url" in the JSON body.' });
    }

    try {
        // Validate and normalize the URL
        const targetUrl = new URL(url);

        // Fetch HTML content from the URL
        const response = await axios.get(targetUrl.href, {
            timeout: 15000, // 15 second timeout to prevent hanging forever
            maxRedirects: 5,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass strict SSL issues for strict local domains
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // 1. Total Word Count (Extracting inner text from body and splitting by whitespace)
        // We remove style and script tags to not count JS/CSS code as words.
        $('script, style, noscript').remove();
        const bodyText = $('body').text();
        const words = bodyText.replace(/\s+/g, ' ').trim().split(' ').filter(word => word.length > 0);
        const wordCount = words.length;

        // 2. Number of H1-H3 tags
        const h1Count = $('h1').length;
        const h2Count = $('h2').length;
        const h3Count = $('h3').length;

        // Extracted CTAs (Buttons and Primary Action Links)
        const ctaCount = $('button, a[class*="btn"], a[class*="button"], input[type="submit"], input[type="button"]').length;

        // 3. Number of links (Internal vs External)
        let internalLinks = 0;
        let externalLinks = 0;

        $('a').each((_, element) => {
            const href = $(element).attr('href');
            if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
                try {
                    // Resolve relative URLs
                    const linkUrl = new URL(href, targetUrl.href);

                    if (linkUrl.hostname === targetUrl.hostname) {
                        internalLinks++;
                    } else {
                        externalLinks++;
                    }
                } catch (e) {
                    // Ignore improperly formatted invalid URLs
                }
            }
        });

        // 4. Number of images & 5. Images missing alt text
        const images = $('img');
        const countImages = images.length;
        let imagesMissingAltCount = 0;

        images.each((_, element) => {
            const alt = $(element).attr('alt');
            // If alt attribute is missing entirely, or is an empty string, we consider it missing/empty
            if (alt === undefined || alt.trim() === '') {
                imagesMissingAltCount++;
            }
        });

        const imagesMissingAltPercentage = countImages > 0 ? Math.round((imagesMissingAltCount / countImages) * 100) : 0;

        // 6. Meta Title and Description
        const metaTitle = $('title').text() || $('meta[name="title"]').attr('content') || $('meta[property="og:title"]').attr('content') || null;
        let metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || null;

        const auditData = {
            url: targetUrl.href,
            wordCount,
            tags: {
                h1: h1Count,
                h2: h2Count,
                h3: h3Count
            },
            ctaCount,
            links: {
                total: internalLinks + externalLinks,
                internalLinks,
                externalLinks
            },
            images: {
                totalImages: countImages,
                imagesMissingAltText: imagesMissingAltCount,
                missingAltPercentage: imagesMissingAltPercentage
            },
            meta: {
                title: metaTitle,
                description: metaDescription
            }
        };

        const systemPrompt = "You are an expert SEO and Web auditor. I am going to give you factual metrics about a website. You must generate 3-5 specific, prioritized recommendations for SEO, messaging, and UX based strictly on these numbers. Do not be generic.";

        // Your API key is registered on the newest Gemini 2.5 architecture which explicitly supersedes legacy 1.0 and 1.5.
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });

        const prompt = `Here are the factual metrics:\n${JSON.stringify(auditData, null, 2)}`;

        let aiInsights = null;
        try {
            const aiResponse = await model.generateContent(prompt);
            aiInsights = aiResponse.response.text();

            // Clean up potentially backticked JSON/Markdown if the model outputs formatting
            if (aiInsights.startsWith('```')) {
                aiInsights = aiInsights.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
            }
        } catch (aiError) {
            console.error('Error generating AI insights:', aiError.message);
            aiInsights = 'Failed to generate AI insights: ' + aiError.message;
        }

        res.json({
            factual_metrics: auditData,
            ai_insights: aiInsights
        });

    } catch (error) {
        console.error('Error processing URL:', error.message);

        // Let's create a beautiful failure message if the site is actively blocking us with a Firewall!
        let errorMessage = 'Failed to process the URL.';
        let statusCode = 500;

        if (error.response) {
            statusCode = error.response.status;
            if (statusCode === 403 || statusCode === 429 || statusCode === 503 || statusCode === 406) {
                errorMessage = 'This website is actively protected by an Anti-Bot Firewall (like Cloudflare or Vercel). They unfortunately block automated NodeJS scraping.';
            } else {
                errorMessage = `Website rejected our scraping request with status code: ${statusCode}`;
            }
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'The website took too long to respond (Timeout Limit Reached).';
        }

        return res.status(statusCode).json({
            error: errorMessage,
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = app;
