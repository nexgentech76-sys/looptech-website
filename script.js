const API_URL = "https://looptech-website.onrender.com/api/book-demo";

const demoForm = document.getElementById("demoForm");
const submitBtn = document.getElementById("submitBtn");
const successBox = document.getElementById("successBox");

if (demoForm) {
  demoForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      name: getValue("name"),
      phone: getValue("phone"),
      email: getValue("email"),
      business: getValue("business"),
      businessType: getValue("businessType"),
      service: getValue("service"),
      message: getValue("message")
    };

    if (!formData.name || !formData.phone || !formData.email || !formData.business || !formData.businessType || !formData.service) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Submission failed. Please try again.");
        setLoading(false);
        return;
      }

      showSuccess(formData.name);
      demoForm.reset();

      if (result.whatsapp) {
        window.open(result.whatsapp, "_blank");
      }

      setTimeout(function () {
        window.location.href = "thank-you.html";
      }, 1200);
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Server error. Please try WhatsApp.");
      setLoading(false);
    }
  });
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function setLoading(isLoading) {
  if (!submitBtn) return;

  submitBtn.disabled = isLoading;
  submitBtn.innerHTML = isLoading
    ? "Submitting..."
    : '<i class="fab fa-whatsapp"></i> Submit Request';
}

function showSuccess(name) {
  if (!successBox) return;

  successBox.style.display = "block";
  successBox.innerHTML = `✅ Thank you <b>${name}</b>! Your demo request has been received successfully.`;
}

const counters = document.querySelectorAll(".count");

if (counters.length > 0) {
  counters.forEach(animateCounter);
}

function animateCounter(counter) {
  const target = Number(counter.getAttribute("data-target") || 0);
  let current = 0;
  const increment = Math.max(1, Math.ceil(target / 100));

  const timer = setInterval(function () {
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