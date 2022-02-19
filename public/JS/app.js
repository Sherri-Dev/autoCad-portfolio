const API_INFO = "https://autocad-api.herokuapp.com/api";
// Loader
import { activateLoader, deactivateLoader } from "./projects.js";
document.addEventListener("DOMContentLoaded", activateLoader);
window.addEventListener("load", deactivateLoader);
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
  projects.forEach((project) => {
    project.addEventListener("click", async (e) => {
      let projectID = e.target.querySelector("p").textContent;
      const data = await getDataFromApi(
        `projects/${projectID}`,
        "populate=images"
      );
      sessionStorage.setItem("selectedProject", JSON.stringify(data.data));
      location.href = "./project.html";
    });
  });
}

/********************** GET DATA FROM CMS **************************/
const getDataFromApi = async (dataToBeFetched, params) => {
  const res = params
    ? await fetch(`${API_INFO}/${dataToBeFetched}?${params}`)
    : await fetch(`${API_INFO}/${dataToBeFetched}`);
  return await res.json();
};
window.addEventListener("load", () => initApp());
const initApp = () => {
  getProjects();
  getServices();
  getReviews();
};
//Get Projects
const getProjects = async () => {
  const data = await getDataFromApi(
    "projects",
    "populate=images&sort=createdAt:desc"
  );
  const projects = data.data;
  let projectsHtml = "";
  projects.forEach((project) => {
    projectsHtml += `<div class="portfolio-item">
       <div class="portfolio-overlay">
           <h3 class="portfolio-h">
               ${project.attributes.title}
           </h3>
           <p>${project.id}</p>
       </div>
       <div class="portfolio-item-content">
           <div class = 'project-img'>
           <img src = '${project.attributes.images.data[0].attributes.url}' alt = "project-img">
           </div>
       </div>
   </div>`;
  });
  portfolioGallery.innerHTML = projectsHtml;
  openProject(document.querySelectorAll(".portfolio-item"));
};

// Get Services

const getServices = async () => {
  const servicesContainer = document.querySelector(".services-container");
  const data = await getDataFromApi("services");
  const services = data.data;
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
};
// Testimonials Slider
const reviews = document.querySelectorAll(".review");
let activeReview = "";
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

function slider(direction, reviewNum) {
  activeReview = document.querySelector(".review.active");
  activeReview.classList.remove("active");
  if (direction === "next") {
    if (activeReview.nextElementSibling) {
      activeReview.nextElementSibling.classList.add("active");
    } else {
      reviewNum.classList.add("active");
    }
  }
  if (direction === "prev") {
    if (activeReview.previousElementSibling) {
      activeReview.previousElementSibling.classList.add("active");
    } else {
      reviewNum.classList.add("active");
    }
  }
}
// Get Reviews
const getReviews = async () => {
  const reviewsContainer = document.getElementById("reviews");
  const data = await getDataFromApi("reviews", "sort=createdAt:desc");
  const reviews = data.data;
  let html = "";
  reviews.forEach((review) => {
    html += `<div class="review">
      <div class="profile">
              <h3>${review.attributes.reviewName}</h3>
              <p>${review.attributes.reviewDescription}</p>
      </div>
      <div class="review-text">
          <i class="fas fa-quote-left"></i>
          <p class="lead">${review.attributes.reviewText}</p>
      </div>
      </div>`;
  });
  reviewsContainer.innerHTML = html;
  const reviewsHtml = document.querySelectorAll(".review");
  reviewsHtml[0].classList.add("active");
  nextBtn.addEventListener("click", () => slider("next", reviewsHtml[0]));
  prevBtn.addEventListener("click", () =>
    slider("prev", reviewsHtml[reviewsHtml.length - 1])
  );
};
/********************** ADD Reviews FORM **************************/
const reviewForm = document.getElementById("reviewForm");
const formBtn = document.getElementById("show-form");
const closeFormBtn = document.getElementById("close-reviewForm");
formBtn.addEventListener("click", () => showForm());
closeFormBtn.addEventListener("click", () => closeForm());
const showForm = () => {
  reviewForm.classList.remove("hide");
  reviewForm.classList.add("flex");
  document.body.classList.add("overflow-hidden");
};
const closeForm = () => {
  reviewForm.classList.remove("flex");
  reviewForm.classList.add("hide");
  document.body.classList.remove("overflow-hidden");
};
/********************** ADD Reviews to CMS **************************/
const addReviewBtn = document.getElementById("add-review-btn");
reviewForm.addEventListener("submit", addReview);
function addReview(e) {
  e.preventDefault();
  let name = document.getElementById("name-input");
  let reviewDesc = document.getElementById("desig-input");
  let reviewText = document.getElementById("review-input");
  fetch(`${API_INFO}/reviews`, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      data: {
        publishedAt: null,
        reviewName: name.value,
        reviewDescription: reviewDesc.value,
        reviewText: reviewText.value,
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      name.value = "";
      reviewDesc.value = "";
      reviewText.value = "";
      showRes(data);
    })
    .catch((error) => {
      showRes(error);
    });
}
const showRes = (data) => {
  const reviewRes = document.getElementById("review-res");
  reviewRes.classList.remove("hide");
  let msg = data.data
    ? "Your review has been submitted successfully!"
    : data && !data.data
    ? "Connection Error"
    : `*${data.error.name}`;
  let classToBeAdded = data.data ? "success" : "error";
  reviewRes.classList.add(`${classToBeAdded}`);
  reviewRes.textContent = `${msg}`;
  setTimeout(() => {
    reviewRes.classList.add("hide");
  }, 2500);
};

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
