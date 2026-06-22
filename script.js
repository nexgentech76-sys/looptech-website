/* =========================
   LOOPTECH WEBSITE SCRIPT
========================= */

/* =========================
   BOOK DEMO FORM SUBMIT
========================= */

const demoForm = document.getElementById("demoForm");
const submitBtn = document.querySelector(".submit-btn");

if (demoForm && submitBtn) {
  demoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      name: getValue("name"),
      phone: getValue("phone"),
      email: getValue("email"),
      business: getValue("business"),
      businessType: getValue("businessType"),
      service: getValue("service"),
      message: getValue("message"),
    };

    if (!isValidForm(formData)) {
      alert("Please fill all required fields");
      return;
    }

    setButtonLoading(true);

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Submission failed");
      }

      if (result.whatsapp) {
        window.open(result.whatsapp, "_blank");
      }

      demoForm.reset();

      window.location.href = "/thank-you";
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Server error. Please try again or contact us on WhatsApp.");
    } finally {
      setButtonLoading(false);
    }
  });
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function isValidForm(data) {
  return (
    data.name &&
    data.phone &&
    data.email &&
    data.business &&
    data.businessType &&
    data.service
  );
}

function setButtonLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.innerHTML = isLoading
    ? "Submitting..."
    : '<i class="fab fa-whatsapp"></i> Submit Request';
}

/* =========================
   ANIMATED COUNTERS
========================= */

const counters = document.querySelectorAll(".count");

if (counters.length > 0) {
  counters.forEach((counter) => {
    animateCounter(counter);
  });
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  let current = 0;
  const increment = Math.ceil(target / 100);

  const timer = setInterval(() => {
    current += increment;

    if (current >= target) {
      counter.innerText = formatCounter(target);
      clearInterval(timer);
      return;
    }

    counter.innerText = current;
  }, 20);
}

function formatCounter(value) {
  if (value === 500) return "500+";
  if (value === 6) return "6+";
  if (value === 99) return "99%";
  return value;
}