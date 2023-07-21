window.onload = function () {
  if (window.location.href.includes("#address")) {
    nextScreen("address");
  }
};

const the_animation = document.querySelectorAll(".animation");

//for scroll animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const parentId = entry.target.id;
      const parent = document.getElementById(parentId);
      const child_headline = parent.querySelector(".headline-screen");
      const child_subheadline = parent.querySelector(".subheadline-screen");
      const child_next = parent.querySelector(".next-icon");
      const child_phone = parent.querySelector(".screen-img");
      const pages = [
        "#home",
        "#index",
        "#interest",
        "#feed",
        "#match",
        "#message",
        "#chat",
        "#gold",
      ];

      const addressPage = "#address";
      const contactPage = "#contact";

      if (entry.isIntersecting) {
        // headline and next is same for all page
        child_headline.classList.add("animation-headline");
        child_next.classList.add("animation-next");

        // subheadline is common to all except address page
        if (parentId !== addressPage) {
          child_subheadline.classList.add("animation-subheadline");
        }

        if (pages.includes(parentId)) {
          child_phone.classList.add("animation-phone");
        }
        if (parentId === contactPage) {
          const contactForm = parent.querySelector(".form-div");
          contactForm.classList.add("animation-phone");
        }

        if (parentId === addressPage) {
          const addressDivLeft = parent.querySelector(".address-address");
          const addressDivRight = parent.querySelector(".address-div");
          addressDivLeft.classList.add("animation-subheadline");
          addressDivRight.classList.add("animation-phone");
        }
      } else {
        // common to all
        child_headline.classList.remove("animation-headline");
        child_next.classList.remove("animation-next");

        //common to all except address page
        if (parentId !== addressPage) {
          child_subheadline.classList.remove("animation-subheadline");
        }

        if (pages.includes(parentId)) {
          child_phone.classList.remove("animation-phone");
        }

        if (parentId === contactPage) {
          const contactForm = parent.querySelector(".form-div");
          contactForm.classList.remove("animation-phone");
        }

        if (parentId === addressPage) {
          const addressDivLeft = parent.querySelector(".address-address");
          const addressDivRight = parent.querySelector(".address-div");
          addressDivRight.classList.remove("animation-phone");
          addressDivLeft.classList.remove("animation.subheadline");
        }
      }
    });
  },
  { threshold: 0.2 }
);
//
for (let i = 0; i < the_animation.length; i++) {
  const elements = the_animation[i];

  observer.observe(elements);
}

function nextScreen(nextpage) {
  //scroll to next page
  document.getElementById("#" + nextpage).scrollIntoView();
}

function validateEmail(email) {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

function sendEmail() {
  var email = document.getElementById("form-email").value;
  var message = document.getElementById("form-message").value;

  if (email == "") {
    document.getElementsByClassName("alert-content")[0].innerHTML =
      "<strong>Error!</strong> Please enter email.";
    document.getElementsByClassName("alert")[0].style.display = "block";
    return;
  }

  if (!validateEmail(email)) {
    document.getElementsByClassName("alert-content")[0].innerHTML =
      "<strong>Error!</strong> Invalid email.";
    document.getElementsByClassName("alert")[0].style.display = "block";
    return;
  }

  if (message === "") {
    document.getElementsByClassName("alert-content")[0].innerHTML =
      "<strong>Error!</strong> Please enter message.";
    document.getElementsByClassName("alert")[0].style.display = "block";
    return;
  }

  //AWS SES + AWS Gateway REST API + Lamda function
  sendEmailAPI(email, message)
    .then((data) => {
      document.getElementsByClassName("alert")[0].style.backgroundColor =
        "#04AA6D";
      document.getElementsByClassName("alert-content")[0].innerHTML =
        "<strong>Success!</strong> Your message has been sent!";
      document.getElementsByClassName("alert")[0].style.display = "block";
    })
    .catch((error) => {
      console.log(error);
      document.getElementsByClassName("alert-content")[0].innerHTML =
        "<strong>Server error!</strong> <a href= 'mailto:contact@frouple.com'>Use email client</a>";
      document.getElementsByClassName("alert")[0].style.display = "block";
    });
}

async function sendEmailAPI(replytoemail, message) {
  let param = `{"content": "${message}", "replytoemail": "${replytoemail}"}`;

  let response = await fetch(
    "https://7222lpqp7l.execute-api.eu-central-1.amazonaws.com/prod",
    {
      method: "POST",
      body: param,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let data = await response;
}
