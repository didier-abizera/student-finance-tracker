// search.js
// handles live search and highlight matches in the table

// safely compiles user input into a regex pattern
// returns null if the pattern is invalid
function compileRegex(input, caseSensitive) {
  if (input === '') {
    return null;
  }
  try {
    var flags = caseSensitive ? '' : 'i';
    return new RegExp(input, flags);
  } catch (e) {
    console.log('Invalid regex pattern: ' + e);
    return null;
  }
}

// highlights matching text in a string using mark tag
// returns the original text if no regex is given
function highlightMatch(text, regex) {
  if (regex === null) {
    return text;
  }
  return text.replace(regex, function(match) {
    return '<mark>' + match + '</mark>';
  });
}

// filters records based on search input
// checks description and category fields
function filterRecords(records, regex) {
  if (regex === null) {
    return records;
  }
  return records.filter(function(record) {
    return regex.test(record.description) || regex.test(record.category);
  });
}