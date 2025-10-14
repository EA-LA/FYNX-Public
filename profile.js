// ====================
// 🔥 Firebase Imports
// ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ====================
// 🚀 Firebase Config (REPLACE THESE VALUES)
// ====================
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

// ====================
// 🌐 Load Profile
// ====================

// Elements in HTML
const title = document.getElementById("title");
const badge = document.getElementById("badge");
const idRow = document.getElementById("idRow");
const errorEl = document.getElementById("error");

// Parse FYNX ID from URL
const parts = window.location.pathname.split("/");
const fynxId = parts[parts.length - 1];

// Load the profile document and render
(async () => {
  try {
    const ref = doc(db, "profiles", fynxId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      title.textContent = "Profile Not Found";
      errorEl.style.display = 'block';
      errorEl.textContent = `No public profile for ${fynxId}`;
      return;
    }

    const data = snap.data();

    // If profile is not public
    if (!data.publicEnabled) {
      title.textContent = "Profile Hidden";
      errorEl.style.display = 'block';
      errorEl.textContent = "This user has a private profile.";
      return;
    }

    // Username or ID
    title.textContent = data.username ? `${data.username} · ${data.userID}` : data.userID;

    // Display ID Row
    idRow.innerHTML = `
      <span class="tag">FYNX ID: ${data.userID}</span>
      ${data.photoURL ? `<img src="${data.photoURL}" alt="avatar" height="32" style="border-radius:50%;">` : ""}
    `;

    // Handle both shapes: stats map OR top-level fields
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
    errorEl.style.display = 'block';
    errorEl.textContent = String(e);
  }
})();
