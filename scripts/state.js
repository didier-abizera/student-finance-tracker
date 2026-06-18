// state.js
// keeps track of all records and settings while app is running

var appState = {
  records: [],
  settings: {
    budgetCap: 0,
    usdRate: 1300,
    eurRate: 1400
  },
  editingId: null
};

// load records from localStorage into state
function initState() {
  appState.records = loadRecords();
  appState.settings = loadSettings();
}

// generate a unique id for each new record
function generateId() {
  var count = appState.records.length + 1;
  var padded = String(count).padStart(4, '0');
  return 'txn_' + padded;
}

// add a new record to state and save
function addRecord(record) {
  record.id = generateId();
  record.createdAt = new Date().toISOString();
  record.updatedAt = new Date().toISOString();
  appState.records.push(record);
  saveRecords(appState.records);
}

// update an existing record in state and save
function updateRecord(id, updatedData) {
  appState.records = appState.records.map(function(record) {
    if (record.id === id) {
      return {
        id: record.id,
        description: updatedData.description,
        amount: updatedData.amount,
        category: updatedData.category,
        date: updatedData.date,
        createdAt: record.createdAt,
        updatedAt: new Date().toISOString()
      };
    }
    return record;
  });
  saveRecords(appState.records);
}

// delete a record from state and save
function deleteRecord(id) {
  appState.records = appState.records.filter(function(record) {
    return record.id !== id;
  });
  saveRecords(appState.records);
}

// sort records by date, description or amount
function sortRecords(records, sortBy) {
  var sorted = records.slice();
  if (sortBy === 'date') {
    sorted.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  } else if (sortBy === 'description') {
    sorted.sort(function(a, b) {
      return a.description.localeCompare(b.description);
    });
  } else if (sortBy === 'amount') {
    sorted.sort(function(a, b) {
      return b.amount - a.amount;
    });
  }
  return sorted;
}

// update settings in state and save
function updateSettings(settings) {
  appState.settings = settings;
  saveSettings(settings);
}