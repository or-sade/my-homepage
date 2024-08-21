// RSS Feed Code (Keep this part from your original script)
const RSS2JSON_API_KEY = '7n1uklfxhkamh6ssioxneaowvsmgc251oj5sd1ol'; // Make sure this is your actual API key

const FEEDS = [
    {
        name: 'Globes',
        url: 'https://www.globes.co.il/webservice/rss/rssfeeder.asmx/FeederNode?iID=585',
        containerId: 'globes-feed-container'
    },
    {
        name: 'TheMarker',
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

// New User Links Functionality
const userLinksContainer = document.getElementById('user-links-container');
const addLinkForm = document.getElementById('add-link-form');

function addLinkToDOM(link) {
    console.log('Adding link to DOM:', link);
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
    console.log('Link added to DOM');
}

addLinkForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submitted');
    const url = document.getElementById('link-url').value;
    const name = document.getElementById('link-name').value || new URL(url).hostname;
    console.log('URL:', url, 'Name:', name);
    const link = { url, name };
    addLinkToDOM(link);
    addLinkForm.reset();
});

console.log('Script loaded');

// User Authentication and Links Management
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const userLinksSection = document.getElementById('user-links');
const userLinksContainer = document.getElementById('user-links-container');
const addLinkForm = document.getElementById('add-link-form');

let currentUser = null;

function showLoginForm() {
    loginForm.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    userLinksSection.style.display = 'none';
}

function showUserSection() {
    loginForm.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    userLinksSection.style.display = 'block';
}

function login(username, password) {
    // In a real app, you'd validate against a server here
    currentUser = username;
    localStorage.setItem('currentUser', username);
    showUserSection();
    loadUserLinks();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginForm();
    userLinksContainer.innerHTML = '';
}

function loadUserLinks() {
    const links = JSON.parse(localStorage.getItem(`${currentUser}_links`)) || [];
    userLinksContainer.innerHTML = '';
    links.forEach(link => addLinkToDOM(link));
}

function saveLinkToStorage(link) {
    const links = JSON.parse(localStorage.getItem(`${currentUser}_links`)) || [];
    links.push(link);
    localStorage.setItem(`${currentUser}_links`, JSON.stringify(links));
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

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
    loginForm.reset();
});

logoutBtn.addEventListener('click', logout);

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
        const links = JSON.parse(localStorage.getItem(`${currentUser}_links`)) || [];
        const updatedLinks = links.filter(link => link.url !== url);
        localStorage.setItem(`${currentUser}_links`, JSON.stringify(updatedLinks));
        e.target.parentElement.remove();
    }
});

// Check if user is already logged in
if (localStorage.getItem('currentUser')) {
    currentUser = localStorage.getItem('currentUser');
    showUserSection();
    loadUserLinks();
} else {
    showLoginForm();
}
// Load feeds when the script runs
loadAllFeeds();
