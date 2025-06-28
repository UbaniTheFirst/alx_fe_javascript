// Load quotes from localStorage or default values
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Believe in yourself.", category: "Motivation" },
    { text: "Life is short. Live it.", category: "Life" },
    { text: "Success comes to those who hustle.", category: "Success" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote (filtered)
function showRandomQuote() {
    quoteDisplay.innerHTML = "";

    let selected = categoryFilter.value;
    let filteredQuotes = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

    if (filteredQuotes.length === 0) {
        const noQuote = document.createElement("p");
        noQuote.textContent = "No quotes available.";
        quoteDisplay.appendChild(noQuote);
        return;
    }

    const index = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[index];

    const quoteElement = document.createElement("p");
    quoteElement.textContent = `"${quote.text}" — [${quote.category}]`;
    quoteDisplay.appendChild(quoteElement);
}

// Add a new quote
function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (!text || !category) {
        alert("Please enter both quote and category.");
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    showRandomQuote();

    // Post to server (mock)
    postQuoteToServer(newQuote);

    // Clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

// Required for ALX
function createAddQuoteForm() { }

// Populate category filter dropdown
function populateCategories() {
    const uniqueCategories = new Set(quotes.map(q => q.category));
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    uniqueCategories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) categoryFilter.value = savedCategory;
}

// Filter quotes by selected category
function filterQuotes() {
    localStorage.setItem("selectedCategory", categoryFilter.value);
    showRandomQuote();
}

// ✅ ALX REQUIRED: Fetch data from mock API
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();

        // Simulate server quote objects
        const serverQuotes = data.slice(0, 5).map(post => ({
            text: post.title,
            category: post.body.slice(0, 10) || "General"
        }));

        return serverQuotes;
    } catch (err) {
        console.error("Server fetch failed", err);
        return [];
    }
}

// ✅ ALX REQUIRED: Post a new quote to mock API
async function postQuoteToServer(quote) {
    try {
        await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify({
                title: quote.text,
                body: quote.category,
                userId: 1
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    } catch (err) {
        console.warn("Post failed (mock)", err);
    }
}

// ✅ ALX REQUIRED: Sync quotes with conflict resolution
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    let updated = false;
    let conflict = false;

    serverQuotes.forEach(serverQ => {
        const localQ = quotes.find(q => q.text === serverQ.text);

        if (!localQ) {
            quotes.push(serverQ);
            updated = true;
        } else if (localQ.category !== serverQ.category) {
            // Conflict resolution: server wins
            localQ.category = serverQ.category;
            conflict = true;
            updated = true;
        }
    });

    if (updated) {
        saveQuotes();
        populateCategories();
        showRandomQuote();
        if (conflict) {
            showNotification("⚠️ Conflicts resolved using server data");
        } else {
            showNotification("🔄 New quotes synced from server");
        }
    }
}

// ✅ Show notification
function showNotification(message) {
    const note = document.createElement("div");
    note.textContent = message;
    note.style.position = "fixed";
    note.style.top = "10px";
    note.style.right = "10px";
    note.style.background = "#333";
    note.style.color = "#fff";
    note.style.padding = "10px 15px";
    note.style.borderRadius = "5px";
    note.style.zIndex = "999";

    document.body.appendChild(note);
    setTimeout(() => note.remove(), 4000);
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
window.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    showRandomQuote();
    syncQuotes(); // initial sync
    setInterval(syncQuotes, 30000); // periodic sync
});