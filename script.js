// Globes RSS feed URL
const RSS_URL = 'https://www.globes.co.il/webservice/rss/rssfeeder.asmx/FeederNode?iID=585';
const RSS2JSON_API_KEY = 'YOUR_API_KEY'; // Make sure this is your actual API key

async function fetchRSS() {
    try {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&api_key=${RSS2JSON_API_KEY}`;
        console.log('Fetching from URL:', apiUrl); // Log the URL we're fetching from

        const response = await axios.get(apiUrl);
        console.log('Response:', response.data); // Log the response data

        const feed = response.data;
        
        if (feed.status !== 'ok') {
            throw new Error(`Failed to fetch RSS feed. Status: ${feed.status}`);
        }

        let feedHtml = "";
        feed.items.forEach(item => {
            const pubDate = new Date(item.pubDate);
            feedHtml += `
                <div class="feed-item">
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p>Published: ${pubDate.toLocaleString('he-IL')}</p>
                </div>
            `;
        });
        
        document.getElementById("rss-feed-container").innerHTML = feedHtml;
    } catch (error) {
        console.error("Error fetching RSS feed:", error);
        document.getElementById("rss-feed-container").innerHTML = `<p>Error loading feed. Please try again later. Error details: ${error.message}</p>`;
    }
}

fetchRSS();
