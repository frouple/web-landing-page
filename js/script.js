function animateIndex(page) {
  //console.log(document.getElementsByClassName(page));
  document.getElementsByClassName(page)[0].style.animation =
    "animation-headline-screen 2s ease-out";
  document.getElementsByClassName(page)[1].style.animation =
    "animation-subheadline-index 2s ease-out";
  document.getElementsByClassName(page)[2].style.animation =
    "animation-next-screen 2s ease-out";
  document.getElementsByClassName(page)[3].style.animation =
    "animation-phone-screen 2s ease-out";
}

function nextScreen(nextpage) {
  //scroll to next page
  document.getElementById("#" + nextpage).scrollIntoView();

  //address page is handled differently
  if (nextpage === "address") {
    document.getElementsByClassName(nextpage)[0].style.animation =
      "animation-headline-screen 3s ease-out";
    document.getElementsByClassName("address-address")[0].style.animation =
      "animation-subheadline-screen 3s ease-out";
  } else {
    //annimate elements on the page
    document.getElementsByClassName(nextpage)[0].style.animation =
      "animation-headline-screen 3s ease-out";
    document.getElementsByClassName(nextpage)[1].style.animation =
      "animation-subheadline-screen 3s ease-out";
    document.getElementsByClassName(nextpage)[2].style.animation =
      "animation-next-screen 3s ease-out";
  }

  if (nextpage === "contact") {
    document.getElementsByClassName("form-div")[0].style.animation =
      "animation-phone-screen 2s ease-out";
  } else if (nextpage === "address") {
    document.getElementsByClassName("address-div")[0].style.animation =
      "animation-phone-screen 2s ease-out";
  } else {
    document.getElementsByClassName(nextpage)[3].style.animation =
      "animation-phone-screen 2s ease-out";
  }

  //remove annimation style
  setTimeout(() => {
    if (nextpage === "contact") {
      document.getElementsByClassName(nextpage)[0].style.animation = null;
      document.getElementsByClassName(nextpage)[1].style.animation = null;
      document.getElementsByClassName(nextpage)[2].style.animation = null;

      document.getElementsByClassName("form-div")[0].style.animation = null;
    } else if (nextpage === "address") {
      document.getElementsByClassName(nextpage)[0].style.animation = null;
      document.getElementsByClassName("address-div")[0].style.animation = null;
      document.getElementsByClassName("address-address")[0].style.animation =
        null;
    } else {
      document.getElementsByClassName(nextpage)[0].style.animation = null;
      document.getElementsByClassName(nextpage)[1].style.animation = null;
      document.getElementsByClassName(nextpage)[2].style.animation = null;

      document.getElementsByClassName(nextpage)[3].style.animation = null;
    }
  }, 3000);
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
