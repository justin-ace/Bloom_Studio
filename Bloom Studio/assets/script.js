class BloomStudio {
  constructor() {
    this.categories = ["all", "romantic", "modern", "garden"];
    this.products = [
      {
        name: "Rose Romance",
        category: "romantic",
        price: "$84",
        description: "Blush roses with soft eucalyptus for intimate gatherings.",
        emoji: "🌹",
        image: "assets/images/rose.JPG",
        accent: "linear-gradient(135deg, #f3b8c6, #f7d8e0)",
        tags: ["Blush tones", "Velvet wrap"],
        featuredTitle: "A candlelit bouquet with airy romance.",
        featuredDescription: "Tender petals and soft greens bring a graceful glow to your table.",
        featuredTags: ["Limited release", "Eco wrap"],
      },
      {
        name: "Linen Meadow",
        category: "modern",
        price: "$76",
        description: "A sculptural mix of tulips, ranunculus, and sculptural greens.",
        emoji: "🌷",
        image: "assets/images/tulips.JPG",
        accent: "linear-gradient(135deg, #ecd48a, #f7f0bf)",
        tags: ["Editorial look", "Neutral palette"],
        featuredTitle: "Quiet luxury in a bouquet.",
        featuredDescription: "Soft cream tones meet clean lines for a modern statement.",
        featuredTags: ["Design led", "Premium pick"],
      },
      {
        name: "Serene Grove",
        category: "garden",
        price: "$92",
        description: "Fresh greens, white lilies, and meadow herbs for a calming feel.",
        emoji: "🌿",
        image: "assets/images/lilies.JPG",
        accent: "linear-gradient(135deg, #8bcf9f, #bfe7c4)",
        tags: ["Fresh greens", "Indoor calm"],
        featuredTitle: "A lush indoor escape.",
        featuredDescription: "Layered greens and luminous whites turn any room into a serene retreat.",
        featuredTags: ["Botanical", "Gift-ready"],
      },
      {
        name: "Velvet Orchid",
        category: "modern",
        price: "$98",
        description: "Statement orchids with deep plum tones and a polished silhouette.",
        emoji: "🪻",
        image: "assets/images/orchids.JPG",
        accent: "linear-gradient(135deg, #8c4f9b, #c79ad8)",
        tags: ["Bold mood", "Contemporary"],
        featuredTitle: "Bold florals that feel architectural.",
        featuredDescription: "Rich color and elegant structure bring a striking finish to your space.",
        featuredTags: ["Statement", "Luxury finish"],
      },
      {
        name: "Sunlit Petals",
        category: "romantic",
        price: "$88",
        description: "Golden daisies and peach blooms for a warm, joyful arrangement.",
        emoji: "🌼",
        image: "assets/images/daisies.JPG",
        accent: "linear-gradient(135deg, #f6d06f, #fff1b0)",
        tags: ["Sunny glow", "Soft texture"],
        featuredTitle: "Bright, cheerful, and full of energy.",
        featuredDescription: "A joyful mix of sunlit petals designed to welcome the room.",
        featuredTags: ["Seasonal", "Easy gifting"],
      },
      {
        name: "Mint Whisper",
        category: "garden",
        price: "$80",
        description: "Minty greenery and white blooms for a fresh, spa-like look.",
        emoji: "🌱",
        image: "assets/images/white%20bloom.JPG",
        accent: "linear-gradient(135deg, #7cc48e, #d7f3dd)",
        tags: ["Spa feel", "Airy stems"],
        featuredTitle: "A gentle green-inspired classic.",
        featuredDescription: "Cool tones and delicate shapes make this one feel effortlessly calm.",
        featuredTags: ["Fresh edit", "Weekend pick"],
      },
    ];

    this.currentCategory = "all";
    this.currentIndex = 0;
    this.filteredProducts = this.getFilteredProducts();

    this.tabs = document.querySelector(".filter-tabs");
    this.grid = document.querySelector("#productGrid");
    this.title = document.querySelector("#carouselTitle");
    this.description = document.querySelector("#carouselDescription");
    this.tags = document.querySelector("#carouselTags");
    this.art = document.querySelector("#showcaseArt");
    this.prevBtn = document.querySelector("#prevBtn");
    this.nextBtn = document.querySelector("#nextBtn");

    this.bindEvents();
    this.renderTabs();
    this.renderProducts();
    this.renderShowcase();
  }

  bindEvents() {
    this.prevBtn.addEventListener("click", () => this.previous());
    this.nextBtn.addEventListener("click", () => this.next());
  }

  getFilteredProducts() {
    if (this.currentCategory === "all") {
      return this.products;
    }
    return this.products.filter((product) => product.category === this.currentCategory);
  }

  renderTabs() {
    this.tabs.innerHTML = "";

    this.categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = `filter-chip${this.currentCategory === category ? " active" : ""}`;
      button.textContent = this.formatLabel(category);
      button.addEventListener("click", () => this.setCategory(category));
      this.tabs.appendChild(button);
    });
  }

  formatLabel(category) {
    return category === "all" ? "All flowers" : category.charAt(0).toUpperCase() + category.slice(1);
  }

  setCategory(category) {
    this.currentCategory = category;
    this.currentIndex = 0;
    this.filteredProducts = this.getFilteredProducts();
    this.renderTabs();
    this.renderProducts();
    this.renderShowcase();
  }

  renderProducts() {
    this.grid.innerHTML = "";

    this.filteredProducts.forEach((product) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-art">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-meta">
          ${product.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <div class="product-price">${product.price}</div>
      `;
      this.grid.appendChild(card);
    });
  }

  renderShowcase() {
    if (!this.filteredProducts.length) {
      this.title.textContent = "No bouquets available";
      this.description.textContent = "Try a different mood to explore the full collection.";
      this.tags.innerHTML = "";
      this.art.innerHTML = "🌿";
      this.art.style.background = "linear-gradient(135deg, #dcefdc, #f3fbf2)";
      return;
    }

    if (this.currentIndex >= this.filteredProducts.length) {
      this.currentIndex = 0;
    }

    const item = this.filteredProducts[this.currentIndex];

    this.title.textContent = item.featuredTitle;
    this.description.textContent = item.featuredDescription;
    this.tags.innerHTML = item.featuredTags.map((tag) => `<span>${tag}</span>`).join("");
    this.art.innerHTML = `<img src="${item.image}" alt="${item.name}" />`;
    this.art.style.background = item.image ? "none" : item.accent;
  }

  next() {
    if (!this.filteredProducts.length) {
      return;
    }
    this.currentIndex = (this.currentIndex + 1) % this.filteredProducts.length;
    this.renderShowcase();
  }

  previous() {
    if (!this.filteredProducts.length) {
      return;
    }
    this.currentIndex = (this.currentIndex - 1 + this.filteredProducts.length) % this.filteredProducts.length;
    this.renderShowcase();
  }
}

new BloomStudio();
