document.addEventListener("DOMContentLoaded", function() {
  // Load cart data
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // If cart is empty, redirect back to cart page
  if (cart.length === 0) {
    window.location.href = "../page/cart.html";
    return;
  }
  
  // Calculate order summary
  let subtotal = 0;
  let totalInsurance = 0;
  let totalPacking = 0;
  
  const checkoutItems = document.getElementById("checkout-items");
  let itemsHTML = "";
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    const itemInsurance = item.price * 0.003 * item.quantity;
    const itemPacking = 6000 * item.quantity;
    
    subtotal += itemTotal;
    totalInsurance += itemInsurance;
    totalPacking += itemPacking;
    
    itemsHTML += `
      <div class="checkout-item" style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
        <div>
          <div style="font-weight: 500;">${escapeHTML(item.product)}</div>
          <div style="font-size: 0.9em; color: #666;">${item.quantity} x Rp${item.price.toLocaleString("id-ID")}</div>
        </div>
        <div style="font-weight: 500;">Rp${itemTotal.toLocaleString("id-ID")}</div>
      </div>
    `;
  });
  
  checkoutItems.innerHTML = itemsHTML;
  
  // Calculate shipping (example: flat rate)
  const shippingFee = 15000;
  const adminFee = 3000;
  const total = subtotal + totalInsurance + totalPacking + shippingFee + adminFee;
  
  // Update summary
  document.getElementById("checkout-subtotal").textContent = `Rp${subtotal.toLocaleString("id-ID")}`;
  document.getElementById("checkout-insurance").textContent = `Rp${totalInsurance.toLocaleString("id-ID")}`;
  document.getElementById("checkout-packing").textContent = `Rp${totalPacking.toLocaleString("id-ID")}`;
  document.getElementById("checkout-shipping").textContent = `Rp${shippingFee.toLocaleString("id-ID")}`;
  document.getElementById("checkout-administration").textContent = `Rp${adminFee.toLocaleString("id-ID")}`;
  document.getElementById("checkout-total").textContent = `Rp${total.toLocaleString("id-ID")}`;
  
  // Payment method selection
  const paymentMethods = document.querySelectorAll(".payment-method");
  const paymentMethodInput = document.getElementById("payment-method");
  
  paymentMethods.forEach(method => {
    method.addEventListener("click", function() {
      paymentMethods.forEach(m => m.classList.remove("selected"));
      this.classList.add("selected");
      paymentMethodInput.value = this.dataset.method;
      validateForm();
    });
  });
  
  // Form validation
  const shippingForm = document.getElementById("shipping-form");
  const placeOrderBtn = document.getElementById("place-order");
  
  function validateForm() {
    const inputs = shippingForm.querySelectorAll("input[required], textarea[required]");
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });
    
    if (!paymentMethodInput.value) {
      isValid = false;
    }
    
    placeOrderBtn.disabled = !isValid;
  }
  
  // Validate on input change
  shippingForm.addEventListener("input", validateForm);
  
  // Place order handler
  placeOrderBtn.addEventListener("click", function() {
    if (placeOrderBtn.disabled) return;
    
    // Collect order data
    const formData = new FormData(shippingForm);
    const orderData = {
      shipping: Object.fromEntries(formData),
      payment: {
        method: paymentMethodInput.value
      },
      items: cart,
      summary: {
        subtotal,
        insurance: totalInsurance,
        packing: totalPacking,
        shipping: shippingFee,
        admin: adminFee,
        total
      },
      date: new Date().toISOString(),
      status: "pending"
    };
    
    // Save order to localStorage (in a real app, you would send this to a server)
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem("cart");
    
    // Redirect to confirmation page (you would need to create this)
    window.location.href = "../page/order-confirmation.html";
  });
  
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
