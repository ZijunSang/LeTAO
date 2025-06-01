let cart = {
    items: [
      { id: 1, name: "Fromage Double", price: 43.99, quantity: 1, image: "../../src/logo/cheesecake.png" },
      { id: 2, name: "Chocolate Double", price: 43.99, quantity: 2, image: "../../src/logo/red.png" },
      { id: 3, name: "Milk Roll", price: 43.99, quantity: 1, image: "../../src/logo/jersey_mild_roll.png" }
    ],
    total: 0
  };
  
  function initCart() {
    const savedCart = localStorage.getItem('letaoCart');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    
    renderCart();
    setupEventListeners();
    calculateTotal();
  }
  
  function renderCart() {
    const container = document.querySelector('.cart-items-container');
    container.innerHTML = '';
    
    const statusText = document.querySelector('.cart-status-text');
    statusText.textContent = `${cart.items.length} items in Shopping Cart`;
    
    cart.items.forEach(item => {
      const itemInfoCell = document.createElement('div');
      itemInfoCell.className = 'flex-row items-center cart-item-info-cell';
      itemInfoCell.innerHTML = `
        <img class="product-thumbnail" src="${item.image}" />
        <div class="flex-col items-start product-details">
          <span class="product-name">${item.name}</span>
          <span class="product-unit-price">$${item.price.toFixed(2)}</span>
        </div>
      `;
      
      const itemActionsCell = document.createElement('div');
      itemActionsCell.className = 'flex-row justify-between items-center cart-item-actions-cell';
      itemActionsCell.innerHTML = `
        <div class="flex-row items-center quantity-selector-box quantity-control" data-item-id="${item.id}">
          <span class="quantity-btn minus-btn">-</span>
          <span class="quantity-value">${item.quantity}</span>
          <span class="quantity-btn plus-btn">+</span>
        </div>
        <span class="item-total-price">$${(item.price * item.quantity).toFixed(2)}</span>
      `;
      
      container.appendChild(itemInfoCell);
      container.appendChild(itemActionsCell);
    });
  }
  
  function setupEventListeners() {
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('plus-btn')) {
        const itemId = parseInt(e.target.closest('.quantity-control').getAttribute('data-item-id'));
        updateQuantity(itemId, 1);
      } else if (e.target.classList.contains('minus-btn')) {
        const itemId = parseInt(e.target.closest('.quantity-control').getAttribute('data-item-id'));
        updateQuantity(itemId, -1);
      }
    });
  }
  
  function updateQuantity(itemId, change) {
    const item = cart.items.find(i => i.id === itemId);
    if (item) {
      item.quantity += change;
      
      if (item.quantity <= 0) {
        cart.items = cart.items.filter(i => i.id !== itemId);
      }
      
      localStorage.setItem('letaoCart', JSON.stringify(cart));
      
      renderCart();
      calculateTotal();
    }
  }
  
  function calculateTotal() {
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const totalElements = document.querySelectorAll('.final-total-amount');
    totalElements.forEach(el => {
      el.textContent = `Total $${cart.total.toFixed(2)}`;
    });
  }
  
  function addToCart(product) {
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity || 1,
        image: product.image
      });
    }
    
    localStorage.setItem('letaoCart', JSON.stringify(cart));
    
    if (window.location.href.includes('Shopping_Cart_Page')) {
      renderCart();
      calculateTotal();
    }
  }
  
  document.addEventListener('DOMContentLoaded', initCart);