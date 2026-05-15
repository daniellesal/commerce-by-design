// ============================================================
// Commerce by Design — RSVP form handler (Formspree backend)
// ============================================================
// Submits via fetch to Formspree's AJAX endpoint so the user
// stays on the page and sees a clean success card.

(function () {
  const form = document.getElementById("rsvp-form");
  const status = document.getElementById("form-status");
  const success = document.getElementById("form-success");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.classList.remove("error");
    status.textContent = "";

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // honeypot
    if (data._gotcha) return;

    // Client-side validation
    if (!data.Name || !data.email || !data.Company || !data.Attending) {
      status.classList.add("error");
      status.textContent = "Please fill in name, email, company, and attendance.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      status.classList.add("error");
      status.textContent = "Please enter a valid email address.";
      return;
    }

    const submitBtn = form.querySelector("button[type=submit]");
    const labelEl = submitBtn.querySelector(".cta-label");
    const originalLabel = labelEl.textContent;
    submitBtn.disabled = true;
    labelEl.textContent = "Sending…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData,
      });

      if (res.ok) {
        form.hidden = true;
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        const json = await res.json().catch(() => ({}));
        const msg = json?.errors?.[0]?.message || "Submission failed";
        throw new Error(msg);
      }
    } catch (err) {
      console.error(err);
      status.classList.add("error");
      status.textContent =
        "Something went wrong. Please try again, or email Danielle directly at danielle.salvatore@shopify.com.";
      submitBtn.disabled = false;
      labelEl.textContent = originalLabel;
    }
  });
})();
