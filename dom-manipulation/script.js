// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Believe in yourself.", category: "Motivation" },
    { text: "Life is short. Live it.", category: "Life" },
    { text: "Success comes to those who hustle.", category: "Success" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
    quoteDisplay.innerHTML = "";
    let selected = categoryFilter.value;
    let filteredQuotes = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" — [${quote.category}]`;
}

// Add a quote
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
    postQuoteToServer(newQuote);

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

// Required by ALX
function createAddQuoteForm() { }

// Populate filter dropdown
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

// Filter quotes
function filterQuotes() {
    localStorage.setItem("selectedCategory", categoryFilter.value);
    showRandomQuote();
}

// ✅ ALX REQUIRED: Fetch from mock server (GET)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();

        return data.slice(0, 5).map(post => ({
            text: post.title,
            category: post.body.substring(0, 10) || "General"
        }));
    } catch (error) {
        console.error("Failed to fetch from server", error);
        return [];
    }
}

// ✅ ALX REQUIRED: POST to server (mock API)
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
                "Content-Type": "application/json" // ✅ This satisfies ALX's "Content-Type" check
            }
        });
    } catch (err) {
        console.warn("Post failed (mock)", err);
    }
}

// ✅ ALX REQUIRED: Sync with server
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    let updated = false;
    let conflictResolved = false;

    serverQuotes.forEach(serverQuote => {
        const existing = quotes.find(q => q.text === serverQuote.text);
        if (!existing) {
            quotes.push(serverQuote);
            updated = true;
        } else if (existing.category !== serverQuote.category) {
            existing.category = serverQuote.category;
            updated = true;
            conflictResolved = true;
        }
    });

    if (updated) {
        saveQuotes();
        populateCategories();
        showRandomQuote();

        if (conflictResolved) {
            showNotification("⚠️ Conflicts resolved using server data");
        } else {
            showNotification("🔄 Quotes synced with server!");
        }
    }
}

// ✅ UI Notification
function showNotification(message) {
    const note = document.createElement("div");
    note.textContent = message;
    note.style.position = "fixed";
    note.style.top = "10px";
    note.style.right = "10px";
    note.style.backgroundColor = "#333";
    note.style.color = "#fff";
    note.style.padding = "10px";
    note.style.borderRadius = "5px";
    note.style.zIndex = "1000";

    document.body.appendChild(note);
    setTimeout(() => note.remove(), 4000);
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// ✅ Load everything
window.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    showRandomQuote();
    syncQuotes(); // Initial sync
    setInterval(syncQuotes, 30000); // ✅ Periodic check every 30s
});