// Hamburger
const hamburger = document.getElementById("hamburger");
const header = document.getElementById("header");

hamburger.onclick = function toggleFunc() {
  hamburger.classList.toggle("active");
  header.classList.toggle("header-active");
};
document.addEventListener("click", (e) => {
  if (e.target !== header && e.target !== hamburger) {
    hamburger.classList.remove("active");
    header.classList.remove("header-active");
  }
});

// Scroll Spy

let current = "home";
const menu = document.querySelector(".main-nav-ul");
const menuItems = document.querySelectorAll(".main-nav-ul li");
const sections = document.querySelectorAll("section");
window.addEventListener("scroll", onScrollActive);

function onScrollActive() {
  sections.forEach((section) => {
    let sectionTop = section.offsetTop;
    let sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
    let currentSec = document.getElementById(`${current}`);
  });
  menuItems.forEach((menuItem) => {
    menuItem.classList.remove("menu-active-li");
    if (menuItem.classList.contains(current)) {
      menuItem.classList.add("menu-active-li");
    }
  });
}

//Footer Dynamic Year
let siteTitle = "Manak Draft and Designer";
let footerText = document.getElementById("footer-text");
footerText.innerHTML = new Date().getFullYear() + "  " + siteTitle;

// Counters
function counters() {
  const counterLinear = document.querySelectorAll(".counter-linear");
  const counterCircular = document.querySelectorAll(".counter-circular");
  let countLinear = 0;
  let countCircular = 0;

  for (let i = 0; i < counterLinear.length; i++) {
    let countNum = counterLinear[i].innerHTML;
    setInterval(() => {
      if (countLinear <= parseInt(countNum)) {
        countLinear = 1 + countLinear;
        counterLinear[i].innerHTML = countLinear;
      }
    }, 50);
  }
  for (let i = 0; i < counterCircular.length; i++) {
    let countPercent = counterCircular[i].innerHTML;
    setInterval(() => {
      if (countCircular < parseInt(countPercent)) {
        countCircular = 1 + countCircular;
        counterCircular[i].innerHTML = countCircular + "%";
      }
    }, 120);
  }
}

// Portfolio Section
const portfolioGallery = document.querySelector(".portfolio-gallery");
const portfolioItems = document.querySelectorAll(".portfolio-item");
const portfolioContent = document.querySelectorAll(".portfolio-item-content");
const closePopup = document.querySelectorAll(".close-popup");
function openProject(projects) {
  projects.forEach((popup) => {
    popup.addEventListener("click", (e) => {
      popup.classList.toggle("portfolio-active");
      popup.querySelector(".portfolio-overlay").classList.toggle("hide");
      popup.querySelector(".close-popup").classList.toggle("show-close");
      document.body.classList.toggle("overflow-hidden");
    });
  });
}
/********************** GET Projects FROM CMS **************************/
window.addEventListener("load", () => initApp());
const initApp = () => {
  getProjects();
  getServices();
};
const getProjects = () => {
  fetch("https://autocad-api.herokuapp.com/api/projects?populate=images")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const projects = data.data;
      let projectsHtml = "";
      projects.forEach((project) => {
        let descriptionArr = project.attributes.description.split("\n");
        let descriptionli = "";
        descriptionArr.forEach((text) => {
          descriptionli += `<li>${text}</li>`;
        });
        projectsHtml += `<div class="portfolio-item">
       <div class="portfolio-overlay">
           <h3 class="portfolio-h">
               ${project.attributes.title}
           </h3>
       </div>
       <div class="portfolio-item-content">
           <div class="close-popup">
               <p class="lead">Tap again to close!</p>
               <p class="cross">&#9587</p>
           </div>
           <div class = "content-details">
           <div class="ext-text">
           <h2>${project.attributes.title}</h2>
           <ul class="lead">
           ${descriptionli}
           </ul>
           </div>
           <div class = 'project-img'>
           <img src = '${project.attributes.images.data[0].attributes.formats.large.url}'>
           </div>
           </div>
       </div>
   </div>`;
      });
      portfolioGallery.innerHTML = projectsHtml;
      openProject(document.querySelectorAll(".portfolio-item"));
    });
};

// Services Section
/********************** GET Services FROM CMS **************************/
const getServices = () => {
  const servicesContainer = document.querySelector(".services-container");
  fetch("https://autocad-api.herokuapp.com/api/services")
    .then((res) => res.json())
    .then((data) => {
      const services = data.data;
      console.log(data);
      let serviceHtml = "";
      services.forEach((service, index) => {
        let myindex = index < 10 ? `0${index + 1}` : index + 1;
        serviceHtml += `<div class="service-item">
<div class="service-icon">${myindex}</div>
<h3>${service.attributes.title}</h3>
<p>${service.attributes.description}</p>
</div>`;
      });
      servicesContainer.innerHTML = serviceHtml;
    });
};
// Testimonials Slider
const reviewSlider = document.querySelector(".review-slider");
const upArrow = document.getElementById("up-arrow");
const downArrow = document.getElementById("down-arrow");
const reviewLength = document.querySelectorAll(".review").length;
const reviewHeight = document.querySelector(".review").clientHeight;
let clickCounter = 0;

upArrow.addEventListener("click", () => slider("up"));
downArrow.addEventListener("click", () => slider("down"));

function slider(direction) {
  // Activating Slider

  if (direction === "up" && clickCounter < reviewLength - 1) {
    clickCounter++;
    reviewSlider.style.top = -(reviewHeight * clickCounter) + "px";
    downArrow.style.color = "white";
  } else if (direction === "down" && clickCounter > 0) {
    clickCounter--;
    reviewSlider.style.top = -(reviewHeight * clickCounter) + "px";
    upArrow.style.color = "white";
  } else {
    console.log("none");
  }

  // Deactivating Slider

  if (direction === "up" && clickCounter == reviewLength - 1) {
    upArrow.style.color = "grey";
  } else if (direction === "down" && clickCounter == 0) {
    downArrow.style.color = "grey";
  }
}
// Form
const inputs = document.querySelectorAll(".input");
const label = document.querySelectorAll(".label");
inputs.forEach((input) => {
  input.addEventListener("focus", (e) => {
    input.classList.add("focus");
  });
  input.addEventListener("blur", (e) => {
    if (input.value == "") {
      input.classList.remove("focus");
    }
  });
});
// Form-Integration
var form = document.getElementById("my-form");

async function handleSubmit(event) {
  event.preventDefault();
  var status = document.getElementById("my-form-status");
  var data = new FormData(event.target);
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      status.style.opacity = "1";
      status.innerHTML = "Thanks! We'll get back to you ASAP";
      form.reset();
    })
    .catch((error) => {
      status.style.opacity = "1";
      status.innerHTML = "Oops! There was a problem submitting your form";
    });
}
form.addEventListener("submit", handleSubmit);
