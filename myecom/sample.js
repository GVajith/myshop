document.addEventListener("DOMContentLoaded", () => {
  const cartCountElement = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartCount() {
    if (cartCountElement) {
      cartCountElement.innerText = cart.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  window.addToCart = function (productName, productImage, price) {
  const existingItem = cart.find((item) => item.productName === productName);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ productName, productImage, price, quantity: 1 });
  }
  saveCart();
  alert(`${productName} has been added to your cart! ✅`);
};

  function renderCart() {
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      // If cart is empty, show message
      cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty!</p>`;
      if (cartTotalElement) {
        cartTotalElement.innerText = "0.00";
      }
      return; // stop execution
    }

    //  If cart has items, display them
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div class="cart-item-left">
          <img src="${item.productImage}" alt="${item.productName}">
        </div>
        <div class="cart-item-details">
          <h4>${item.productName}</h4>
          <p>Price: ₹${item.price}</p>

          <div class="quantity-control">
            <button onclick="decreaseQuantity(${index})">–</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQuantity(${index})">+</button>
          </div>

          <p class="item-total">Subtotal: ₹${(item.price * item.quantity).toFixed(2)}</p>
          <button class="remove-btn" onclick="removeFromCart(${index})">❌ Remove</button>
          <button class="checkout-btn">Proceed to Checkout</button>

        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
      total += item.price * item.quantity;
    });

    if (cartTotalElement) {
      cartTotalElement.innerText = total.toFixed(2);
    }
  }
}

window.removeFromCart = function(index) {
  if (index >= 0 && index < cart.length) {
    const removedProduct = cart[index];
    cart.splice(index, 1);  
    saveCart();   
    alert(`"${removedProduct.productName}" has been removed from your cart.`);
    renderCart();
  }
};



window.increaseQuantity = function (index) {
  cart[index].quantity += 1;
  saveCart();
  renderCart();
};

window.decreaseQuantity = function (index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1); // remove item if quantity becomes 0
  }
  saveCart();
  renderCart();
};

  updateCartCount();
  renderCart();
});
