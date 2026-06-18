// storage.js
// saves and loads data from localStorage

var STORAGE_KEY = 'student-finance-tracker';

// save all records to localStorage
function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// load all records from localStorage
function loadRecords() {
  var data = localStorage.getItem(STORAGE_KEY);
  if (data === null) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.log('Error loading records: ' + e);
    return [];
  }
}

// save settings to localStorage
function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY + '-settings', JSON.stringify(settings));
}

// load settings from localStorage
function loadSettings() {
  var data = localStorage.getItem(STORAGE_KEY + '-settings');
  if (data === null) {
    return {
      budgetCap: 0,
      usdRate: 1300,
      eurRate: 1400
    };
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.log('Error loading settings: ' + e);
    return {
      budgetCap: 0,
      usdRate: 1300,
      eurRate: 1400
    };
  }
}

// clear all records from localStorage
function clearRecords() {
  localStorage.removeItem(STORAGE_KEY);
}