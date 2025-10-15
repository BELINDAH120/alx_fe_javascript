// Dynamic Quote Generator with Category Filter and Web Storage

document.addEventListener('DOMContentLoaded', function() {

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
  const categoryFilter = document.getElementById('categoryFilter');

  const LOCAL_KEY_QUOTES = 'dq_quotes_v2';
  const LOCAL_KEY_FILTER = 'dq_filter';
  const SESSION_KEY_LAST_INDEX = 'dq_last_index';

  let quotes = [
    { text: "Believe you can and you're halfway there.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Life" },
    { text: "The best way to predict the future is to create it.", category: "Inspiration" }
  ];

  // === Storage helpers ===
  function saveQuotes() {
    localStorage.setItem(LOCAL_KEY_QUOTES, JSON.stringify(quotes));
  }

  function loadQuotes() {
    const stored = localStorage.getItem(LOCAL_KEY_QUOTES);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) quotes = parsed;
      } catch { console.error("Error parsing quotes"); }
    }
  }

  function saveLastIndex(idx) {
    sessionStorage.setItem(SESSION_KEY_LAST_INDEX, String(idx));
  }

  function getLastIndex() {
    const val = sessionStorage.getItem(SESSION_KEY_LAST_INDEX);
    return val ? parseInt(val, 10) : null;
  }

  // === Category Handling ===
  function getUniqueCategories() {
    return [...new Set(quotes.map(q => q.category))];
  }

  function populateCategories() {
    const savedFilter = localStorage.getItem(LOCAL_KEY_FILTER) || "all";
    const categories = getUniqueCategories();
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
    categoryFilter.value = savedFilter;
  }

  // === Display ===
  function displayQuote(q, idx) {
    quoteDisplay.innerHTML = `"${q.text}"`;
    quoteCategory.innerHTML = `<em>— Category: ${q.category}</em>`;
    if (idx !== null) saveLastIndex(idx);
  }

  function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    const filtered = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

    if (filtered.length === 0) {
      quoteDisplay.innerHTML = "No quotes in this category.";
      quoteCategory.innerHTML = "";
      return;
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const qObj = filtered[randomIndex];
    displayQuote(qObj, quotes.indexOf(qObj));
  }

  // === Filtering ===
  window.filterQuotes = function() {
    const selected = categoryFilter.value;
    localStorage.setItem(LOCAL_KEY_FILTER, selected);
    showRandomQuote();
  };

  // === Adding a quote ===
  function addQuote() {
    const text = newQuoteText.value.trim();
    const cat = newQuoteCategory.value.trim();
    if (!text || !cat) {
      alert("Please fill both fields!");
      return;
    }
    const newQ = { text, category: cat };
    quotes.push(newQ);
    saveQuotes();
    populateCategories(); // update dropdown if new category added
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    quoteDisplay.innerHTML = `✅ Added: "${newQ.text}"`;
    quoteCategory.innerHTML = `<em>Category: ${newQ.category}</em>`;
  }

  // === Export / Import ===
  function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importFromJson(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) return alert("Invalid JSON format");
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } catch {
        alert("Error reading JSON file");
      }
    };
    reader.readAsText(file);
  }

  function clearStorage() {
    if (confirm("Clear stored quotes?")) {
      localStorage.removeItem(LOCAL_KEY_QUOTES);
      localStorage.removeItem(LOCAL_KEY_FILTER);
      quotes = [
        { text: "Believe you can and you're halfway there.", category: "Motivation" },
        { text: "The purpose of our lives is to be happy.", category: "Life" },
        { text: "The best way to predict the future is to create it.", category: "Inspiration" }
      ];
      saveQuotes();
      populateCategories();
      showRandomQuote();
    }
  }

  // === Initialize ===
  loadQuotes();
  populateCategories();

  const savedFilter = localStorage.getItem(LOCAL_KEY_FILTER) || "all";
  categoryFilter.value = savedFilter;

  const lastIdx = getLastIndex();
  if (lastIdx !== null && quotes[lastIdx]) displayQuote(quotes[lastIdx], lastIdx);
  else showRandomQuote();

  // === Event Listeners ===
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', addQuote);
  exportBtn.addEventListener('click', exportQuotes);
  importFile.addEventListener('change', e => importFromJson(e.target.files[0]));
  clearStorageBtn.addEventListener('click', clearStorage);
  showAllBtn.addEventListener('click', () => {
    console.table(quotes);
    alert("Quotes logged to console!");
  });

});

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
