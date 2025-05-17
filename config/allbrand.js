document.addEventListener("DOMContentLoaded", () => {
  fetch("../data/brand.json")
    .then((response) => response.json())
    .then((data) => {
      const isAllBrandPage = window.location.pathname.endsWith("/page/allbrand.html");
      const brandsToDisplay = isAllBrandPage ? data : data.slice(0, 8);
      displayBrands(brandsToDisplay);
    })
    .catch((error) => console.error("Error fetching the JSON data:", error));
});

function displayBrands(brands) {
  const container = document.getElementById("brand-item");
  container.innerHTML = "";

  // Create a list structure for the brand collection
  const allBrandData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": brands.map((brand, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Brand",
        "name": brand.title,
        "url": brand.url,
        "logo": brand.image,
        "description": `Products and deals from ${brand.title}`
      }
    }))
  };

  // Add the brand list structured data to the page
  const listScript = document.createElement("script");
  listScript.type = "application/ld+json";
  listScript.text = JSON.stringify(allBrandData);
  document.head.appendChild(listScript);

  brands.forEach((brand, index) => {
    const brandHTML = `
      <a class="brand-flex" href="${brand.url}" title="Brand ${brand.title}" itemprop="url">
        <div class="brand-grid" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <meta itemprop="position" content="${index + 1}" />
          <div class="brand-image" itemprop="image">
            <img src="${brand.image}" alt="Shop ${brand.title} products" loading="lazy" itemprop="logo">
          </div>
          <div class="brand-info">
            <h3 itemprop="name">${brand.title}</h3>
            <meta itemprop="description" content="Explore products and deals from ${brand.title}">
          </div>
        </div>
      </a>
    `;
    container.innerHTML += brandHTML;
  });
}
