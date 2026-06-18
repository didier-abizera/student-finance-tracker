// validators.js
// checks all form inputs before saving a record

// rule 1: description cannot start or end with spaces
// and cannot have double spaces in the middle
function validateDescription(value) {
  var pattern = /^\S(?:.*\S)?$/;
  if (value === '') {
    return 'Description is required';
  }
  if (!pattern.test(value)) {
    return 'Description cannot start or end with spaces';
  }
  return true;
}

// rule 2: amount must be a valid number like 2500 or 12.50
function validateAmount(value) {
  var pattern = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
  if (value === '') {
    return 'Amount is required';
  }
  if (!pattern.test(value)) {
    return 'Amount must be a valid number e.g. 2500 or 12.50';
  }
  return true;
}

// rule 3: date must be in YYYY-MM-DD format
function validateDate(value) {
  var pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (value === '') {
    return 'Date is required';
  }
  if (!pattern.test(value)) {
    return 'Date must be in YYYY-MM-DD format';
  }
  return true;
}

// rule 4: category must only have letters spaces or hyphens
function validateCategory(value) {
  var pattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
  if (value === '') {
    return 'Category is required';
  }
  if (!pattern.test(value)) {
    return 'Category can only have letters spaces or hyphens';
  }
  return true;
}

// rule 5 (advanced): checks for duplicate words in description
// e.g. "the the" or "lunch lunch" will be caught
function checkDuplicateWords(value) {
  var pattern = /\b(\w+)\s+\1\b/i;
  if (pattern.test(value)) {
    return 'Description has duplicate words';
  }
  return true;
}

// this runs all checks on the form at once
// returns an object with any errors found
function validateForm(description, amount, date, category) {
  var errors = {};

  var descCheck = validateDescription(description);
  if (descCheck !== true) {
    errors.description = descCheck;
  }

  var dupCheck = checkDuplicateWords(description);
  if (dupCheck !== true) {
    errors.description = dupCheck;
  }

  var amountCheck = validateAmount(amount);
  if (amountCheck !== true) {
    errors.amount = amountCheck;
  }

  var dateCheck = validateDate(date);
  if (dateCheck !== true) {
    errors.date = dateCheck;
  }

  var categoryCheck = validateCategory(category);
  if (categoryCheck !== true) {
    errors.category = categoryCheck;
  }

  return errors;
}