// GENERATE DYNAMIC PRODUCT LIST
const productContainer = document.getElementById("product-item");
const loadMoreButton = document.getElementById("load-more");
const loadMoreArea = document.querySelector(".loadmore-area");
let productsDisplayed = 0;
const productsPerLoad = 18;

// FETCH DATA FROM JSON FILE
fetch("../data/product.json")
  .then((response) => response.json())
  .then((data) => {
    const shoppings = data;

    function displayProducts(startIndex, endIndex) {
      for (let i = startIndex; i < endIndex; i++) {
        const product = Object.values(shoppings)[i];

        // CREATE JSON-LD STRUCTURED DATA
        const allProductData = {
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.title,
          image: product.image1,
          description: product.description.join(" "),
          offers: {
            "@type": "Offer",
            priceCurrency: "IDR",
            price: parseFloat(product.price.replace(/\./g, "")).toFixed(2),
            priceValidUntil: "2028-01-30",
            url: product.url,
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
            applicableCountry: "ID",
          },
          brand: {
            "@type": "Brand",
            name: "product.brand",
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "ID",
            returnPolicyCategory:
              "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 3,
            returnMethod: "https://schema.org/ReturnByMail",
            returnFees: "https://schema.org/FreeReturn",
          },
        };

        // LOOPING HTML
        const productHtml = `
<a class="product-flex" href="${product.url}" title="${
          product.title
        }" itemprop="url">
<article class="product-grid" itemprop="itemListElement" itemscope itemtype="https://schema.org/Product">
${
  product.price && product.oriprice
    ? `<div class="product-discount" itemprop="discount">${(
        ((parseFloat(product.oriprice.replace(/\./g, "")) -
          parseFloat(product.price.replace(/\./g, ""))) /
          parseFloat(product.oriprice.replace(/\./g, ""))) *
        100
      ).toFixed(0)}%</div>`
    : ""
}
<div class="product-image">
<img src="${product.image1}" alt="${
          product.title
        }" loading="lazy" itemprop="image">
</div>
<div class="product-title">
<h3 itemprop="name">${product.title}</h3>
<div class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
<p class="product-getprice">${parseInt(product.price).toLocaleString(
          "id-ID"
        )}</p>
${
  product.oriprice
    ? `<p class="product-oriprice">${parseInt(product.oriprice).toLocaleString(
        "id-ID"
      )}</p>`
    : ""
}
<meta itemprop="price" content="${parseFloat(product.price)
          .toFixed(2)
          .toLocaleString("id-ID")}" />
<meta itemprop="priceCurrency" content="IDR" />
<meta itemprop="availability" content="https://schema.org/InStock" />
<meta itemprop="priceValidUntil" content="2028-01-30" />
<meta itemprop="hasMerchantReturnPolicy" content="https://www.centraphone.com/legal/terms.html" />
</div>
<meta itemprop="description" content="${product.description
          .join(" ")
          .replace(/(<([^>]+)>)/gi, "")}" />
</div>
</article>
</a>`;

        productContainer.innerHTML += productHtml;

        // DYNAMICALLY JSON-LD
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify(allProductData);
        document.head.appendChild(script);
      }

      loadMoreArea.style.display = "block";
    }

    // LOAD MORE FUNCTION
    function loadMoreProducts() {
      const nextBatch = productsDisplayed + productsPerLoad;
      if (nextBatch < Object.values(shoppings).length) {
        displayProducts(productsDisplayed, nextBatch);
        productsDisplayed = nextBatch;
      } else {
        displayProducts(productsDisplayed, Object.values(shoppings).length);
        loadMoreButton.style.display = "none";
      }
    }

    loadMoreButton.addEventListener("click", loadMoreProducts);
    loadMoreProducts();
  })
  .catch((error) => console.error("Error fetching data:", error));
