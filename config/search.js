document.addEventListener("DOMContentLoaded", () => {
  fetch("../data/product.json")
    .then((response) => response.json())
    .then((data) => {
      const productsArray = Array.isArray(data) ? data : Object.values(data);
      displayProducts(productsArray);

      // INSERT JSON-LD STRUCTURED DATA
      productsArray.forEach((product) => {
        const productSearchData = {
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

        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify(productSearchData);
        document.head.appendChild(script);
      });

      // CHECK URL PARAMETER IF EXISTS
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get("query");
      if (queryParam) {
        document.getElementById("search-item").value = queryParam;
        search();
      }
    })
    .catch((error) => console.error("Error fetching the JSON data:", error));
});

function displayProducts(shoppings) {
  const productList = document.getElementById("search-list");
  const productHTML = shoppings
    .map(
      (product) => `
<a class="search-flex" href="${product.url}" itemprop="url">
<article class="search-grid" itemprop="itemListElement" itemscope itemtype="https://schema.org/Product">
<div class="search-image">
<img src="${product.image1}" alt="${
        product.title
      }" loading="lazy" itemprop="image">
</div>
<div class="search-info">
<h4 itemprop="name">${product.title}</h4>
<div class="search-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
${
  product.price && product.oriprice
    ? `<span class="search-discount" itemprop="discount">${(
        ((parseFloat(product.oriprice.replace(/\./g, "")) -
          parseFloat(product.price.replace(/\./g, ""))) /
          parseFloat(product.oriprice.replace(/\./g, ""))) *
        100
      ).toFixed(0)}%</span>`
    : ""
}
<p class="search-getprice">${parseInt(product.price).toLocaleString(
        "id-ID"
      )}</p>
${
  product.oriprice
    ? `<p class="search-oriprice">${parseInt(product.oriprice).toLocaleString(
        "id-ID"
      )}</p>`
    : ""
}
<meta itemprop="price" content="${parseFloat(product.price).toFixed(2)}" />
<meta itemprop="priceCurrency" content="IDR" />
<meta itemprop="availability" content="https://schema.org/InStock" />
<meta itemprop="priceValidUntil" content="2028-01-30" />
<meta itemprop="hasMerchantReturnPolicy" content="https://www.centraphone.com/legal/terms.html" />
</div>
<meta itemprop="description" content="${(product.description || [])
        .join(" ")
        .replace(/(<([^>]+)>)/gi, "")}" />
</div>
</article>
</a>
`
    )
    .join("");
  productList.innerHTML = productHTML;
}

function search() {
  const searchbox = document.getElementById("search-item").value.toUpperCase();
  const productSearch = document.querySelectorAll(".search-flex");
  let foundProduct = false;

  // CHECK EVERY PRODUCT AND DISPLAY/HIDE PRODUCTS BASED ON THE SEARCH
  for (const item of productSearch) {
    const productSearchName = item.querySelector("h4");
    if (productSearchName) {
      const textvalue = productSearchName.textContent.toUpperCase();
      if (textvalue.includes(searchbox)) {
        item.style.display = "block";
        foundProduct = true;
      } else {
        item.style.display = "none";
      }
    }
  }

  // IF THE SEARCH BOX IS EMPTY, DISPLAY ALL PRODUCTS
  if (searchbox === "") {
    productSearch.forEach((item) => {
      item.style.display = "block";
    });
    foundProduct = true;
  }

  const notFoundMessage = document.querySelector(".not-found");
  if (notFoundMessage) {
    if (!foundProduct) {
      notFoundMessage.style.display = "block";
    } else {
      notFoundMessage.style.display = "none";
    }
  }
}

document.getElementById("search-item").addEventListener("input", search);
