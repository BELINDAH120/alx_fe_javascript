// script.js
// Dynamic Quote Generator with localStorage, sessionStorage, import/export

document.addEventListener('DOMContentLoaded', function() {

  // DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const quoteCategory = document.getElementById('quoteCategory');
  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const exportBtn = document.getElementById('exportBtn');
  const importFile = document.getElementById('importFile');
  const clearStorageBtn = document.getElementById('clearStorage');
  const showAllBtn = document.getElementById('showAll');

  // Storage keys
  const LOCAL_KEY = 'dq_quotes_v1';
  const SESSION_KEY_LAST_INDEX = 'dq_last_index';

  // Default quotes (used if no localStorage)
  let quotes = [
    { text: "Believe you can and you're halfway there.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Life" },
    { text: "The best way to predict the future is to create it.", category: "Inspiration" }
  ];

  // Save quotes array to localStorage
  function saveQuotes() {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(quotes));
    } catch (e) {
      console.error('Failed to save quotes to localStorage:', e);
    }
  }

  // Load quotes from localStorage (if present). If not present, keep defaults.
  function loadQuotes() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          quotes = parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load quotes from localStorage:', e);
    }
  }

  // Save last shown index into sessionStorage
  function saveLastIndex(idx) {
    try {
      sessionStorage.setItem(SESSION_KEY_LAST_INDEX, String(idx));
    } catch (e) {
      console.error('Failed to save last index in sessionStorage:', e);
    }
  }

  // Try to read last index from sessionStorage (returns number or null)
  function getLastIndexFromSession() {
    const val = sessionStorage.getItem(SESSION_KEY_LAST_INDEX);
    if (val === null) return null;
    const n = parseInt(val, 10);
    return Number.isFinite(n) ? n : null;
  }

  // Display a quote object in DOM using innerHTML as requested
  function displayQuoteObject(qObj, idx = null) {
    quoteDisplay.innerHTML = `"${qObj.text}"`;
    quoteCategory.innerHTML = `<em>— Category: ${qObj.category}</em>`;
    if (idx !== null) saveLastIndex(idx);
  }

  // Show a random quote and save last shown index to session storage
  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available. Add one!";
      quoteCategory.innerHTML = "";
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    displayQuoteObject(quotes[randomIndex], randomIndex);
  }

  // Add a new quote (and save to localStorage)
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
      alert("Please fill in both the quote and its category!");
      return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();

    // Show confirmation and the newly added quote
    quoteDisplay.innerHTML = `✅ New quote added: "${newQuote.text}"`;
    quoteCategory.innerHTML = `<em>Category: ${newQuote.category}</em>`;

    // Clear inputs
    newQuoteText.value = "";
    newQuoteCategory.value = "";
  }

  // Export quotes to JSON file
  function exportToJson() {
    const payload = JSON.stringify(quotes, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }

  // Import quotes from JSON file input
  function importFromJsonFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          alert('Imported JSON must be an array of quote objects.');
          return;
        }
        // Validate objects structure: each must have text and category
        const valid = imported.every(obj => obj && typeof obj.text === 'string' && typeof obj.category === 'string');
        if (!valid) {
          alert('Each imported item must be an object with "text" and "category" string properties.');
          return;
        }
        // Merge imported quotes
        quotes.push(...imported);
        saveQuotes();
        alert('Quotes imported successfully!');
        // Show last imported quote
        displayQuoteObject(imported[imported.length - 1], quotes.length - 1);
      } catch (err) {
        console.error('Import parse error', err);
        alert('Failed to parse JSON file. See console for details.');
      }
    };
    reader.readAsText(file);
  }

  // Remove stored quotes (clear localStorage and reset to defaults)
  function clearStoredQuotes() {
    if (!confirm('Clear all stored quotes and reset to defaults?')) return;
    localStorage.removeItem(LOCAL_KEY);
    // reset to default list
    quotes = [
      { text: "Believe you can and you're halfway there.", category: "Motivation" },
      { text: "The purpose of our lives is to be happy.", category: "Life" },
      { text: "The best way to predict the future is to create it.", category: "Inspiration" }
    ];
    saveQuotes();
    showRandomQuote();
    alert('Stored quotes cleared and defaults restored.');
  }

  // Show all quotes in console (helpful for debugging)
  function showAllQuotesInConsole() {
    console.table(quotes);
    alert('Open console to view all quotes (or check saved quotes in localStorage).');
  }

  // Initialization: load quotes from localStorage and show a quote
  loadQuotes();

  // If there is a last index in sessionStorage, show that quote, otherwise just show a random one
  const lastIndex = getLastIndexFromSession();
  if (lastIndex !== null && quotes[lastIndex]) {
    displayQuoteObject(quotes[lastIndex], lastIndex);
  } else {
    showRandomQuote();
  }

  // Attach event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', addQuote);
  exportBtn.addEventListener('click', exportToJson);
  importFile.addEventListener('change', function(e) {
    const file = e.target.files[0];
    importFromJsonFile(file);
    // reset file input so same file can be re-imported if user wants
    importFile.value = '';
  });
  clearStorageBtn.addEventListener('click', clearStoredQuotes);
  showAllBtn.addEventListener('click', showAllQuotesInConsole);

  // Also save quotes before unload just in case (redundant but safe)
  window.addEventListener('beforeunload', saveQuotes);

});
