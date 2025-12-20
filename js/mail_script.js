// Form submission handler
document.querySelector("#contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  fetch("../server/sendMail.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      if (data.includes("success")) {
        document.getElementById("successModal").style.display = "block";
        form.reset();
      } else {
        alert("❌ Submission failed. Try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("❌ Something went wrong.");
    });
});

