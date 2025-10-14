// ------------- Parse FYNX ID from /u/<ID> -------------
const path = window.location.pathname.replace(/\/+$/, ''); // trim trailing /
const match = path.match(/\/u\/([^/]+)$/);
const fynxId = match ? decodeURIComponent(match[1]) : null;

const title = document.getElementById('title');
const idRow = document.getElementById('idRow');
const badge = document.getElementById('badge');
const errorEl = document.getElementById('error');

if (!fynxId) {
  title.textContent = "Profile Viewer";
  idRow.innerHTML = `<span class="tag">Tip: open <code>/u/FYNX-XXXXXX</code></span>`;
  throw new Error("No /u/<id> in URL");
}

// --------- TEMP MODE (no Firebase yet): show placeholder ----------
title.textContent = fynxId;
idRow.innerHTML = `<span class="tag">FYNX ID: ${fynxId}</span>`;
badge.innerHTML = `
  <span class="tag">Win Rate: 0.0%</span>
  <span class="tag">Max DD: 0.0%</span>
  <span class="tag">0 trades</span>
`;
errorEl.style.display = 'block';
errorEl.textContent = "Firebase not connected yet — this is the website shell. We'll wire data next.";
