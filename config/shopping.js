// URL PARAMETER GENERATOR
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// GENERATE DYNAMIC PRODUCT PAGE
function displayProductDetails() {
  var selectedProduct = getParameterByName("product");
  var shoppingContainer = document.getElementById("shopping-container");

  // GET DATA FROM JSON
  fetch("../data/product.json")
    .then((response) => response.json())
    .then((shoppings) => {
      if (selectedProduct && shoppings[selectedProduct]) {
        var product = shoppings[selectedProduct];
        
        // META TAG GENERATOR
        document.title = product.title + " - Centraphone";
        document.getElementById("metaTitle").content =
          product.title + " - Centraphone";
        document.getElementById("ogTitle").content =
          product.title + " - Centraphone";
        document.getElementById("twitterTitle").content =
          product.title + " - Centraphone";

        var descriptionText = product.description
          ? product.description.join(" ")
          : "Temukan ponsel terbaik di Centraphone.";
        document.getElementById("metaDescription").content = descriptionText;
        document.getElementById("ogDescription").content = descriptionText;
        document.getElementById("twitterDescription").content = descriptionText;

        var metaImage =
          product.image1 || "https://centraphone.com/asset/image/app.png";
        document.getElementById("metaImage").content = metaImage;
        document.getElementById("ogImage").content = metaImage;
        document.getElementById("twitterImage").content = metaImage;

        var canonicalLink = product.url || "https://centraphone.com";
        document.querySelector('link[rel="canonical"]').href = canonicalLink;

        // CREATE JSON-LD STRUCTURED DATA
        const productShoppingData = {
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
            name: product.brand,
          },
          hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "ID",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 3,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  }
        };

        // INSERT STRUCTURED DATA INTO DOM
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify(productShoppingData);
        document.head.appendChild(script);

        // HTML LOOPING
        var shoppingHTML = `
<article class="shopping-left">
<div class="shopping-grid">
<div class="shopping-data">
<div class="shopping-data-left">
<div class="shopping-data-img">
<div class="shopping-banner">
<img src="${product.image1}" alt="${
          product.title
        }" class="main-image" loading="lazy">
</div>
<div class="thumbnail-box">
<div class="thumbnail-grid"><img src="${product.image1}" alt="Shopping ${
          product.title
        }" onclick="changeImage('${product.image1}')" loading="lazy"></div>
${
  product.image2
    ? `<div class="thumbnail-grid"><img src="${product.image2}" alt="${product.title}" onclick="changeImage('${product.image2}')" loading="lazy"></div>`
    : ""
}
${
  product.image3
    ? `<div class="thumbnail-grid"><img src="${product.image3}" alt="${product.title}" onclick="changeImage('${product.image3}')" loading="lazy"></div>`
    : ""
}
</div>
</div>
</div>
<div class="shopping-data-right">
<div class="shopping-title" id="initialproduct" itemprop="name">${
          product.title
        }</div>
<div class="shopping-price" id="initialprice" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
${
  product.price && product.oriprice
    ? `<span class="shopping-discount" itemprop="discount">${(
        ((parseFloat(product.oriprice.replace(/\./g, "")) -
          parseFloat(product.price.replace(/\./g, ""))) /
          parseFloat(product.oriprice.replace(/\./g, ""))) *
        100
      ).toFixed(0)}%</span>`
    : ""
}
<p class="shopping-getprice" itemprop="price">${parseInt(
          product.price
        ).toLocaleString("id-ID")}</p>
${
  product.oriprice
    ? `<p class="shopping-oriprice">${parseInt(product.oriprice).toLocaleString(
        "id-ID"
      )}</p>`
    : ""
}
</div>
<meta itemprop="priceCurrency" content="IDR" />
<meta itemprop="availability" content="https://schema.org/InStock" />
<meta itemprop="priceValidUntil" content="2028-01-30" />
<meta itemprop="hasMerchantReturnPolicy" content="https://www.centraphone.com/legal/terms.html" />
<button id="add-to-cart1">Add to Cart</button>
<div class="shopping-detail">
<h3>Product Specification</h3>
<table>
  ${
    product.brand
      ? `<tr>
    <td>Brand</td>
    <td style="text-align:right;">
      <a href="../page/brand.html?product=${product.brand}">${product.brand}</a>
    </td>
  </tr>`
      : ""
  }
  ${
    product.color
      ? `<tr>
    <td>Color</td>
    <td style="text-align:right;">${product.color}</td>
  </tr>`
      : ""
  }
  ${
    product.ram
      ? `<tr>
    <td>RAM</td>
    <td style="text-align:right;">${product.ram}</td>
  </tr>`
      : ""
  }
  ${
    product.rom
      ? `<tr>
    <td>ROM</td>
    <td style="text-align:right;">${product.rom}</td>
  </tr>`
      : ""
  }
  ${
    product.processor
      ? `<tr>
    <td>Processor</td>
    <td style="text-align:right;">${product.processor}</td>
  </tr>`
      : ""
  }
  ${
    product.display
      ? `<tr>
    <td>Screen</td>
    <td style="text-align:right;">${product.display}</td>
  </tr>`
      : ""
  }
  ${
    product.camera
      ? `<tr>
    <td>Camera</td>
    <td style="text-align:right;">${product.camera}</td>
  </tr>`
      : ""
  }
  ${
    product.battery
      ? `<tr>
    <td>Battery</td>
    <td style="text-align:right;">${product.battery}</td>
  </tr>`
      : ""
  }
  ${
    product.os
      ? `<tr>
    <td>OS</td>
    <td style="text-align:right;">${product.os}</td>
  </tr>`
      : ""
  }
  ${
    product.network
      ? `<tr>
    <td>Network</td>
    <td style="text-align:right;">${product.network}</td>
  </tr>`
      : ""
  }
</table>
</div>
</div>
</div>
<div class="shopping-content">
<h3>Product Description</h3>
<div id="shopping-description">`;
        for (var p = 0; p < product.description.length; p++) {
          shoppingHTML += `<p>${product.description[p]}</p>`;
        }
        shoppingHTML += `</div>
</div>
</div>
</article>
<aside class="shopping-right">
<div class="recommendation-product" itemscope itemtype="https://schema.org/ItemList">
<div class="recommendation-product-content">
<h3>${product.brand} Product</h3>
<ol id="recommendation-product-item"></ol>
</div>
</div>
</aside>
`;

        shoppingContainer.innerHTML = shoppingHTML;

      } else {
        var notFoundHTML = `<div class="not-found"><div class="product-not-found">Sorry, the product is not available. Please return to the home page or choose other product recommendations.</div></div>`;
        shoppingContainer.innerHTML = notFoundHTML;
      }
    })
    .catch((error) => console.error("Error:", error));
}

// CHANGE IMAGES
function changeImage(imageSrc) {
  document.querySelector(".main-image").src = imageSrc;
}

// SHOW PRODUCT DETAIL
document.addEventListener("DOMContentLoaded", function () {
  displayProductDetails();
});

// ADD TO CART
async function addProductToCart() {
  try {
    const params = new URLSearchParams(window.location.search);
    const productName = params.get("product");
    if (!productName) return false;

    const response = await fetch("../data/product.json");
    const allProducts = await response.json();
    const product = allProducts[productName];

    if (!product) {
      console.error("Produk tidak ditemukan");
      return false;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.product === product.title);

    if (existingItem) {
      if (existingItem.quantity >= 20) {
        alert(`Maximum purchase of ${product.title} is only 20 items`);
        return false;
      }
      existingItem.quantity += 1;
    } else {
      cart.push({
        image: product.image1 || "",
        product: product.title,
        price: parseFloat((product.price || "0").replace(/\./g, "")),
        oriPrice: parseFloat((product.oriprice || "0").replace(/\./g, "")),
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    if (typeof updateCartCount === "function") {
      updateCartCount();
    }

    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

// FEEDBACK VISUAL FLY ANIMATION
function showAddToCartFeedback(button) {
  const feedback = document.createElement("div");
  feedback.className = "fly-animation";
  
  const productImage = document.querySelector(".main-image").src;
  
  const img = document.createElement("img");
  img.src = productImage;
  img.alt = "Product";
  feedback.appendChild(img);

  const rect = button.getBoundingClientRect();
  feedback.style.left = `${rect.left + rect.width / 2 - 15}px`;
  feedback.style.top = `${rect.top}px`;

  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.remove();
  }, 1000);
}

// EVENT LISTENER FOR MOBILE BUTTON
document.addEventListener("DOMContentLoaded", function () {
  const mobileButton = document.getElementById("add-to-cart2");
  if (mobileButton) {
    mobileButton.addEventListener("click", async function (e) {
      e.preventDefault();
      const success = await addProductToCart();
      if (success) {
        showAddToCartFeedback(this);
        this.classList.add("clicked");
        setTimeout(() => {
          this.classList.remove("clicked");
        }, 300);
      }
    });
  }
});

// EVENT DDELEGATION FOR DESKTOP BUTTON
document.addEventListener("click", async function (e) {
  if (e.target && e.target.id === "add-to-cart1") {
    e.preventDefault();
    const success = await addProductToCart();
    if (success) {
      showAddToCartFeedback(e.target);
      e.target.classList.add("clicked");
      setTimeout(() => {
        e.target.classList.remove("clicked");
      }, 300);
    }
  }
});

// RECOMMENDATION PRODUCT BY BRAND
document.addEventListener("DOMContentLoaded", () => {
  fetch("../data/product.json")
    .then((response) => response.json())
    .then((data) => {
      const selectedProduct = getParameterByName("product");
      if (selectedProduct && data[selectedProduct]) {
        const currentBrand = data[selectedProduct].brand;
        displayRecommendationProducts(data, currentBrand);
      }
    })
    .catch((error) => console.error("Error fetching the JSON data:", error));
});

function displayRecommendationProducts(products, brandFilter) {
  const recommendationProductItem = document.getElementById(
    "recommendation-product-item"
  );

  recommendationProductItem.innerHTML = "";

  let productsArray = Object.values(products).filter(
    (product) =>
      product.brand && product.brand.toLowerCase() === brandFilter.toLowerCase()
  );

  if (productsArray.length === 0) {
    return;
  }

  // Shuffle the array
  for (let i = productsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [productsArray[i], productsArray[j]] = [productsArray[j], productsArray[i]];
  }

  const recommendedProducts = productsArray.slice(0, 5);

  recommendedProducts.forEach((product) => {
    // Calculate discount percentage if original price exists
    let discountPercentage = 0;
    if (product.oriprice && product.price) {
      const oriPrice = parseFloat(
        product.oriprice.replace(/\./g, "").replace(",", ".")
      );
      const currPrice = parseFloat(
        product.price.replace(/\./g, "").replace(",", ".")
      );
      discountPercentage = (
        ((oriPrice - currPrice) / oriPrice) *
        100
      ).toFixed(0);
    }

    // Create JSON-LD structured data
    const productRecommendproductData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.title,
      image: product.image1,
      description: product.description.join(" "),
      offers: {
        "@type": "Offer",
        priceCurrency: "IDR",
        price: parseFloat(product.price.replace(/\./g, "").replace(",", ".")).toFixed(2),
        priceValidUntil: "2028-01-30",
        url: product.url,
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock",
        applicableCountry: "ID",
      },
      brand: {
        "@type": "Brand",
        name: product.brand,
      },
      hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "ID",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 3,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  }
    };

    const productHTML = `
<li itemprop="itemListElement" itemscope itemtype="https://schema.org/Product">
  <a href="${product.url}" title="${product.title}" itemprop="url">
    <article class="recommendation-grid">
      ${
        product.price && product.oriprice
          ? `<div class="recommendation-discount" itemprop="discount">${discountPercentage}%</div>`
          : ""
      }
      <div class="recommendation-image">
        <img src="${product.image1}" alt="${
      product.title
    }" loading="lazy" itemprop="image">
      </div>
      <div class="recommendation-info">
        <h4 itemprop="name">${product.title}</h4>
        <div class="recommendation-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <p class="recommendation-getprice">${parseInt(
            product.price
          ).toLocaleString("id-ID")}</p>
          ${
            product.oriprice
              ? `<p class="recommendation-oriprice">${parseInt(
                  product.oriprice
                ).toLocaleString("id-ID")}</p>`
              : ""
          }
          <meta itemprop="price" content="${parseFloat(
            product.price.replace(/\./g, "").replace(",", ".")
          ).toFixed(2)}" />
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
  </a>
</li>`;

    recommendationProductItem.innerHTML += productHTML;

    // Add JSON-LD TO PAGE
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(productRecommendproductData);
    document.head.appendChild(script);
  });
}
