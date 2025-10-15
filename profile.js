<!-- /profile.js (ESM) -->
<script type="module">
// --- Imports ---
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// --- Helpers ---
const $ = (sel) => document.querySelector(sel);

// Parse /u/<FYNX-ID>
const fynxId = location.pathname.split("/").filter(Boolean)[1]; // index 0="u", 1="<ID>"

// UI refs
const titleEl = $("#title");
const idRowEl = $("#idRow");
const badgeEl = $("#badge");
const errorEl = $("#error");

// Quick sanity
if (!fynxId) {
  titleEl.textContent = "Profile Viewer";
  errorEl.style.display = "block";
  errorEl.textContent = 'Open a URL like /u/FYNX-XXXXXXX (e.g. /u/FYNX-3BFA03DA)';
  throw new Error("Missing /u/<ID> in URL");
}

titleEl.textContent = `Profile: ${fynxId}`;

(async () => {
  try {
    if (!window.db) {
      errorEl.style.display = "block";
      errorEl.textContent = "Firebase not initialized. Paste your firebaseConfig in index.html.";
      console.error("window.db is undefined. Check firebaseConfig.");
      return;
    }

    // Load Firestore doc
    const ref = doc(window.db, "profiles", fynxId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      errorEl.style.display = "block";
      errorEl.textContent = `No public profile for ${fynxId}`;
      return;
    }

    const data = snap.data();

    if (data.publicEnabled !== true) {
      errorEl.style.display = "block";
      errorEl.textContent = "This user has a private profile.";
      return;
    }

    // Header
    idRowEl.innerHTML = `
      <span class="tag">FYNX ID: ${data.userID ?? fynxId}</span>
      ${data.photoURL ? `<img src="${data.photoURL}" alt="avatar" height="32" style="border-radius:50%;margin-left:8px;">` : ""}
    `;

    // Stats (support both top-level or stats map)
    const s = data.stats ?? {};
    const winRate = s.winRate ?? data.winRate ?? 0;
    const maxDD   = s.maxDD   ?? data.maxDD   ?? 0;
    const trades  = s.trades  ?? data.trades  ?? 0;

    badgeEl.innerHTML = `
      <span class="tag">Win Rate: ${Number(winRate).toFixed(1)}%</span>
      <span class="tag">Max DD: ${Number(maxDD).toFixed(1)}%</span>
      <span class="tag">${Number(trades)} trades</span>
    `;
  } catch (e) {
    console.error(e);
    errorEl.style.display = "block";
    errorEl.textContent = e?.message ?? String(e);
  }
})();
</script>
