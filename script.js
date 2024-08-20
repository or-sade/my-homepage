// Cors proxy to bypass CORS issues
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

// Globes RSS feed URL
const RSS_URL = `${CORS_PROXY}https://www.globes.co.il/webservice/rss/rssfeeder.asmx/FeederNode?iID=585`;

async function fetchRSS() {
    try {
        const response = await axios.get(RSS_URL);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const items = xmlDoc.querySelectorAll("item");
        
        let feedHtml = "";
        items.forEach(item => {
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            
            feedHtml += `
                <div class="feed-item">
                    <h3><a href="${link}" target="_blank">${title}</a></h3>
                    <p>Published: ${pubDate.toLocaleString('he-IL')}</p>
                </div>
            `;
        });
        
        document.getElementById("rss-feed-container").innerHTML = feedHtml;
    } catch (error) {
        console.error("Error fetching RSS feed:", error);
        document.getElementById("rss-feed-container").innerHTML = "<p>Error loading feed. Please try again later.</p>";
    }
}

fetchRSS();
