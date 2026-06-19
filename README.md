# Student Finance Tracker

A simple web app I built to help students like me keep track of daily expenses. 
You can add your spending, search through it, set a budget, and see where your 
money is going each week.

## Live App
https://didier-abizera.github.io/student-finance-tracker

## GitHub Repo
https://github.com/didier-abizera/student-finance-tracker


## What I Built This With
- HTML
- CSS
- JavaScript
- No frameworks or libraries used

# Pages in the App
- **About** — short intro and my contact info
- **Dashboard** — shows total spent, top category, budget left, and a 7-day chart
- **Records** — table of all expenses with search, sort, edit and delete
- **Add Record** — form to add a new expense
- **Settings** — set your budget cap and currency exchange rates



## Features
- Add, edit and delete expense records
- Live search that highlights matching words as you type
- Sort records by date, description or amount
- Dashboard stats that update automatically
- Budget cap with green message when under and red warning when over
- Shows total spent in RWF, USD and EUR
- Export all records as a JSON file
- Import records from a JSON file
- Works on mobile, tablet and desktop
- Keyboard navigation works throughout the app



## Regex Rules Used

**Rule 1 - Description**
Pattern: `/^\S(?:.*\S)?$/`
Makes sure description does not start or end with spaces.
Example: "Lunch at cafeteria" passes. " Lunch " fails.

**Rule 2 - Amount**
Pattern: `/^(0|[1-9]\d*)(\.\d{1,2})?$/`
Makes sure amount is a valid number with max 2 decimal places.
Example: "2500" passes. "abc" fails. "12.555" fails.

**Rule 3 - Date**
Pattern: `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`
Makes sure date is in YYYY-MM-DD format.
Example: "2025-09-25" passes. "25-09-2025" fails.

**Rule 4 - Category**
Pattern: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`
Makes sure category only has letters, spaces or hyphens.
Example: "Food" passes. "Food123" fails.

**Rule 5 - Duplicate Words (Advanced)**
Pattern: `/\b(\w+)\s+\1\b/i`
Catches duplicate words in description using back-reference.
Example: "the the lunch" fails. "lunch at school" passes.



## Keyboard Navigation
- **Tab** — move to the next button or input
- **Shift + Tab** — move back to previous element
- **Enter** — click a button or link
- **Space** — check or uncheck a checkbox
- **Escape** — cancel the form



## Accessibility
- Skip to content link at the very top for keyboard users
- Every input has a label
- Error messages are announced automatically by screen readers
- Budget alert is announced when budget is exceeded
- Visible blue outline shows which element is focused
- Proper HTML landmarks used: header, nav, main, section, footer



## How to Run the Tests
1. Open the file `tests.html` in your browser
2. Tests run automatically when the page loads
3. You will see green PASS or red FAIL for each of the 24 tests



## How to Import Sample Data
1. Go to the Settings section
2. Click Import JSON
3. Select the file `seed.json` from the project folder
4. The app will load 12 sample records



## Project Structure
    student-finance-tracker/

.index.html
.tests.html
.seed.json
.README.md
.styles/main.css
.scripts/storage.js
        /state.js
        /validators.js
        /search.js
        /ui.js

.assets/images/wireframes

## Demo Video
https://www.youtube.com/watch?v=2YHvm8yaD-U
