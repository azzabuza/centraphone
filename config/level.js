document.addEventListener("DOMContentLoaded", () => {
  // LIST OF CATEGORIES AND THEIR PRICE RANGES
  const categories = [
    {
      id: "flagship-item",
      minPrice: 8000000,
      maxPrice: 60000000,
      page: "/page/flagship.html",
    },
    {
      id: "highend-item",
      minPrice: 5000000,
      maxPrice: 8000000,
      page: "/page/highend.html",
    },
    {
      id: "midrange-item",
      minPrice: 2000000,
      maxPrice: 5000000,
      page: "/page/midrange.html",
    },
    {
      id: "entrylevel-item",
      minPrice: 0,
      maxPrice: 2000000,
      page: "/page/entrylevel.html",
    },
  ];

  // Load data produk sekali saja
  fetch("../data/product.json")
    .then((response) => response.json())
    .then((data) => {
      categories.forEach((category) => {
        const container = document.getElementById(category.id);
        if (container) {
          const isCategoryPage = window.location.pathname.includes(
            category.page
          );
          displayProducts(
            data,
            container,
            category.minPrice,
            category.maxPrice,
            isCategoryPage
          );
        }
      });
    })
    .catch((error) => console.error("Error:", error));
});

// THE MAIN FUNCTION MODIFIED FROM DISPLAYFLAGSHIPPRODUCTS
function displayProducts(data, container, minPrice, maxPrice, showAll = false) {
  let filteredProducts = Object.values(data).filter((product) => {
    if (!product.price) return false;
    const currPrice = parseFloat(
      product.price.replace(/\./g, "").replace(",", ".")
    );
    return currPrice >= minPrice && currPrice <= maxPrice;
  });

  if (!showAll) {
    filteredProducts = filteredProducts.slice(0, 6);
  }

  if (filteredProducts.length > 0) {
    container.innerHTML = "";
    filteredProducts.forEach((product) => {
      const oriPrice = parseFloat(
        product.oriprice?.replace(/\./g, "").replace(",", ".") || 0
      );
      const currPrice = parseFloat(
        product.price.replace(/\./g, "").replace(",", ".")
      );
      const discountPercentage =
        oriPrice > currPrice
          ? (((oriPrice - currPrice) / oriPrice) * 100).toFixed(0)
          : 0;

      // CREATE JSON-LD STRUCTURED DATA FOR SEO
      const productLevelData = {
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
  discountPercentage > 0
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

      container.insertAdjacentHTML("beforeend", productHTML);

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(productLevelData);
      document.head.appendChild(script);
    });
  } else {
    container.innerHTML = `<div class="not-found"><div class="product-not-found">There are no products in this price range.</div></div>`;
  }
}
