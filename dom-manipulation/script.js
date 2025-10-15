// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {

  // Initial array of quote objects
  let quotes = [
    { text: "Believe you can and you're halfway there.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Life" },
    { text: "The best way to predict the future is to create it.", category: "Inspiration" }
  ];

  // Select DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const quoteCategory = document.getElementById('quoteCategory');
  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');

  // Function to display a random quote
  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available. Add one!";
      quoteCategory.innerHTML = "";
      return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Use innerHTML to display formatted text
    quoteDisplay.innerHTML = `"${randomQuote.text}"`;
    quoteCategory.innerHTML = `<em>— Category: ${randomQuote.category}</em>`;
  }

  // Function to add a new quote
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    // Validate input
    if (text === "" || category === "") {
      alert("Please fill in both the quote and its category!");
      return;
    }

    // Add new quote object to array
    const newQuote = { text, category };
    quotes.push(newQuote);

    // Clear input fields
    newQuoteText.value = "";
    newQuoteCategory.value = "";

    // Display confirmation message
    quoteDisplay.innerHTML = `✅ New quote added: "${newQuote.text}"`;
    quoteCategory.innerHTML = `<em>Category: ${newQuote.category}</em>`;
  }

  // Attach event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', addQuote);

  // Show one random quote when page loads
  showRandomQuote();

});
