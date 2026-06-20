/* =========================
   BOOK DEMO FORM SUBMIT
========================= */

const demoForm = document.getElementById("demoForm");

if (demoForm) {
  demoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = document.querySelector(".submit-btn");

    const formData = {
      name: document.getElementById("name")?.value.trim() || "",
      phone: document.getElementById("phone")?.value.trim() || "",
      email: document.getElementById("email")?.value.trim() || "",
      business: document.getElementById("business")?.value.trim() || "",
      businessType: document.getElementById("businessType")?.value || "",
      service: document.getElementById("service")?.value || "",
      message: document.getElementById("message")?.value.trim() || "",
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
        return;
      }

      if (result.whatsapp) {
        window.open(result.whatsapp, "_blank");
      }

      demoForm.reset();

      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 1000);
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Server error. Please check Node.js terminal.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Submit Request';
    }
  });
}

/* =========================
   ANIMATED COUNTERS
========================= */

const counters = document.querySelectorAll(".count");

if (counters.length > 0) {
  counters.forEach((counter) => {
    const target = Number(counter.getAttribute("data-target"));
    let count = 0;

    const updateCounter = () => {
      const increment = Math.ceil(target / 100);

      count += increment;

      if (count < target) {
        counter.innerText = count;
        setTimeout(updateCounter, 20);
      } else {
        if (target === 500) {
          counter.innerText = "500+";
        } else if (target === 6) {
          counter.innerText = "6+";
        } else if (target === 99) {
          counter.innerText = "99%";
        } else {
          counter.innerText = target;
        }
      }
    };

    updateCounter();
  });
}