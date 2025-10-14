// --- Load the profile document and render ---
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
    if (!data.publicEnabled) {
      title.textContent = "Profile Hidden";
      errorEl.style.display = 'block';
      errorEl.textContent = "This user has a private profile.";
      return;
    }

    title.textContent = data.username ? `${data.username} · ${data.userID}` : data.userID;

    idRow.innerHTML = `
      <span class="tag">FYNX ID: ${data.userID}</span>
      ${data.photoURL ? `<img src="${data.photoURL}" alt="avatar" height="32" style="border-radius:50%;">` : ""}
    `;

    // Accept both shapes: data.stats.map OR top-level fields
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
    console.error(e);
    title.textContent = "Error Loading Profile";
    errorEl.style.display = 'block';
    errorEl.textContent = String(e);
  }
})();

