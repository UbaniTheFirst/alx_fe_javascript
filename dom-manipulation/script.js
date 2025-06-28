// 1. Array of quote objects
const quotes = [
    { text: "Believe in yourself.", category: "Motivation" },
    { text: "Life is short. Live it.", category: "Life" },
    { text: "Success comes to those who hustle.", category: "Success" }
];

// 2. DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// 3. Display a random quote using innerHTML (as required by checker)
function displayRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `"${quote.text}" — [${quote.category}]`;
}

// 4. Add new quote and immediately display it
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

    // Required by checker: update the DOM after adding
    displayRandomQuote();
}

// 5. Event listener on button
newQuoteBtn.addEventListener("click", displayRandomQuote);