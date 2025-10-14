import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ---- replace with your real values ----
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const title = document.getElementById("title");
const badge = document.getElementById("badge");
const idRow = document.getElementById("idRow");
const errorEl = document.getElementById("error");

// Robust ID parsing: must match /u/<ID>
const match = window.location.pathname.match(/\/u\/([^/]+)\/?$/);
const fynxId = match ? decodeURIComponent(match[1]) : null;

if (!fynxId) {
  title.textContent = "Profile Viewer";
  errorEl.style.display = "block";
  errorEl.textContent = "Open a URL like /u/FYNX-XXXXXXX (e.g., https://elhamamini.cc/u/FYNX-3BFA03DA)";
  throw new Error("Missing /u/<id> in URL");
}

(async () => {
  try {
    const ref = doc(db, "profiles", fynxId); // safe: we validated fynxId
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      title.textContent = "Profile Not Found";
      errorEl.style.display = "block";
      errorEl.textContent = `No public profile for ${fynxId}`;
      return;
    }

    const data = snap.data();

    if (!data.publicEnabled) {
      title.textContent = "Profile Hidden";
      errorEl.style.display = "block";
      errorEl.textContent = "This user has a private profile.";
      return;
    }

    title.textContent = data.username ? `${data.username} · ${data.userID}` : data.userID;

    idRow.innerHTML = `
      <span class="tag">FYNX ID: ${data.userID}</span>
      ${data.photoURL ? `<img src="${data.photoURL}" alt="avatar" height="32" style="border-radius:50%;">` : ""}
    `;

    const s = data.stats ?? {
      winRate: data.winRate ?? 0,
      maxDD: data.maxDD ?? 0,
      trades: data.trades ?? 0
    };

    badge.innerHTML = `
      <span class="tag">Win Rate: ${Number(s.winRate).toFixed(1)}%</span>
      <span class="tag">Max DD: ${Number(s.maxDD).toFixed(1)}%</span>
      <span class="tag">${Number(s.trades)} trades</span>
    `;
  } catch (e) {
    console.error("FULL ERROR:", e);
    title.textContent = "Error Loading Profile";
    errorEl.style.display = "block";
    errorEl.textContent = String(e);
  }
})();
