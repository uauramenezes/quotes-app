// Event Listeners
window.onload = fetchQuotes()
document.querySelector('#save-btn').addEventListener('click', addQuote);
document.querySelector(".navbar-brand").addEventListener('click', reload);
document.querySelector('#cancel-btn').addEventListener('click', resetForm);
document.querySelector('#search-btn').addEventListener('click', searchAuthor);

document.querySelector('#search').addEventListener('keydown', (e) => {
  if (e.key == 'Enter') {
    e.preventDefault();
    searchAuthor();
  }
});

document.querySelector('#add-btn').addEventListener('click', () => {
	displayForm(false);
});

document.querySelector('#author-input').addEventListener('keydown', (e) => {
  if (e.key == 'Enter') {
    e.preventDefault();
    addQuote();
  };
});

// Form input manipulation/validation
function addQuote() {
	const input = getInputValues();
	
	if (!validateInput(input)) return;

	clearSearchInput();
	saveQuote(input);
	resetForm();
}

function getInputValues() {
	const author = document.querySelector('#author-input').value.trim();
	const quote = document.querySelector('#quote-input').value.trim();

	return [author, quote];
}

function validateInput([author, quote]) {
	if (author && quote) return true;
	
	inputErrorMsg(author, quote);
	return false;
}

function clearSearchInput() {
	document.querySelector("#search").value = '';
}

// Data fetching
function fetchQuotes() {
	fetch('https://enigmatic-mountain-90467.herokuapp.com/')
	.then(response => response.json())
	.then(data => {
    if (data) return fetchLoop(data);
    quoteErrorMsg("There is no quotes.");
  })
	.catch(err => quoteErrorMsg("Oops! An error occurred.", err))
}

function saveQuote([authorName, quoteText]) {
	fetch('https://enigmatic-mountain-90467.herokuapp.com/', {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({author: authorName, quote: quoteText})
	})
		.then(response => response.json())
		.then(data => {
      if (!data) return quoteErrorMsg("Oops! An error occurred.");

      createCard(authorName, data[0].author_id, quoteText, data[0].quote_id, 'insert');
    })
    .catch(err => quoteErrorMsg("Oops! An error occurred.", err))
}

function searchAuthor() {
	let authorName = document.querySelector("#search").value;
  clearSearchInput();
  removeCard('all');

  if (!authorName) return fetchQuotes();

	fetch(`https://enigmatic-mountain-90467.herokuapp.com/${authorName}`)
		.then(response => response.json())
    .then(data => {
      if (data.length > 0) return fetchLoop(data);
      quoteErrorMsg("Author not found.");
    })
    .catch(err => quoteErrorMsg("Oops! An error occurred.", err))
}

function removeQuote(_authorId, quoteId) {
  if (quoteId === 'error-msg') return removeCard(quoteId);

	fetch(`https://enigmatic-mountain-90467.herokuapp.com/${quoteId}`, {
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
		.then(response => {
			if (response.status === 200) removeCard(quoteId);
		})
    .catch(err => quoteErrorMsg("Oops! An error occurred.", err))
}

// Data manipulation
function fetchLoop(data, author='') {
  if (data.error) return quoteErrorMsg(data.error);
  if (author) data[0].name = author;

  data.forEach(e => {
    createCard(e.name, e.author_id, e.text, e.quote_id);
  })
}

// Card div manipulation
function createCard(authorName, authorId, quote, quoteId, type='append') {
	const main = document.querySelector('.container');

	let card = document.createElement('div');
	card.className = 'card';
	card.id = quoteId;

	let cardHeader = document.createElement('div');
	cardHeader.className = 'card-header';

	let authorSpan = document.createElement('span');
	authorSpan.className = 'author';
	authorSpan.id = authorId;
	authorSpan.textContent = authorName;

	let removeBtn = document.createElement('button');
	removeBtn.className = 'btn btn-danger remove-btn';
	removeBtn.textContent = 'Remove'

	let cardBody = document.createElement('div');
	cardBody.className = 'card-body';

	let blockquote = document.createElement('blockquote');
	blockquote.className = 'blockquote mb-0';

	let quoteP = document.createElement('p');
	quoteP.className = 'quote';
	quoteP.id = quoteId;
	quoteP.textContent = quote;

	cardHeader.appendChild(authorSpan);
	cardHeader.appendChild(removeBtn);
	blockquote.appendChild(quoteP);
	cardBody.appendChild(blockquote);
	card.appendChild(cardHeader);
	card.appendChild(cardBody);

  if (type === 'append') main.appendChild(card);
  else main.insertBefore(card, main.firstChild);

	removeBtn.addEventListener('click', () => {
		removeQuote(authorId, quoteId);
	});
}

function removeCard(id) {
	const container = document.querySelector('.container');
	const card = document.getElementById(id);
	
	if (id && card || id === 'error-msg') {
    return container.removeChild(card);
  }

	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
}

// Error Messages
function inputErrorMsg([author, quote]) {
	let authorErrorMsg = document.querySelector('#author-error-msg');
	let quoteErrorMsg = document.querySelector('#quote-error-msg');

	authorErrorMsg.hidden = author ? true : false;
	quoteErrorMsg.hidden = quote ? true : false;
}

function quoteErrorMsg(msg, error = '') {
  if (error !== '') console.log(error);
  
  removeCard('all');
  createCard("Quotes App", "error-card", msg, "error-msg");
}

// Form manipulation
function displayForm(display) {
	let form = document.querySelector('.quotes-form');
	form.hidden = display;
}

function resetForm() {
	displayForm(true);
	document.querySelector('.quotes-form').reset();
}

// Page reset
function reload() {
	clearSearchInput();
	removeCard('all');
	fetchQuotes();
}
