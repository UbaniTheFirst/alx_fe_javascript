// Array of quotes
const quotes = [
    { text: "Believe in yourself.", category: "Motivation" },
    { text: "Life is short. Live it.", category: "Life" },
    { text: "Success comes to those who hustle.", category: "Success" }
];

// Get elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ✅ Required: showRandomQuote using innerHTML
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `"${quote.text}" — [${quote.category}]`;
}

// ✅ Required: addQuote function
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both quote and category.");
        return;
    }

    // Add new quote to array
    quotes.push({ text: quoteText, category: quoteCategory });

    // Clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // ✅ Immediately update the DOM
    showRandomQuote();
}

// ✅ Required: event listener on “Show New Quote” button
newQuoteBtn.addEventListener("click", showRandomQuote);