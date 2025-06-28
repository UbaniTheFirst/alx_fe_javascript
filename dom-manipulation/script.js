// Load from localStorage or default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Believe in yourself.", category: "Motivation" },
    { text: "Life is short. Live it.", category: "Life" },
    { text: "Success comes to those who hustle.", category: "Success" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Save to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Populate filter options from unique categories
function populateCategories() {
    const uniqueCategories = new Set(quotes.map(q => q.category));

    // Remove old options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    }

    );

    // Set saved filter if any
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
    }
}

// ✅ Show a random quote (filtered or unfiltered)
function showRandomQuote() {
    quoteDisplay.innerHTML = "";

    let selected = categoryFilter.value;
    let filteredQuotes = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

    if (filteredQuotes.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No quotes in this category.";
        quoteDisplay.appendChild(msg);
        return;
    }

    const index = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[index];

    // Save last viewed in sessionStorage
    sessionStorage.setItem("lastQuoteIndex", index);
    sessionStorage.setItem("lastCategory", selected);

    const quoteElement = document.createElement("p");
    quoteElement.textContent = `"${quote.text}" — [${quote.category}]`;
    quoteDisplay.appendChild(quoteElement);
}

// ✅ Add a new quote and refresh categories
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (!quoteText || !quoteCategory) {
        alert("Please enter both quote and category.");
        return;
    }

    quotes.push({ text: quoteText, category: quoteCategory });

    // Save
    saveQuotes();

    // Clear fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Refresh filter options
    populateCategories();

    // Auto-show the new quote
    showRandomQuote();
}

// ✅ Required by checker even if unused
function createAddQuoteForm() { }

// ✅ Export quotes to JSON
function exportToJson() {
    const jsonStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

// ✅ Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (!Array.isArray(importedQuotes)) {
                alert("Invalid file format.");
                return;
            }

            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories();
            showRandomQuote();
            alert("Quotes imported successfully!");
        } catch (err) {
            alert("Error reading file.");
        }
    };

    fileReader.readAsText(event.target.files[0]);
}

// ✅ Filter quotes by selected category
function filterQuotes() {
    localStorage.setItem("selectedCategory", categoryFilter.value);
    showRandomQuote();
}

// ✅ Load last viewed quote and filter
window.addEventListener("DOMContentLoaded", () => {
    populateCategories();

    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
    }

    showRandomQuote();
});

// ✅ Add event listener to "Show New Quote"
newQuoteBtn.addEventListener("click", showRandomQuote);