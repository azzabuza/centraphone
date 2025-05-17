document.addEventListener("DOMContentLoaded", () => {
  // TAKE THE CONTAINER ELEMENT FOR DISCOUNTED PRODUCTS
  const discountContainer = document.getElementById("discount-item");

  // CHECK WHETHER THE PAGE IS /PAGE/DISCOUNT.HTML OR NOT
  const isDiscountPage = window.location.pathname.includes(
    "/page/discount.html"
  );

  // FETCH PRODUCT DATA FROM JSON FILE
  fetch("../data/product.json")
    .then((response) => response.json())
    .then((data) =>
      displayDiscountedProducts(data, isDiscountPage, discountContainer)
    )
    .catch((error) =>
      console.error("Terjadi kesalahan saat mengambil data JSON:", error)
    );
});

// FUNCTION TO DISPLAY DISCOUNTED PRODUCTS
function displayDiscountedProducts(data, isDiscountPage, discountContainer) {
  // FILTER PRODUCTS THAT HAVE DISCOUNTS
  let discountedProducts = Object.values(data).filter((product) => {
    if (!product.oriprice || !product.price) return false;

    // FORMAT PRICE SO IT CAN BE COMPARED
    const oriPrice = parseFloat(
      product.oriprice.replace(/\./g, "").replace(",", ".")
    );
    const currPrice = parseFloat(
      product.price.replace(/\./g, "").replace(",", ".")
    );

    return oriPrice > currPrice;
  });

  // IF IT'S NOT THE DISCOUNT.HTML PAGE, LIMIT TO ONLY 6 PRODUCTS
  if (!isDiscountPage) {
    discountedProducts = discountedProducts.slice(0, 6);
  }

  // IF THERE IS A DISCOUNTED PRODUCT
  if (discountedProducts.length > 0) {
    discountedProducts.forEach((product) => {
      // CALCULATE DISCOUNT PERCENTAGE
      const oriPrice = parseFloat(
        product.oriprice.replace(/\./g, "").replace(",", ".")
      );
      const currPrice = parseFloat(
        product.price.replace(/\./g, "").replace(",", ".")
      );
      const discountPercentage = (
        ((oriPrice - currPrice) / oriPrice) *
        100
      ).toFixed(0);

      // CREATE JSON-LD STRUCTURED DATA FOR SEO
      const productDiscountData = {
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

      const productHTML = `
<a class="product-flex" href="${product.url}" title="${
        product.title
      }" itemprop="url">
<article class="product-grid" itemprop="itemListElement" itemscope itemtype="https://schema.org/Product">
${
  product.price && product.oriprice
    ? `<div class="product-discount" itemprop="discount">${discountPercentage}%</div>`
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
<p class="product-getprice">${parseInt(currPrice).toLocaleString("id-ID")}</p>
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

      // ADD PRODUCT TO CONTAINER
      discountContainer.insertAdjacentHTML("beforeend", productHTML);

      // ADD JSON-LD TO THE PAGE
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(productDiscountData);
      document.head.appendChild(script);
    });
  } else {
    // IF THERE ARE NO DISCOUNTED PRODUCTS, DISPLAY A MESSAGE
    discountContainer.innerHTML = `<div class="not-found"><div class="product-not-found">Sorry, there are no discounted products at this time.</div></div>`;
  }
}
