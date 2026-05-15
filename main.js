// ============================================================
// Commerce by Design — RSVP UX (FormSubmit standard POST)
// ============================================================
//
// Form submits natively (no JS fetch — works everywhere, no CORS).
// FormSubmit redirects back here with ?rsvp=success and we swap in
// the success card. JS is purely progressive enhancement: client-side
// validation for instant feedback, but the form still works if JS is
// disabled.

(function () {
  const form = document.getElementById("rsvp-form");
  const status = document.getElementById("form-status");
  const success = document.getElementById("form-success");
  if (!form) return;

  // -------------------------------------------------------------
  // 1. On page load: if we just came back from a successful RSVP,
  //    show the success card and hide the form.
  // -------------------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  if (params.get("rsvp") === "success") {
    form.hidden = true;
    success.hidden = false;
    // Scroll to the success card after a beat so the browser finishes
    // restoring layout.
    setTimeout(() => {
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    // Clean up the URL so a refresh doesn't keep showing the success state
    if (window.history.replaceState) {
      const url = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, url);
    }
    return;
  }

  // -------------------------------------------------------------
  // 2. Lightweight client-side validation before native submit
  // -------------------------------------------------------------
  form.addEventListener("submit", (e) => {
    status.classList.remove("error");
    status.textContent = "";

    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.Name || !data.Email || !data.Company || !data.Attending) {
      e.preventDefault();
      status.classList.add("error");
      status.textContent = "Please fill in name, email, company, and attendance.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
      e.preventDefault();
      status.classList.add("error");
      status.textContent = "Please enter a valid email address.";
      return;
    }

    // Valid — show "Sending…" state and let the form submit natively.
    const submitBtn = form.querySelector("button[type=submit]");
    const labelEl = submitBtn.querySelector(".cta-label");
    submitBtn.disabled = true;
    labelEl.textContent = "Sending…";
  });
})();
