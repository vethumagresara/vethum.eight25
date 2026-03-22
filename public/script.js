document.getElementById('auditForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = document.getElementById('urlInput').value;
    const btn = document.getElementById('submitBtn');
    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.spinner');
    const errorBox = document.getElementById('errorBox');
    const resultsSection = document.getElementById('resultsSection');
    const aiContent = document.getElementById('aiInsightsContent');
    
    // Reset state
    errorBox.classList.add('hidden');
    resultsSection.classList.add('hidden');
    btn.disabled = true;
    btnText.classList.add('hidden');
    spinner.classList.remove('hidden');

    try {
        const response = await fetch('/api/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch the URL.');
        }

        // Populate metrics safely
        const metrics = data.factual_metrics;
        document.getElementById('wordCount').textContent = metrics.wordCount;
        
        document.getElementById('linkCount').textContent = metrics.links.total;
        document.getElementById('internalLinks').textContent = metrics.links.internalLinks;
        document.getElementById('externalLinks').textContent = metrics.links.externalLinks;
        
        document.getElementById('imageCount').textContent = metrics.images.totalImages;
        document.getElementById('imagesMissingAlt').textContent = metrics.images.imagesMissingAltText;
        document.getElementById('imagesMissingAltPct').textContent = metrics.images.missingAltPercentage || 0;
        
        document.getElementById('h1Count').textContent = metrics.tags.h1 || 0;
        document.getElementById('h2Count').textContent = metrics.tags.h2 || 0;
        document.getElementById('h3Count').textContent = metrics.tags.h3 || 0;
        
        document.getElementById('ctaCount').textContent = metrics.ctaCount || 0;

        document.getElementById('metaTitle').textContent = metrics.meta.title || "None Found";
        document.getElementById('metaDesc').textContent = metrics.meta.description || "None Found";

        // Process AI Insights
        let insights = data.ai_insights || "No insights could be generated.";
        
        // Very basic markdown formatting for AI response display
        // Replace bold **text**
        insights = insights.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace list items
        insights = insights.replace(/\n- /g, '<br>• ');
        insights = insights.replace(/\n\* /g, '<br>• ');
        // Replace line breaks
        insights = insights.replace(/\n/g, '<br>');
        
        aiContent.innerHTML = insights;

        // Show results
        resultsSection.classList.remove('hidden');
        
    } catch (error) {
        errorBox.textContent = "Error: " + error.message;
        errorBox.classList.remove('hidden');
    } finally {
        // Reset button
        btn.disabled = false;
        btnText.classList.remove('hidden');
        spinner.classList.add('hidden');
    }
});
