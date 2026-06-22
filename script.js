const demoForm = document.getElementById("demoForm");

if (demoForm) {
  demoForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitBtn = document.querySelector(".submit-btn");
    const successBox = document.getElementById("successBox");

    const formData = {
      name: getValue("name"),
      phone: getValue("phone"),
      email: getValue("email"),
      business: getValue("business"),
      businessType: getValue("businessType"),
      service: getValue("service"),
      message: getValue("message"),
    };

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.business ||
      !formData.businessType ||
      !formData.service
    ) {
      alert("Please fill all required fields");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting...";

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
        alert(result.message || "Submission failed");
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Submit Request';
        return;
      }

      if (successBox) {
        successBox.style.display = "block";
        successBox.innerHTML =
          "✅ Thank you <b>" +
          formData.name +
          "</b>! Your demo request has been received successfully.";
      }

      demoForm.reset();

      if (result.whatsapp) {
        window.open(result.whatsapp, "_blank");
      }

      setTimeout(function () {
        window.location.href = "/thank-you.html";
      }, 1000);
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Server Error. Please try WhatsApp.");

      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Submit Request';
    }
  });
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

const counters = document.querySelectorAll(".count");

if (counters.length > 0) {
  counters.forEach(function (counter) {
    animateCounter(counter);
  });
}

function animateCounter(counter) {
  const target = Number(counter.getAttribute("data-target") || 0);
  let current = 0;
  const increment = Math.ceil(target / 100);

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