// Simple inline loader / skeleton helper

export function showLoader(target) {
  if (!target) return;
  const loader = document.createElement('div');
  loader.className = 'rm-loader';
  loader.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  target.appendChild(loader);
  return loader;
}

export function removeLoader(loader) {
  if (loader && loader.parentElement) {
    loader.parentElement.removeChild(loader);
  }
}


