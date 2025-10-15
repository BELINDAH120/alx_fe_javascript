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

// script.js
// Dynamic Quote Generator — sync simulation with conflict handling

document.addEventListener('DOMContentLoaded', function () {

  // DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const quoteCategory = document.getElementById('quoteCategory') || null;
  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const exportBtn = document.getElementById('exportBtn');
  const importFile = document.getElementById('importFile');
  const clearStorageBtn = document.getElementById('clearStorage');
  const syncNowBtn = document.getElementById('syncNow');
  const syncStatus = document.getElementById('syncStatus');
  const categoryFilter = document.getElementById('categoryFilter');
  const showConflictsBtn = document.getElementById('showConflicts');
  const conflictPanel = document.getElementById('conflictPanel');
  const conflictList = document.getElementById('conflictList');
  const closeConflictsBtn = document.getElementById('closeConflicts');

  // Storage keys
  const LOCAL_KEY_QUOTES = 'dq_quotes_sync_v1';
  const LOCAL_KEY_FILTER = 'dq_filter';
  const SESSION_KEY_LAST_INDEX = 'dq_last_index';
  const LOCAL_KEY_LAST_SYNC = 'dq_last_sync_time';

  // In-memory structures
  let quotes = []; // array of { id, text, category, syncId? }
  let resolvedConflicts = []; // array of conflict objects { syncId, server, local, resolvedAt, chosen: 'server'|'local' }

  // Default starter quotes
  const defaultQuotes = [
    { id: genId(), text: "Believe you can and you're halfway there.", category: "Motivation" },
    { id: genId(), text: "The purpose of our lives is to be happy.", category: "Life" },
    { id: genId(), text: "The best way to predict the future is to create it.", category: "Inspiration" }
  ];

  // Helper: generate unique local id
  function genId() { return 'loc-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8); }

  // Mock server endpoint (we use jsonplaceholder posts to simulate server data)
  const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=6';

  // ---------- Storage helpers ----------
  function saveQuotes() {
    localStorage.setItem(LOCAL_KEY_QUOTES, JSON.stringify(quotes));
  }

  function loadQuotes() {
    const raw = localStorage.getItem(LOCAL_KEY_QUOTES);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) quotes = parsed;
        else quotes = defaultQuotes.slice();
      } catch (e) {
        console.error('Invalid stored quotes — resetting', e);
        quotes = defaultQuotes.slice();
      }
    } else {
      quotes = defaultQuotes.slice();
    }
  }

  function saveLastSyncTime(ts) {
    localStorage.setItem(LOCAL_KEY_LAST_SYNC, ts.toString());
    syncStatus.textContent = 'Last sync: ' + new Date(ts).toLocaleString();
  }

  function getLastSyncTime() {
    return localStorage.getItem(LOCAL_KEY_LAST_SYNC) || 'N/A';
  }

  // ---------- Category dropdown ----------
  function populateCategories() {
    const cats = Array.from(new Set(quotes.map(q => q.category))).sort();
    categoryFilter.innerHTML = `<option value="all">All</option>`;
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      categoryFilter.appendChild(opt);
    });
    // restore saved filter if present
    const saved = localStorage.getItem(LOCAL_KEY_FILTER) || 'all';
    categoryFilter.value = saved;
  }

  // ---------- Display ----------
  function displayQuote(qObj, idx = null) {
    quoteDisplay.innerHTML = `"${qObj.text}"`;
    if (quoteCategory) quoteCategory.innerHTML = `<em>— Category: ${qObj.category}</em>`;
    if (idx !== null) sessionStorage.setItem(SESSION_KEY_LAST_INDEX, String(idx));
  }

  function showRandomQuote() {
    const selected = categoryFilter.value || 'all';
    const pool = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
    if (!pool.length) {
      quoteDisplay.innerHTML = 'No quotes available for this category';
      if (quoteCategory) quoteCategory.innerHTML = '';
      return;
    }
    const idx = Math.floor(Math.random() * pool.length);
    const q = pool[idx];
    // find index in main quotes array
    const mainIdx = quotes.findIndex(x => x.id === q.id);
    displayQuote(q, mainIdx);
  }

  // ---------- Add local quote ----------
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
    if (!text || !category) return alert('Fill both fields');
    const newQ = { id: genId(), text, category };
    quotes.push(newQ);
    saveQuotes();
    populateCategories();
    newQuoteText.value = '';
    newQuoteCategory.value = '';
    displayQuote(newQ, quotes.length - 1);
  }

  // ---------- Export / Import ----------
  function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'quotes_local.json'; document.body.appendChild(a); a.click();
    URL.revokeObjectURL(url); a.remove();
  }

  function importQuotesFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) return alert('Invalid format: expected array');
        // simple validation and normalization: ensure id exists; if not assign one
        imported.forEach(obj => {
          if (!obj.id) obj.id = genId();
          if (!obj.text) obj.text = String(obj.text || '');
          if (!obj.category) obj.category = String(obj.category || 'Imported');
          // imported items keep their id (may cause conflicts if syncId used)
          quotes.push(obj);
        });
        saveQuotes();
        populateCategories();
        alert('Imported ' + imported.length + ' quotes.');
      } catch (err) {
        console.error(err);
        alert('Failed to import JSON');
      }
    };
    reader.readAsText(file);
  }

  // ---------- Sync logic ----------
  // We fetch "server" data and map it to quote objects with syncId = 'srv-<id>'
  async function fetchServerQuotes() {
    try {
      const res = await fetch(SERVER_URL);
      if (!res.ok) throw new Error('Network response was not ok');
      const posts = await res.json();
      // map posts to server quote objects
      const serverQuotes = posts.map(p => ({
        syncId: 'srv-' + p.id,
        id: null,               // local id only used for local-only items
        text: (p.title || '').slice(0, 150), // server 'title' becomes quote text
        category: 'Server-' + (p.userId || '0')
      }));
      return serverQuotes;
    } catch (err) {
      console.warn('Failed to fetch server quotes:', err);
      return null;
    }
  }

  // Merge server quotes into local quotes:
  // - For each serverQuote:
  //    * if a local quote has the same syncId, and text differs -> conflict (server wins)
  //    * if no local quote with syncId -> add serverQuote (set its id to a new local id but keep syncId)
  // - Local quotes without syncId are left untouched
  async function syncWithServer({ manual = false } = {}) {
    const serverQuotes = await fetchServerQuotes();
    if (!serverQuotes) {
      syncStatus.textContent = 'Last sync: failed (offline or server error)';
      return;
    }

    let updates = 0;
    let additions = 0;
    let conflictsResolved = 0;

    // Build a map of local by syncId (only those that have syncId)
    const localBySync = new Map();
    quotes.forEach(q => {
      if (q.syncId) localBySync.set(q.syncId, q);
    });

    // For ease, also build local id map
    const localById = new Map(quotes.map(q => [q.id, q]));

    // Process each serverQuote
    serverQuotes.forEach(sq => {
      const localMatch = localBySync.get(sq.syncId);
      if (localMatch) {
        // have a local entry that is associated with this server item
        if (localMatch.text !== sq.text || localMatch.category !== sq.category) {
          // conflict: server takes precedence — record and apply
          const conflictRecord = {
            syncId: sq.syncId,
            server: { text: sq.text, category: sq.category },
            local: { id: localMatch.id, text: localMatch.text, category: localMatch.category },
            resolvedAt: Date.now(),
            chosen: 'server'
          };
          resolvedConflicts.push(conflictRecord);

          // update local entry to server values
          localMatch.text = sq.text;
          localMatch.category = sq.category;
          updates++;
          conflictsResolved++;
        } else {
          // identical — nothing to do
        }
      } else {
        // no local entry with this syncId — add server item to local
        const newLocal = {
          id: genId(),
          syncId: sq.syncId,
          text: sq.text,
          category: sq.category
        };
        quotes.push(newLocal);
        additions++;
      }
    });

    // Optionally, server-first policy could remove local items that server removed.
    // For this demo, we will NOT delete local-only items to avoid data loss.

    if (updates || additions || conflictsResolved) {
      saveQuotes();
      populateCategories();
    }

    // Save last sync time and update status
    const now = Date.now();
    saveLastSyncTime(now);

    syncStatus.textContent = `Last sync: ${new Date(now).toLocaleString()} — +${additions} added, ${updates} updated, ${conflictsResolved} conflicts resolved`;
    if (manual && (additions || updates || conflictsResolved)) {
      alert(`Sync finished: ${additions} added, ${updates} updated, ${conflictsResolved} conflicts resolved.`);
    }
  }

  // Periodic background sync every N seconds (simulate server updates arriving)
  const SYNC_INTERVAL_MS = 30 * 1000; // 30s for demo; in real life, longer
  let syncTimer = null;
  function startPeriodicSync() {
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(() => syncWithServer({ manual: false }), SYNC_INTERVAL_MS);
  }

  // ---------- Conflicts UI ----------
  // Show resolved conflicts and allow reverting an item back to the local version
  function renderConflictsPanel() {
    if (!resolvedConflicts.length) {
      conflictPanel.style.display = 'none';
      return;
    }
    conflictList.innerHTML = '';
    resolvedConflicts.slice().reverse().forEach((c, idx) => {
      const div = document.createElement('div');
      div.className = 'conflict-item';
      div.innerHTML = `<strong>SyncId:</strong> ${c.syncId}<br>
        <strong>Server:</strong> "${escapeHtml(c.server.text)}" <em>(${escapeHtml(c.server.category)})</em><br>
        <strong>Local (before):</strong> "${escapeHtml(c.local.text)}" <em>(${escapeHtml(c.local.category)})</em>
      `;
      const btns = document.createElement('div');
      btns.className = 'conflict-buttons';
      const restoreBtn = document.createElement('button');
      restoreBtn.textContent = 'Restore Local';
      restoreBtn.className = 'small secondary';
      restoreBtn.addEventListener('click', () => {
        // find the local entry by id and restore
        const localEntry = quotes.find(q => q.id === c.local.id);
        if (localEntry) {
          localEntry.text = c.local.text;
          localEntry.category = c.local.category;
          // mark conflict chosen as local now
          c.chosen = 'local';
          c.resolvedAt = Date.now();
          saveQuotes();
          populateCategories();
          alert('Local version restored for that item.');
          renderConflictsPanel();
        } else {
          alert('Local entry not found (it may have been removed).');
        }
      });
      btns.appendChild(restoreBtn);
      div.appendChild(btns);
      conflictList.appendChild(div);
    });
    conflictPanel.style.display = 'block';
  }

  // escape HTML helper to avoid injection when showing previous values
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  // ---------- Initialization ----------
  loadQuotes();
  populateCategories();

  // restore last filter
  const savedFilter = localStorage.getItem(LOCAL_KEY_FILTER);
  if (savedFilter) categoryFilter.value = savedFilter;

  // show last index from session if any
  const lastIdx = sessionStorage.getItem(SESSION_KEY_LAST_INDEX);
  if (lastIdx !== null && quotes[lastIdx]) {
    displayQuote(quotes[lastIdx], lastIdx);
  } else {
    showRandomQuote();
  }

  // load last sync time to display
  const lastSync = localStorage.getItem(LOCAL_KEY_LAST_SYNC);
  if (lastSync) syncStatus.textContent = 'Last sync: ' + new Date(Number(lastSync)).toLocaleString();
  else syncStatus.textContent = 'Last sync: N/A';

  // ---------- Event bindings ----------
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', addQuote);
  exportBtn.addEventListener('click', exportQuotes);
  importFile.addEventListener('change', e => importQuotesFile(e.target.files[0]));
  clearStorageBtn.addEventListener('click', () => {
    if (!confirm('Reset local quotes (this removes saved custom quotes)?')) return;
    localStorage.removeItem(LOCAL_KEY_QUOTES);
    localStorage.removeItem(LOCAL_KEY_FILTER);
    localStorage.removeItem(LOCAL_KEY_LAST_SYNC);
    resolvedConflicts = [];
    loadQuotes();
    populateCategories();
    showRandomQuote();
    alert('Local data reset');
  });
  syncNowBtn.addEventListener('click', () => syncWithServer({ manual: true }));
  categoryFilter.addEventListener('change', () => {
    localStorage.setItem(LOCAL_KEY_FILTER, categoryFilter.value);
    showRandomQuote();
  });
  showConflictsBtn.addEventListener('click', () => {
    renderConflictsPanel();
  });
  closeConflictsBtn && closeConflictsBtn.addEventListener('click', () => {
    conflictPanel.style.display = 'none';
  });

  // Start periodic sync
  startPeriodicSync();

  // Do an initial sync right away (non-manual)
  syncWithServer({ manual: false });

  // Save quotes before unload
  window.addEventListener('beforeunload', saveQuotes);

});
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
