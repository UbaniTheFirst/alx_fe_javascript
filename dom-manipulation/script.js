// 1. Quote data: an array of quote objects
const quotes = [
    { text: "Believe in yourself.", category: "Motivation" },
    { text: "Life is short. Live it.", category: "Life" },
    { text: "Success comes to those who hustle.", category: "Success" }
];

// 2. Get the elements we need to interact with
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// 3. Function: Display a random quote in the quoteDisplay div
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.textContent = `"${quote.text}" — [${quote.category}]`;
}

// 4. Function: Add a new quote from the form inputs
function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
        alert("Please enter both quote and category.");
        return;
    }

    quotes.push({ text, category });

    textInput.value = "";
    categoryInput.value = "";

    alert("Quote added successfully!");
}

// 5. Attach click event to the "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);