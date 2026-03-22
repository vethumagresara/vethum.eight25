# 📝 AI Prompt Engineering & Application Logs

This document tracks the structured prompt engineering, system instructions, and serialization schema utilized to accurately constrain and extract specific insights from the Gemini 2.5 Flash AI model.

---

## 1. System Prompt (Persona & Context Constraints)
*Engineered to rigorously restrict the Gemini AI architecture into outputting precise, actionable data audits rather than generic conversational filler.*

**System Instruction Parameter:**
```text
You are an expert SEO and Web auditor. I am going to give you factual metrics about a website. You must generate 3-5 specific, prioritized recommendations for SEO, messaging, and UX based strictly on these numbers. Do not be generic.
```

---

## 2. Dynamic Client Input (Data Serialization)
*Rather than utilizing a chat interface, raw DOM metrics are actively scraped server-side via Cheerio and injected programmatically into the prompt context window as a serialized JSON object. This structure guarantees high data fidelity and absolutely prevents model hallucination.*

**Example Template Injected to LLM:**
```json
Here are the factual metrics:
{
  "url": "https://example.com/",
  "wordCount": 17,
  "tags": {
    "h1": 1,
    "h2": 0,
    "h3": 0
  },
  "links": {
    "total": 1,
    "internalLinks": 0,
    "externalLinks": 1
  },
  "images": {
    "totalImages": 0,
    "imagesMissingAltText": 0
  },
  "meta": {
    "title": "Example Domain",
    "description": null
  }
}
```

---

## 3. Raw Model Output (Pre-Client Formatting)
*The raw, unstructured markdown chunk retrieved natively from the `@google/generative-ai` response object via `aiResponse.response.text()` before it is sanitized, parsed, formatted via Regex, and distributed to the DOM UI.*

**Raw Response Payload:**
```markdown
Based strictly on the foundational data provided for `https://example.com/`, here are the top prioritized recommendations for immediate improvement:

**1. Expand Thin Page Content (SEO & Messaging)**
The current word count sits at a critical low of 17 words. Search engine algorithms frequently classify pages under 300 words as "thin content," resulting in severe indexing penalties. 
*Recommendation:* Significantly elaborate on the core value proposition. Add detailed contextual paragraphs to boost topic authority, keyword density, and overall user dwell time.

**2. Formulate a Semantic Header Hierarchy (SEO)**
There is a single `H1` tag present, but exactly zero `H2` or `H3` tags. A lack of structural hierarchy actively hinders screen-readers and web-crawler bots from successfully interpreting page topology.
*Recommendation:* Separate expanded content sectors by injecting clear, keyword-researched `H2` subheadings, heavily supported by `H3` functional detail blocks. 

**3. Inject a Missing Meta Description (SEO & UX)**
The `<meta name="description">` attribute is mapped as `null`. While a rudimentary title is present ("Example Domain"), the lack of a proper description generates an unoptimized search snippet, resulting in rapidly declining click-through rates (CTR) on SERPs.
*Recommendation:* Write and inject a hyper-focused, 150-160 character meta description compelling users to click through to the domain.

**4. Establish Internal Architecture & Linking (UX)**
Currently, there is 1 external link, but exactly 0 internal navigation links. A total lack of internal routing inherently creates a dead-end page instance, guaranteeing a 100% bounce rate.
*Recommendation:* Deploy a standardized global navigation header highlighting internal routes (Features, Pricing, About Us) to distribute page authority and drastically improve user retention.
```

---

## 4. Security & Environment Configuration
*Secure proxy routing implementation protecting API limitations and exposed secrets from malicious actors over the client-side UI.*

- **Model Execution Environment**: `Node.js / Express Proxy Engine`
- **Generative AI Endpoint Architecture**: `gemini-2.5-flash`
- **Environment State**:
  ```env
  GEMINI_API_KEY=[REDACTED]
  PORT=3000
  ```
