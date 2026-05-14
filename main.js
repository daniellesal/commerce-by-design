// ============================================================
// Commerce by Design — RSVP handler (FormSubmit.co backend)
// ============================================================

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
    if (data._honey) return;

    if (!data.Name || !data.Email || !data.Company || !data.Attending) {
      status.classList.add("error");
      status.textContent = "Please fill in name, email, company, and attendance.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
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
      const json = await res.json().catch(() => ({}));

      if (res.ok && (json.success === "true" || json.success === true)) {
        form.hidden = true;
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        throw new Error(json.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      status.classList.add("error");
      status.textContent = "Something went wrong. Please try again, or email Danielle directly at danielle.salvatore@shopify.com.";
      submitBtn.disabled = false;
      labelEl.textContent = originalLabel;
    }
  });
})();
