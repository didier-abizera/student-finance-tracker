// ui.js
// controls everything the user sees on the screen

// renders all records in the table
function renderTable(records, regex) {
  var tbody = document.getElementById('records-body');
  var status = document.getElementById('records-status');

  if (records.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No records found</td></tr>';
    status.textContent = 'No records found';
    return;
  }

  tbody.innerHTML = '';

  records.forEach(function(record) {
    var tr = document.createElement('tr');

    var descHighlighted = highlightMatch(record.description, regex);
    var catHighlighted = highlightMatch(record.category, regex);

    tr.innerHTML = 
      '<td>' + record.id + '</td>' +
      '<td>' + descHighlighted + '</td>' +
      '<td>' + parseFloat(record.amount).toLocaleString() + ' RWF</td>' +
      '<td>' + catHighlighted + '</td>' +
      '<td>' + record.date + '</td>' +
      '<td>' +
        '<button onclick="handleEdit(\'' + record.id + '\')" aria-label="Edit record">Edit</button> ' +
        '<button onclick="handleDelete(\'' + record.id + '\')" aria-label="Delete record" style="background:#ef4444;color:white;margin-left:4px;">Delete</button>' +
      '</td>';

    tbody.appendChild(tr);
  });

  status.textContent = records.length + ' record(s) found';
}

// updates the dashboard stats
function renderStats() {
  var records = appState.records;
  var settings = appState.settings;

  // total records
  document.getElementById('total-records').textContent = records.length;

  // total spent
  var total = 0;
  records.forEach(function(record) {
    total += parseFloat(record.amount);
  });
  document.getElementById('total-spent').textContent = total.toLocaleString() + ' RWF';

  // top category
  var categoryCounts = {};
  records.forEach(function(record) {
    if (categoryCounts[record.category]) {
      categoryCounts[record.category] += parseFloat(record.amount);
    } else {
      categoryCounts[record.category] = parseFloat(record.amount);
    }
  });

  var topCategory = 'None';
  var topAmount = 0;
  Object.keys(categoryCounts).forEach(function(cat) {
    if (categoryCounts[cat] > topAmount) {
      topAmount = categoryCounts[cat];
      topCategory = cat;
    }
  });
  document.getElementById('top-category').textContent = topCategory;

  // budget remaining
  var budgetCap = parseFloat(settings.budgetCap) || 0;
  var remaining = budgetCap - total;
  document.getElementById('budget-remaining').textContent = remaining.toLocaleString() + ' RWF';

  // budget alert
  var alert = document.getElementById('budget-alert');
  if (budgetCap > 0) {
    if (remaining < 0) {
      alert.textContent = 'Warning! You have exceeded your budget by ' + Math.abs(remaining).toLocaleString() + ' RWF';
      alert.className = 'over';
      alert.setAttribute('aria-live', 'assertive');
    } else {
      alert.textContent = 'You have ' + remaining.toLocaleString() + ' RWF remaining in your budget';
      alert.className = 'under';
      alert.setAttribute('aria-live', 'polite');
    }
  } else {
    alert.className = '';
    alert.textContent = '';
  }

  // draw the 7 day chart
  renderChart();
}

// draws a simple bar chart for last 7 days
function renderChart() {
  var chart = document.getElementById('chart');
  chart.innerHTML = '';

  var today = new Date();
  var days = [];

  for (var i = 6; i >= 0; i--) {
    var d = new Date(today);
    d.setDate(today.getDate() - i);
    var dateStr = d.toISOString().split('T')[0];
    days.push(dateStr);
  }

  var maxAmount = 0;

  var dayTotals = days.map(function(day) {
    var total = 0;
    appState.records.forEach(function(record) {
      if (record.date === day) {
        total += parseFloat(record.amount);
      }
    });
    if (total > maxAmount) maxAmount = total;
    return { day: day, total: total };
  });

  dayTotals.forEach(function(item) {
    var bar = document.createElement('div');
    var height = maxAmount > 0 ? (item.total / maxAmount) * 100 : 0;
    var shortDay = item.day.slice(5);

    bar.style.cssText = 
      'flex:1;' +
      'display:flex;' +
      'flex-direction:column;' +
      'align-items:center;' +
      'justify-content:flex-end;' +
      'gap:4px;';

    bar.innerHTML =
      '<div style="width:100%;background:#2563eb;border-radius:4px 4px 0 0;height:' + height + '%;min-height:' + (item.total > 0 ? '4' : '0') + 'px;" aria-label="' + shortDay + ': ' + item.total + ' RWF"></div>' +
      '<span style="font-size:10px;color:#64748b;">' + shortDay + '</span>';

    chart.appendChild(bar);
  });
}

// handles the form submit for adding or editing a record
function handleFormSubmit(e) {
  e.preventDefault();

  var description = document.getElementById('desc-input').value.trim();
  var amount = document.getElementById('amount-input').value.trim();
  var category = document.getElementById('category-select').value;
  var date = document.getElementById('date-input').value;

  // clear previous errors
  document.getElementById('desc-error').textContent = '';
  document.getElementById('amount-error').textContent = '';
  document.getElementById('date-error').textContent = '';

  // validate
  var errors = validateForm(description, amount, date, category);

  if (Object.keys(errors).length > 0) {
    if (errors.description) {
      document.getElementById('desc-error').textContent = errors.description;
      document.getElementById('desc-input').classList.add('invalid');
    }
    if (errors.amount) {
      document.getElementById('amount-error').textContent = errors.amount;
      document.getElementById('amount-input').classList.add('invalid');
    }
    if (errors.date) {
      document.getElementById('date-error').textContent = errors.date;
      document.getElementById('date-input').classList.add('invalid');
    }
    return;
  }

  // clear invalid styles
  document.getElementById('desc-input').classList.remove('invalid');
  document.getElementById('amount-input').classList.remove('invalid');
  document.getElementById('date-input').classList.remove('invalid');

  var record = {
    description: description,
    amount: parseFloat(amount),
    category: category,
    date: date
  };

  if (appState.editingId !== null) {
    updateRecord(appState.editingId, record);
    appState.editingId = null;
    document.getElementById('form-heading').textContent = 'Add Record';
    document.getElementById('submit-btn').textContent = 'Save Record';
    document.getElementById('form-status').textContent = 'Record updated successfully';
  } else {
    addRecord(record);
    document.getElementById('form-status').textContent = 'Record added successfully';
  }

  // reset form
  document.getElementById('record-form').reset();

  // refresh table and stats
  refreshTable();
  renderStats();
}

// handles edit button click
function handleEdit(id) {
  var record = appState.records.find(function(r) {
    return r.id === id;
  });

  if (!record) return;

  appState.editingId = id;

  document.getElementById('desc-input').value = record.description;
  document.getElementById('amount-input').value = record.amount;
  document.getElementById('category-select').value = record.category;
  document.getElementById('date-input').value = record.date;

  document.getElementById('form-heading').textContent = 'Edit Record';
  document.getElementById('submit-btn').textContent = 'Update Record';

  // scroll to form
  document.getElementById('add-record').scrollIntoView({ behavior: 'smooth' });
}

// handles delete button click
function handleDelete(id) {
  var confirmed = confirm('Are you sure you want to delete this record?');
  if (confirmed) {
    deleteRecord(id);
    refreshTable();
    renderStats();
    document.getElementById('records-status').textContent = 'Record deleted';
  }
}

// refreshes the table with current search and sort
function refreshTable() {
  var searchInput = document.getElementById('search-input').value;
  var sortBy = document.getElementById('sort-select').value;
  var caseSensitive = document.getElementById('case-toggle').checked;

  var regex = compileRegex(searchInput, caseSensitive);
  var sorted = sortRecords(appState.records, sortBy);
  var filtered = filterRecords(sorted, regex);

  renderTable(filtered, regex);
}

// handles export to JSON file
function handleExport() {
  var data = JSON.stringify(appState.records, null, 2);
  var blob = new Blob([data], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'finance-records.json';
  a.click();
  URL.revokeObjectURL(url);
}

// handles import from JSON file
function handleImport(e) {
  var file = e.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(event) {
    try {
      var imported = JSON.parse(event.target.result);

      // validate structure
      if (!Array.isArray(imported)) {
        alert('Invalid file format. File must contain an array of records.');
        return;
      }

      var valid = imported.every(function(record) {
        return record.id && record.description && record.amount && record.date;
      });

      if (!valid) {
        alert('Some records are missing required fields.');
        return;
      }

      appState.records = imported;
      saveRecords(appState.records);
      refreshTable();
      renderStats();
      alert('Records imported successfully!');

    } catch (err) {
      alert('Error reading file. Please make sure it is a valid JSON file.');
    }
  };
  reader.readAsText(file);
}

// handles settings form submit
function handleSettingsSubmit(e) {
  e.preventDefault();

  var budgetCap = document.getElementById('budget-cap').value;
  var usdRate = document.getElementById('usd-rate').value;
  var eurRate = document.getElementById('eur-rate').value;

  var settings = {
    budgetCap: parseFloat(budgetCap) || 0,
    usdRate: parseFloat(usdRate) || 1300,
    eurRate: parseFloat(eurRate) || 1400
  };

  updateSettings(settings);
  renderStats();
  alert('Settings saved successfully!');
}

// sets up all event listeners when page loads
function initUI() {
  // form submit
  document.getElementById('record-form').addEventListener('submit', handleFormSubmit);

  // cancel button
  document.getElementById('cancel-btn').addEventListener('click', function() {
    document.getElementById('record-form').reset();
    document.getElementById('desc-error').textContent = '';
    document.getElementById('amount-error').textContent = '';
    document.getElementById('date-error').textContent = '';
    document.getElementById('form-status').textContent = '';
    appState.editingId = null;
    document.getElementById('form-heading').textContent = 'Add Record';
    document.getElementById('submit-btn').textContent = 'Save Record';
  });

  // search input
  document.getElementById('search-input').addEventListener('input', refreshTable);

  // sort select
  document.getElementById('sort-select').addEventListener('change', refreshTable);

  // case toggle
  document.getElementById('case-toggle').addEventListener('change', refreshTable);

  // export button
  document.getElementById('export-btn').addEventListener('click', handleExport);

  // import input
  document.getElementById('import-input').addEventListener('change', handleImport);

  // settings form
  document.getElementById('settings-form').addEventListener('submit', handleSettingsSubmit);

  // load settings values into form
  document.getElementById('budget-cap').value = appState.settings.budgetCap || '';
  document.getElementById('usd-rate').value = appState.settings.usdRate || '';
  document.getElementById('eur-rate').value = appState.settings.eurRate || '';
}