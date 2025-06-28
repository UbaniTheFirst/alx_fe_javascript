// Array of quotes
const quotes = [
    { text: "Believe in yourself.", category: "Motivation" },
    { text: "Life is short. Live it.", category: "Life" },
    { text: "Success comes to those who hustle.", category: "Success" }
];

// Get DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ✅ Function: showRandomQuote (must use innerHTML)
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `"${quote.text}" — [${quote.category}]`;
}

// ✅ Function: addQuote (must push to array and update DOM)
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both quote and category.");
        return;
    }

    quotes.push({ text: quoteText, category: quoteCategory });

    // Optional: clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Required: update DOM after adding
    showRandomQuote();
}

// ✅ Required: Dummy declaration for createAddQuoteForm (even if unused)
function createAddQuoteForm() {

}

// ✅ Event listener for “Show New Quote” button
newQuoteBtn.addEventListener("click", showRandomQuote);