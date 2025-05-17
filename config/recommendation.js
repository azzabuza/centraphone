document.addEventListener("DOMContentLoaded", () => {
  fetch("../data/product.json")
    .then((response) => response.json())
    .then((data) => displayRecommendationProducts(data))
    .catch((error) => console.error("Error fetching the JSON data:", error));
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayRecommendationProducts(products) {
  const recommendationProductItem = document.getElementById(
    "recommendation-product-item"
  );

  const productsArray = Object.values(products);
  shuffleArray(productsArray);
  const randomProducts = productsArray.slice(0, 5);

  randomProducts.forEach((product) => {
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

    // CREATE JSON-LD STRUCTURED DATA FOR SEO
    const productRecommendGeneralData = {
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

    additionalProperty: {
      "@type": "PropertyValue",
      name: "Terms and Conditions",
      value: "Original invoice and packaging must be complete."
    }
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

    // ADD JSON-LD TO THE PAGE
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(productRecommendGeneralData);
    document.head.appendChild(script);
  });
}
