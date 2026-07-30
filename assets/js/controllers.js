(function (window) {
  class CollectionController {
    constructor({ catalog, elements }) {
      this.catalog = catalog;
      this.elements = elements;
      this.currentCategory = "all";
      this.filteredProducts = this.catalog.getFilteredProducts(this.currentCategory);
      this.onCategoryChange = null;
      this.bindEvents();
      this.render();
    }

    bindEvents() {
      if (!this.elements.filterTabs) {
        return;
      }

      this.elements.filterTabs.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-category]");
        if (!button) {
          return;
        }
        this.setCategory(button.dataset.category);
      });
    }

    setCategory(category) {
      this.currentCategory = category;
      this.filteredProducts = this.catalog.getFilteredProducts(category);
      this.render();

      if (this.onCategoryChange) {
        this.onCategoryChange(this.filteredProducts);
      }
    }

    getFilteredProducts() {
      return this.filteredProducts;
    }

    render() {
      if (!this.elements.filterTabs) {
        return;
      }

      this.elements.filterTabs.innerHTML = "";

      this.catalog.categories.forEach((category) => {
        const button = document.createElement("button");
        const isActive = this.currentCategory === category;
        button.type = "button";
        button.className = `filter-chip${isActive ? " active" : ""}`;
        button.dataset.category = category;
        button.setAttribute("aria-pressed", String(isActive));
        button.textContent = this.catalog.formatLabel(category);
        this.elements.filterTabs.appendChild(button);
      });
    }
  }

  class ShowcaseController {
    constructor({ elements, catalog }) {
      this.elements = elements;
      this.catalog = catalog;
      this.filteredProducts = [];
      this.currentIndex = 0;
      this.bindEvents();
    }

    bindEvents() {
      if (!this.elements.prevBtn || !this.elements.nextBtn) {
        return;
      }

      this.elements.prevBtn.addEventListener("click", () => this.previous());
      this.elements.nextBtn.addEventListener("click", () => this.next());
    }

    setProducts(products) {
      this.filteredProducts = products;
      this.currentIndex = 0;
      this.render();
    }

    render() {
      if (!this.elements.title || !this.elements.description || !this.elements.tags || !this.elements.art) {
        return;
      }

      if (!this.filteredProducts.length) {
        this.elements.title.textContent = "No bouquets available";
        this.elements.description.textContent = "Try a different mood to explore the full collection.";
        this.elements.tags.innerHTML = "";
        this.elements.art.innerHTML = "🌿";
        this.elements.art.style.background = "linear-gradient(135deg, #dcefdc, #f3fbf2)";
        this.renderDots();
        return;
      }

      if (this.currentIndex >= this.filteredProducts.length) {
        this.currentIndex = 0;
      }

      const item = this.filteredProducts[this.currentIndex];
      this.elements.title.textContent = item.featuredTitle;
      this.elements.description.textContent = item.featuredDescription;
      this.elements.tags.innerHTML = item.featuredTags.map((tag) => `<span>${tag}</span>`).join("");
      this.elements.art.innerHTML = `<img src="${item.image}" alt="${item.name}" />`;
      this.elements.art.style.background = item.image ? "none" : item.accent;
      this.renderDots();
    }

    renderDots() {
      if (!this.elements.dots) {
        return;
      }

      if (!this.filteredProducts.length) {
        this.elements.dots.innerHTML = "";
        return;
      }

      this.elements.dots.innerHTML = this.filteredProducts
        .map((_, index) => {
          const isActive = index === this.currentIndex;
          return `<button class="showcase-dot${isActive ? " active" : ""}" data-index="${index}" aria-label="Go to showcase ${index + 1}" aria-current="${isActive ? "true" : "false"}"></button>`;
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
      if (!this.filteredProducts.length) {
        return;
      }
      this.currentIndex = (this.currentIndex + 1) % this.filteredProducts.length;
      this.render();
    }

    previous() {
      if (!this.filteredProducts.length) {
        return;
      }
      this.currentIndex = (this.currentIndex - 1 + this.filteredProducts.length) % this.filteredProducts.length;
      this.render();
    }
  }

  class NavigationController {
    constructor({ links, sections }) {
      this.links = links;
      this.sections = sections;
      this.bindEvents();
    }

    bindEvents() {
      window.addEventListener("scroll", () => this.updateActiveState(), { passive: true });
      window.addEventListener("resize", () => this.updateActiveState());
      window.addEventListener("hashchange", () => this.updateActiveState());
      window.addEventListener("load", () => this.updateActiveState());
      this.updateActiveState();
    }

    updateActiveState() {
      if (!this.links.length) {
        return;
      }

      const offset = window.scrollY + window.innerHeight * 0.35;
      const currentSection = [...this.sections].reverse().find((section) => {
        const element = document.getElementById(section);
        return element && element.offsetTop <= offset;
      }) || this.sections[0];

      this.links.forEach((link) => {
        const isActive = link.dataset.section === currentSection;
        link.classList.toggle("active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }
  }

  class BloomStudioApp {
    constructor() {
      this.catalog = new ProductCatalog();
      this.elements = {
        filterTabs: document.querySelector(".filter-tabs"),
        grid: document.querySelector("#productGrid"),
        title: document.querySelector("#carouselTitle"),
        description: document.querySelector("#carouselDescription"),
        tags: document.querySelector("#carouselTags"),
        art: document.querySelector("#showcaseArt"),
        dots: document.querySelector("#showcaseDots"),
        prevBtn: document.querySelector("#prevBtn"),
        nextBtn: document.querySelector("#nextBtn"),
        navLinks: Array.from(document.querySelectorAll(".nav-link")),
      };

      this.collectionController = new CollectionController({
        catalog: this.catalog,
        elements: this.elements,
      });

      this.showcaseController = new ShowcaseController({
        catalog: this.catalog,
        elements: this.elements,
      });

      this.navigationController = new NavigationController({
        links: this.elements.navLinks,
        sections: ["ourstory", "collections", "contact"],
      });

      this.collectionController.onCategoryChange = (products) => {
        this.showcaseController.setProducts(products);
        this.renderProducts(products);
      };

      this.renderProducts(this.collectionController.getFilteredProducts());
      this.showcaseController.setProducts(this.collectionController.getFilteredProducts());
    }

    renderProducts(products) {
      if (!this.elements.grid) {
        return;
      }

      this.elements.grid.innerHTML = "";

      products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
          <div class="product-art">
            <img src="${product.image}" alt="${product.name}" />
            <span class="product-badge">${this.catalog.getCategoryBadge(product.category)}</span>
          </div>
          <div class="product-body">
            <div class="product-heading">
              <h3>${product.name}</h3>
              <div class="product-price">${product.price}</div>
            </div>
            <p>${product.description}</p>
            <div class="product-meta">
              ${product.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
          </div>
        `;
        this.elements.grid.appendChild(card);
      });
    }
  }

  window.BloomStudioApp = BloomStudioApp;
})(window);
