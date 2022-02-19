/****************** FUNCTIONS ********************/
document.addEventListener("DOMContentLoaded", () => {
  activateLoader();
  showProject();
});
window.addEventListener("load", () => deactivateLoader());
export const activateLoader = () => {
  const loader = document.createElement("div");
  loader.classList.add("loader");
  document.body.appendChild(loader);
};
export const deactivateLoader = () =>
  document.querySelector(".loader").remove();
const showProject = () => {
  const container = document.querySelector(".project-container");
  const project = JSON.parse(sessionStorage.getItem("selectedProject"));
  container.innerHTML = createSlider(project) + createDetails(project);
  activateSlider(project);
};

// Create Slider
const createSlider = (project) => {
  let thumbnails = "";
  project.attributes.images.data.forEach((img) => {
    thumbnails += `<img src="${img.attributes.url}" alt="project-img" />`;
  });
  const slider = `<section id="slider">
  <div class="main-img">
    <img src="${project.attributes.images.data[0].attributes.url}" alt="1" id="current" />
  </div>
  <div class="imgs">
  ${thumbnails}
  </div>
</section>`;
  return slider;
};
// Create Details
const createDetails = (project) => {
  let descriptionArr = project.attributes.description.split("\n");
  let descriptionli = "";
  descriptionArr.forEach((text) => {
    descriptionli += `<li>${text}</li>`;
  });
  return `<section id="project-details">
  <h1 id="project-title">${project.attributes.title}</h1>
  <ul id="project-desc">
${descriptionli}
  </ul>
  <a href="index.html#portfolio" class="fas fa-home">Home/</a>
</section>`;
};
// Activate Slider
const activateSlider = (project) => {
  const currentImg = document.getElementById("current");
  let imgs = document.querySelectorAll(".imgs img");
  const changeFilter = (...imgs) => {
    imgs.forEach((img) => {
      img.classList.toggle("current");
    });
  };
  let currentThumb = imgs[0];
  imgs[0].classList.add("current");
  imgs.forEach((img) =>
    img.addEventListener("click", (e) => {
      currentImg.src = e.target.src;
      currentImg.classList.add("blur-in");
      changeFilter(e.target, currentThumb);
      currentThumb = e.target;
      setTimeout(() => currentImg.classList.remove("blur-in"), 100);
    })
  );
  setProps(
    project,
    document.querySelector(".main-img"),
    document.querySelector(".imgs"),
    imgs
  );
};
// Set width and height of thumbnails
const setProps = (project, mainImg, imgsDiv, imgs) => {
  let totalImgs = project.attributes.images.data.length;
  if (window.innerWidth >= 500) {
    setWidthAndHeight(mainImg, "85%", "100%");
    setWidthAndHeight(imgsDiv, "15%", "100%");
    let imgHeight = 100 / totalImgs;
    imgs.forEach((img) => setWidthAndHeight(img, "100%", `'${imgHeight}%'`));
  } else {
    setWidthAndHeight(mainImg, "100%", "80%");
    setWidthAndHeight(imgsDiv, "100%", "20%");
    let imgWidth = 100 / totalImgs;
    imgs.forEach((img) => setWidthAndHeight(img, `'${imgWidth}%'`, "100%"));
  }
};
const setWidthAndHeight = (el, w, h) => {
  el.style.width = w;
  el.style.height = h;
};
