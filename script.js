const RSS2JSON_API_KEY = '7n1uklfxhkamh6ssioxneaowvsmgc251oj5sd1ol'; // Make sure this is your actual API key

const FEEDS = [
    {
        name: 'MyGlobes',
        url: 'https://www.globes.co.il/webservice/rss/rssfeeder.asmx/FeederNode?iID=585',
        containerId: 'globes-feed-container'
    },
    {
        name: 'MyTheMarker',
        url: 'https://www.themarker.com/cmlink/1.145',
        containerId: 'themarker-feed-container'
    }
];

async function fetchRSS(feed) {
    try {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=${RSS2JSON_API_KEY}`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        
        if (data.status !== 'ok') {
            throw new Error(`Failed to fetch RSS feed for ${feed.name}. Status: ${data.status}`);
        }

        let feedHtml = "";
        data.items.slice(0, 5).forEach(item => {  // Limiting to 5 items per feed
            const pubDate = new Date(item.pubDate);
            feedHtml += `
                <div class="feed-item">
                    <h4><a href="${item.link}" target="_blank">${item.title}</a></h4>
                    <p>Published: ${pubDate.toLocaleString('he-IL')}</p>
                </div>
            `;
        });
        
        document.getElementById(feed.containerId).innerHTML += feedHtml;
    } catch (error) {
        console.error(`Error fetching RSS feed for ${feed.name}:`, error);
        document.getElementById(feed.containerId).innerHTML += `<p>Error loading ${feed.name} feed. Please try again later.</p>`;
    }
}

function loadAllFeeds() {
    FEEDS.forEach(feed => fetchRSS(feed));
}
// User Links Functionality
const userLinksContainer = document.getElementById('user-links-container');
const addLinkForm = document.getElementById('add-link-form');

function loadUserLinks() {
    const links = JSON.parse(localStorage.getItem('userLinks')) || [];
    userLinksContainer.innerHTML = '';
    links.forEach(link => addLinkToDOM(link));
}

function saveLinkToStorage(link) {
    const links = JSON.parse(localStorage.getItem('userLinks')) || [];
    links.push(link);
    localStorage.setItem('userLinks', JSON.stringify(links));
}

function removeLinkFromStorage(url) {
    let links = JSON.parse(localStorage.getItem('userLinks')) || [];
    links = links.filter(link => link.url !== url);
    localStorage.setItem('userLinks', JSON.stringify(links));
}

function addLinkToDOM(link) {
    const linkElement = document.createElement('a');
    linkElement.href = link.url;
    linkElement.className = 'user-link';
    linkElement.target = '_blank';
    linkElement.innerHTML = `
        <img src="https://www.google.com/s2/favicons?domain=${link.url}" alt="${link.name} favicon">
        ${link.name}
        <span class="remove-link" data-url="${link.url}">&times;</span>
    `;
    userLinksContainer.appendChild(linkElement);
}

addLinkForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const url = document.getElementById('link-url').value;
    const name = document.getElementById('link-name').value || new URL(url).hostname;
    const link = { url, name };
    saveLinkToStorage(link);
    addLinkToDOM(link);
    addLinkForm.reset();
});

userLinksContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-link')) {
        const url = e.target.getAttribute('data-url');
        removeLinkFromStorage(url);
        e.target.parentElement.remove();
    }
});loadAllFeeds();
