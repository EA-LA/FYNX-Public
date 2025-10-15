// ----- Firebase (CDN) -----
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// TODO: put YOUR values here
const firebaseConfig = {
  apiKey:        "YOUR_API_KEY",
  authDomain:    "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:     "YOUR_PROJECT_ID",
};

// Init
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// UI handles
const titleEl = document.getElementById('title');
const idRowEl = document.getElementById('idRow');
const badgeEl = document.getElementById('badge');
const errEl   = document.getElementById('error');

// Extract /u/FYNX-XXXXXX
function getFynxIdFromPath() {
  const p = window.location.pathname;         // "/", "/u/FYNX-3BFA03DA"
  if (!p.startsWith('/u/')) return null;
  const id = p.slice(3).trim();               // after "/u/"
  return id.length ? id : null;
}

(async () => {
  const fynxId = getFynxIdFromPath();

  if (!fynxId) {
    titleEl.textContent = "Profile Viewer";
    badgeEl.textContent = "Open a URL like /u/FYNX-XXXXXXX (e.g. /u/FYNX-3BFA03DA)";
    return;
  }

  try {
    titleEl.textContent = `Profile: ${fynxId}`;
    idRowEl.innerHTML = `<span class="tag">FYNX ID: ${fynxId}</span>`;

    const ref  = doc(db, "profiles", fynxId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      errEl.style.display = 'block';
      errEl.textContent   = `No public profile for ${fynxId}`;
      return;
    }

    const data = snap.data();
    if (data.publicEnabled !== true) {
      errEl.style.display = 'block';
      errEl.textContent   = "This user has a private profile.";
      return;
    }

    const username = data.username || fynxId;
    const winRate  = Number(data.winRate ?? data.stats?.winRate ?? 0);
    const maxDD    = Number(data.maxDD   ?? data.stats?.maxDD   ?? 0);
    const trades   = Number(data.trades  ?? data.stats?.trades  ?? 0);

    // header
    idRowEl.innerHTML = `
      <span class="tag">👤 ${username}</span>
      <span class="tag">🪪 ${fynxId}</span>
      ${data.photoURL ? `<img src="${data.photoURL}" alt="avatar" height="32" style="border-radius:50%; margin-left:8px;">` : ""}
    `;

    // badge
    badgeEl.innerHTML = `
      <span class="tag">Win Rate <b>${winRate.toFixed(1)}%</b></span>
      <span class="tag">Max DD <b>${maxDD.toFixed(1)}%</b></span>
      <span class="tag"><b>${trades}</b> trades</span>
    `;
  } catch (e) {
    console.error(e);
    errEl.style.display = 'block';
    errEl.textContent   = "Error loading profile";
  }
})();
