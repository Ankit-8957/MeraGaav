
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault(); // stops page reload

  const params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  emailjs.send("service_bkvl03g", "template_j5h9wn5", params)
    .then(() => {
      alert("Mera Gaav | We Received Your Complaint");
      this.reset(); // clear the form
    })
    .catch(err => {
      console.error("EmailJS error:", err);
      alert("Oops! Something went wrong. Please try again.");
    });
});