// Event Listeners
window.onload = fetchQuotes()
document.querySelector(".navbar-brand").addEventListener('click', reload)
document.querySelector('#cancel-btn').addEventListener('click', resetForm())
document.querySelector('#save-btn').addEventListener('click', addQuote);
document.querySelector('#search-btn').addEventListener('click', searchAuthor);
document.querySelector('#add-btn').addEventListener('click', () => {
	displayForm(false);
});

// Form input manipulation/validation
function addQuote() {
	const input = getInputValues();
	
	if (!validateInput(input)) return ;

	clearSearchInput();
	saveQuote(input);
	resetForm();
}

function getInputValues() {
	const author = document.querySelector('#author-input').value.trim();
	const quote = document.querySelector('#quote-input').value.trim();

	return [author, quote]
}

function validateInput([author, quote]) {
	if (author && quote) return true;
	
	showErrorMsg("Fields can not be empty");
	return false;
}

function clearSearchInput() {
	document.querySelector("#search").value = ''
}

// Data fetching
function fetchQuotes() {
	fetch('http://localhost:5555/')
	.then(response => response.json())
	.then(data => fetchLoop(data))
	.catch(err => console.log(err))
}

function saveQuote([authorName, quoteText]) {
	fetch('http://localhost:5555/add', {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({"author": authorName, "quote": quoteText})
	})
		.then(response => response.json())
		.then(data => saveLoop(data))
		.catch(err => console.log(err))
}

function removeQuote(authorId, quoteId) {
	fetch('http://localhost:5555/remove', {
		method: 'PATCH',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({"authorId": authorId, "quoteId": quoteId})
	})
		.then(response => {
			if (response.status === 200) removeCard(quoteId)
		})
		.catch(err => console.log(err))
}

function searchAuthor() {
	let authorName = document.querySelector("#search").value;
	fetch(`http://localhost:5555/${authorName}`)
		.then(response => response.json())
		.then(data => {
			if (data.error) return alert("Author not found");
			clearSearchInput();
			removeCard('all');
			fetchLoop(data);
		})
		.catch(err => console.log(err))
}

// Data manipulation
function fetchLoop(data) {
	data.forEach(author => {
		author.quoteList.forEach(quote => {
			createCard(author._id, author.name, quote._id, quote.quote)
		})
	});
}

function saveLoop(author) {
	author.quoteList.forEach(quote => {
		createCard(author._id, author.name, quote._id, quote.quote)
	});
}

// Card div manipulation
function createCard(authorId, authorName, quoteId, quote) {
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
	main.insertBefore(card, main.firstChild);

	removeBtn.addEventListener('click', () => {
		removeQuote(authorId, quoteId)
	});
}

function removeCard(id) {
	const container = document.querySelector('.container');
	const card = document.getElementById(id);
	
	if (id && card) return container.removeChild(card);

	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
}

// Error Messages
function showErrorMsg([author, quote]) {
	let authorErrorMsg = document.querySelector('#author-error-msg');
	let quoteErrorMsg = document.querySelector('#quote-error-msg');

	authorErrorMsg.hidden = author ? true : false;
	quoteErrorMsg.hidden = quote ? true : false;
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
