(function (window) {
  const { IconLibrary, ProductCatalog, CartManager } = window;

  /** Renders the filter chips and keeps the active category in sync. */
  class CollectionController {
    constructor({ catalog, elements }) {
      this.catalog = catalog;
      this.elements = elements;
      this.currentCategory = "all";
      this.filteredProducts = this.catalog.getFilteredProducts(this.currentCategory);
      this.onCategoryChange = null;
      this._bindEvents();
      this._renderTabs();
    }

    _bindEvents() {
      if (!this.elements.filterTabs) return;
      this.elements.filterTabs.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-category]");
        if (!button) return;
        this.setCategory(button.dataset.category);
      });
    }

    setCategory(category) {
      this.currentCategory = category;
      this.filteredProducts = this.catalog.getFilteredProducts(category);
      this._renderTabs();
      if (this.onCategoryChange) this.onCategoryChange(this.filteredProducts);
    }

    getFilteredProducts() {
      return this.filteredProducts;
    }

    _renderTabs() {
      if (!this.elements.filterTabs) return;
      this.elements.filterTabs.innerHTML = "";
      this.catalog.categories.forEach((category) => {
        const isActive = this.currentCategory === category;
        const button = document.createElement("button");
        button.type = "button";
        button.className = `filter-chip${isActive ? " active" : ""}`;
        button.dataset.category = category;
        button.setAttribute("aria-pressed", String(isActive));
        button.textContent = this.catalog.formatLabel(category);
        this.elements.filterTabs.appendChild(button);
      });
    }
  }

  /** Renders the catalog grid of product cards. */
  class GridController {
    constructor({ catalog, cart, elements }) {
      this.catalog = catalog;
      this.cart = cart;
      this.elements = elements;
    }

    render(products) {
      if (!this.elements.grid) return;
      this.elements.grid.innerHTML = "";

      products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
          <div class="product-art tone-${product.tone}">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <span class="product-badge">${this.catalog.getCategoryBadge(product.category)}</span>
          </div>
          <div class="product-body">
            <div class="product-heading">
              <h3>${product.name}</h3>
              <div class="product-price">${this.catalog.formatPrice(product.price)}</div>
            </div>
            <p>${product.description}</p>
            <div class="product-meta">
              ${product.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            <button type="button" class="btn btn-add" data-id="${product.id}">Add to cart</button>
          </div>
        `;
        this.elements.grid.appendChild(card);
      });

      this.elements.grid.querySelectorAll(".btn-add").forEach((button) => {
        button.addEventListener("click", () => {
          this.cart.add(button.dataset.id, 1);
          this._flashAdded(button);
        });
      });
    }

    _flashAdded(button) {
      const original = button.textContent;
      button.textContent = "Added ✓";
      button.classList.add("is-added");
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("is-added");
      }, 1200);
    }
  }

  /** Drives the featured showcase panel and its dot navigation. */
  class ShowcaseController {
    constructor({ catalog, cart, elements }) {
      this.catalog = catalog;
      this.cart = cart;
      this.elements = elements;
      this.filteredProducts = [];
      this.currentIndex = 0;
      this._bindEvents();
    }

    _bindEvents() {
      if (this.elements.prevBtn) this.elements.prevBtn.addEventListener("click", () => this.previous());
      if (this.elements.nextBtn) this.elements.nextBtn.addEventListener("click", () => this.next());
      if (this.elements.addBtn) {
        this.elements.addBtn.addEventListener("click", () => {
          const item = this.filteredProducts[this.currentIndex];
          if (item) this.cart.add(item.id, 1);
        });
      }
    }

    setProducts(products) {
      this.filteredProducts = products;
      this.currentIndex = 0;
      this.render();
    }

    render() {
      const { title, description, tags, art, addBtn } = this.elements;
      if (!title || !description || !tags || !art) return;

      if (!this.filteredProducts.length) {
        title.textContent = "No bouquets in this mood";
        description.textContent = "Try a different mood to explore the full collection.";
        tags.innerHTML = "";
        art.innerHTML = "";
        art.className = "showcase-art";
        if (addBtn) addBtn.disabled = true;
        this._renderDots();
        return;
      }

      if (this.currentIndex >= this.filteredProducts.length) this.currentIndex = 0;
      const item = this.filteredProducts[this.currentIndex];

      title.textContent = item.featuredTitle;
      description.textContent = item.featuredDescription;
      tags.innerHTML = item.featuredTags.map((tag) => `<span>${tag}</span>`).join("");
      art.innerHTML = `<img src="${item.image}" alt="${item.name}" loading="eager" />`;
      art.className = `showcase-art tone-${item.tone}`;
      if (addBtn) addBtn.disabled = false;
      this._renderDots();
    }

    _renderDots() {
      if (!this.elements.dots) return;
      if (!this.filteredProducts.length) {
        this.elements.dots.innerHTML = "";
        return;
      }
      this.elements.dots.innerHTML = this.filteredProducts
        .map((_, index) => {
          const isActive = index === this.currentIndex;
          return `<button class="showcase-dot${isActive ? " active" : ""}" data-index="${index}" aria-label="Go to showcase ${index + 1}" aria-current="${isActive ? "true" : "false"}">${IconLibrary.leafDot()}</button>`;
        })
        .join("");

      this.elements.dots.querySelectorAll(".showcase-dot").forEach((dot) => {
        dot.addEventListener("click", () => {
          this.currentIndex = Number(dot.dataset.index);
          this.render();
        });
      });
    }

    next() {
      if (!this.filteredProducts.length) return;
      this.currentIndex = (this.currentIndex + 1) % this.filteredProducts.length;
      this.render();
    }

    previous() {
      if (!this.filteredProducts.length) return;
      this.currentIndex = (this.currentIndex - 1 + this.filteredProducts.length) % this.filteredProducts.length;
      this.render();
    }
  }

  /** Highlights the nav link for the section currently in view. */
  class NavigationController {
    constructor({ links, sections }) {
      this.links = links;
      this.sections = sections;
      this._bindEvents();
    }

    _bindEvents() {
      window.addEventListener("scroll", () => this.updateActiveState(), { passive: true });
      window.addEventListener("resize", () => this.updateActiveState());
      window.addEventListener("hashchange", () => this.updateActiveState());
      window.addEventListener("load", () => this.updateActiveState());
      this.updateActiveState();
    }

    updateActiveState() {
      if (!this.links.length) return;
      const offset = window.scrollY + window.innerHeight * 0.35;
      const currentSection =
        [...this.sections].reverse().find((section) => {
          const element = document.getElementById(section);
          return element && element.offsetTop <= offset;
        }) || this.sections[0];

      this.links.forEach((link) => {
        const isActive = link.dataset.section === currentSection;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }
  }

  /** Keeps the header "Cart" pill showing an accurate item count on every page. */
  class CartBadgeController {
    constructor({ cart, badgeElement }) {
      this.cart = cart;
      this.badgeElement = badgeElement;
      this.cart.onChange(() => this.render());
      this.render();
    }

    render() {
      if (!this.badgeElement) return;
      const count = this.cart.getCount();
      this.badgeElement.textContent = count > 0 ? `Cart (${count})` : "Cart";
    }
  }

  /** Renders the cart line items and order summary on cart.html. */
  class CartPageController {
    constructor({ catalog, cart, elements }) {
      this.catalog = catalog;
      this.cart = cart;
      this.elements = elements;
      this.cart.onChange(() => this.render());
      this.render();
    }

    render() {
      const { list, emptyState, summary, checkoutForm } = this.elements;
      if (!list) return;

      const lineItems = this.cart.getLineItems();
      list.innerHTML = "";

      if (!lineItems.length) {
        if (emptyState) emptyState.hidden = false;
        list.hidden = true;
      } else {
        if (emptyState) emptyState.hidden = true;
        list.hidden = false;

        lineItems.forEach(({ product, qty }) => {
          const item = document.createElement("article");
          item.className = "cart-item";
          item.innerHTML = `
            <div class="cart-item-visual tone-${product.tone}"><img src="${product.image}" alt="${product.name}" loading="lazy" /></div>
            <div class="cart-item-info">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <div class="qty-control" role="group" aria-label="Quantity for ${product.name}">
                <button type="button" class="qty-btn" data-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">–</button>
                <span class="qty-value">${qty}</span>
                <button type="button" class="qty-btn" data-action="increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div class="cart-item-side">
              <div class="cart-item-price">${this.catalog.formatPrice(product.price * qty)}</div>
              <button type="button" class="text-link remove-link" data-id="${product.id}">Remove</button>
            </div>
          `;
          list.appendChild(item);
        });

        list.querySelectorAll(".qty-btn").forEach((button) => {
          button.addEventListener("click", () => {
            const id = button.dataset.id;
            const current = this.cart.items[id] || 0;
            const delta = button.dataset.action === "increase" ? 1 : -1;
            this.cart.setQuantity(id, current + delta);
          });
        });

        list.querySelectorAll(".remove-link").forEach((button) => {
          button.addEventListener("click", () => this.cart.remove(button.dataset.id));
        });
      }

      if (summary) {
        const totals = this.cart.getTotals();
        summary.querySelector('[data-row="subtotal"]').textContent = this.catalog.formatPrice(totals.subtotal);
        summary.querySelector('[data-row="delivery"]').textContent = this.catalog.formatPrice(totals.delivery);
        summary.querySelector('[data-row="giftwrap"]').textContent = this.catalog.formatPrice(totals.giftWrap);
        summary.querySelector('[data-row="total"]').textContent = this.catalog.formatPrice(totals.total);
      }

      if (checkoutForm) {
        const submitBtn = checkoutForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = lineItems.length === 0;
      }
    }
  }

  /** Bootstraps the shop page (index.html). */
  class ShopApp {
    constructor() {
      this.catalog = new ProductCatalog();
      this.cart = new CartManager(this.catalog);

      const elements = {
        filterTabs: document.querySelector(".filter-tabs"),
        grid: document.querySelector("#productGrid"),
        title: document.querySelector("#carouselTitle"),
        description: document.querySelector("#carouselDescription"),
        tags: document.querySelector("#carouselTags"),
        art: document.querySelector("#showcaseArt"),
        dots: document.querySelector("#showcaseDots"),
        prevBtn: document.querySelector("#prevBtn"),
        nextBtn: document.querySelector("#nextBtn"),
        addBtn: document.querySelector("#showcaseAddBtn"),
        navLinks: Array.from(document.querySelectorAll(".nav-link")),
        cartBadge: document.querySelector("#cartBadge"),
        heroBloom: document.querySelector("#heroBloom"),
        heroSprig: document.querySelector("#heroSprig"),
      };

      if (elements.heroBloom) {
        elements.heroBloom.innerHTML = '<img src="assets/images/featured.jpg" alt="Featured Bloom Studio bouquet" loading="eager" />';
      }
      if (elements.heroSprig) {
        elements.heroSprig.innerHTML = '<img src="assets/images/white%20bloom.JPG" alt="" loading="eager" />';
      }
      document.querySelectorAll(".section-divider").forEach((el) => (el.innerHTML = IconLibrary.sprig()));

      this.gridController = new GridController({ catalog: this.catalog, cart: this.cart, elements });
      this.collectionController = new CollectionController({ catalog: this.catalog, elements });
      this.showcaseController = new ShowcaseController({ catalog: this.catalog, cart: this.cart, elements });
      this.navigationController = new NavigationController({
        links: elements.navLinks,
        sections: ["ourstory", "collections", "contact"],
      });
      this.cartBadgeController = new CartBadgeController({ cart: this.cart, badgeElement: elements.cartBadge });

      this.collectionController.onCategoryChange = (products) => {
        this.showcaseController.setProducts(products);
        this.gridController.render(products);
      };

      const initialProducts = this.collectionController.getFilteredProducts();
      this.gridController.render(initialProducts);
      this.showcaseController.setProducts(initialProducts);
    }
  }

  /** Bootstraps the cart & checkout page (cart.html). */
  class CartPageApp {
    constructor() {
      this.catalog = new ProductCatalog();
      this.cart = new CartManager(this.catalog);

      const elements = {
        list: document.querySelector("#cartList"),
        emptyState: document.querySelector("#cartEmpty"),
        summary: document.querySelector("#orderSummary"),
        checkoutForm: document.querySelector(".checkout-form"),
        cartBadge: document.querySelector("#cartBadge"),
      };

      this.cartPageController = new CartPageController({ catalog: this.catalog, cart: this.cart, elements });
      this.cartBadgeController = new CartBadgeController({ cart: this.cart, badgeElement: elements.cartBadge });

      if (elements.checkoutForm) {
        elements.checkoutForm.addEventListener("submit", (event) => {
          event.preventDefault();
          if (this.cart.getCount() === 0) return;
          this.cart.items = {};
          this.cart._save();
          elements.checkoutForm.reset();
          window.alert("Thank you! Your bouquet order has been placed.");
        });
      }
    }
  }

  window.ShopApp = ShopApp;
  window.CartPageApp = CartPageApp;
})(window);
