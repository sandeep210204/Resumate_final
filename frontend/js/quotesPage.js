import { getQuotes } from '../api/progressApi.js';

async function init() {
  const main = document.getElementById('quote-main');
  const list = document.getElementById('quote-list');

  main.textContent = 'Loading...';
  list.textContent = '';

  try {
    const data = await getQuotes();
    main.innerHTML = '';
    const text = document.createElement('div');
    text.className = 'quote-main-text';
    text.textContent = `"${data.today.text}"`;
    const author = document.createElement('div');
    author.className = 'quote-main-author';
    author.textContent = `– ${data.today.author}`;
    main.appendChild(text);
    main.appendChild(author);

    list.innerHTML = '';
    (data.list || []).forEach((q) => {
      const card = document.createElement('div');
      card.className = 'quote-card';
      const qt = document.createElement('div');
      qt.textContent = `"${q.text}"`;
      const qa = document.createElement('div');
      qa.className = 'quote-card-author';
      qa.textContent = `– ${q.author}`;
      card.appendChild(qt);
      card.appendChild(qa);
      list.appendChild(card);
    });
  } catch {
    main.textContent = 'Unable to load quotes right now.';
  }
}

document.addEventListener('DOMContentLoaded', init);


