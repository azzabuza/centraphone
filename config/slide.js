fetch("../data/slide.json")
  .then((response) => response.json())
  .then((contentSlides) => {
    // ELEMENT DECLARATION
    const prevButton = document.getElementById("prev-slide");
    const nextButton = document.getElementById("next-slide");
    const sliderContainer = document.querySelector(".slide-container");
    const dotsContainer = document.querySelector(".dots-container");
    let currentSlideIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoSlideInterval;

    // SHOW/HIDE NAVIGATION FUNCTION
    const toggleNavButtons = (show) => {
      prevButton.style.display = show ? "inline-block" : "none";
      nextButton.style.display = show ? "inline-block" : "none";
    };

    // EVENT LISTENER FOR HOVER
    sliderContainer.addEventListener("mouseenter", () => toggleNavButtons(true));
    sliderContainer.addEventListener("mouseleave", () => toggleNavButtons(false));

    // EVENT LISTENER FOR NAVIGATION BUTTON
    prevButton.addEventListener("click", () => {
      showSlide(currentSlideIndex - 1);
    });
    nextButton.addEventListener("click", () => {
      showSlide(currentSlideIndex + 1);
    });

    // CREATE SLIDE FUNCTION
    function createSlide(slideData) {
      const slideItem = document.createElement("a");
      slideItem.href = `${slideData.url}`;
      slideItem.className = "slider";
      slideItem.title = `${slideData.title}`;
      slideItem.innerHTML = `
        <div class="slide-grid">
          <div class="slide-image">
            <img src="${slideData.imageUrl}" alt="${slideData.description}" loading="lazy">
            <div class="slide-title">
              <div class="slide-title-content">
                <h3>${slideData.title}</h3>
              </div>
            </div>
          </div>
        </div>
      `;
      return slideItem;
    }

    // FUNCTION FOR CREATING DOT INDICATOR
    function createDot(index) {
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.addEventListener("click", () => {
        showSlide(index);
      });
      return dot;
    }

    // FUNCTION TO DISPLAY A SPECIFIC SLIDE
    function showSlide(slideIndex) {
      const totalSlides = contentSlides.length;
      slideIndex = (slideIndex + totalSlides) % totalSlides;

      const slides = document.querySelectorAll(".slide-grid");
      const dots = document.querySelectorAll(".dot");

      slides.forEach((slideItem, index) => {
        slideItem.style.display = index === slideIndex ? "block" : "none";
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === slideIndex);
      });

      currentSlideIndex = slideIndex;
    }

    // INITIALIZATION OF SLIDES AND DOTS
    contentSlides.forEach((slideData, index) => {
      const slide = createSlide(slideData);
      sliderContainer.insertBefore(slide, dotsContainer);

      const dot = createDot(index);
      dotsContainer.appendChild(dot);
    });

    // AUTO SLIDE FUNCTION
    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % contentSlides.length;
        showSlide(currentSlideIndex);
      }, 5000);
    }

    // EVENT FOR TOUCH/SWIPE
    sliderContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      clearInterval(autoSlideInterval);
    });

    sliderContainer.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
      startAutoSlide();
    });

    // EVENT FOR MOUSE DRAG
    sliderContainer.addEventListener("mousedown", (e) => {
      touchStartX = e.clientX;
      clearInterval(autoSlideInterval);
    });

    sliderContainer.addEventListener("mouseup", (e) => {
      touchEndX = e.clientX;
      handleSwipe();
      startAutoSlide();
    });

    // FUNCTION HANDLE SWIPE
    function handleSwipe() {
      if (touchStartX - touchEndX > 50) {
        showSlide(currentSlideIndex + 1);
      } else if (touchEndX - touchStartX > 50) {
        showSlide(currentSlideIndex - 1);
      }
    }

    // START WITH THE FIRST SLIDE AND AUTO SLIDE
    showSlide(0);
    startAutoSlide();
  })
  .catch((error) => console.error("Error fetching the slides data:", error));
