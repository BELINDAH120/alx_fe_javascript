// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {

  // Array to store quote objects
  let quotes = [
    { text: "Believe you can and you're halfway there.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Life" },
    { text: "The best way to predict the future is to create it.", category: "Inspiration" }
  ];

  // Select DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const quoteCategory = document.getElementById('quoteCategory');
  const newQuoteBtn = document.getElementById('newQuote');

  // Function to display a random quote
  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available. Add one!";
      quoteCategory.innerHTML = "";
      return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = `"${randomQuote.text}"`;
    quoteCategory.innerHTML = `<em>— Category: ${randomQuote.category}</em>`;
  }

  // Function to create and add the quote form dynamically
  function createAddQuoteForm() {
    // Create form container
    const formContainer = document.createElement('div');
    formContainer.className = 'add-quote-form';

    // Create input for quote text
    const quoteInput = document.createElement('input');
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
    quoteInput.id = 'newQuoteText';

    // Create input for quote category
    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    categoryInput.id = 'newQuoteCategory';

    // Create Add Quote button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.id = 'addQuoteBtn';

    // Append inputs and button to form container
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);

    // Append form to the body (or any container)
    document.body.appendChild(formContainer);

    // Add event listener for the Add Quote button
    addButton.addEventListener('click', function() {
      const text = quoteInput.value.trim();
      const category = categoryInput.value.trim();

      if (text === "" || category === "") {
        alert("Please fill in both fields before adding a quote!");
        return;
      }

      const newQuote = { text, category };
      quotes.push(newQuote);

      quoteDisplay.innerHTML = `✅ New quote added: "${newQuote.text}"`;
      quoteCategory.innerHTML = `<em>Category: ${newQuote.category}</em>`;

      // Clear input fields
      quoteInput.value = "";
      categoryInput.value = "";
    });
  }

  // Attach event listener for showing new random
