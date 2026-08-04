/**
 * ProductCatalog
 * --------------
 * Owns the bouquet catalog and category logic. No DOM access here —
 * rendering is delegated to the controllers.
 */
(function (window) {
  class ProductCatalog {
    constructor() {
      this.categories = ["all", "romantic", "modern", "garden"];
      this.products = [
        {
          id: "rose-romance",
          name: "Rose Romance",
          category: "romantic",
          price: 500,
          description: "Blush roses with soft eucalyptus for intimate gatherings.",
          image: "assets/images/rose.JPG",
          icon: { petals: 8, shape: "round" },
          tone: "gold",
          tags: ["Blush tones", "Velvet wrap"],
          featuredTitle: "A candlelit bouquet with airy romance.",
          featuredDescription: "Tender petals and soft greens bring a graceful glow to your table.",
          featuredTags: ["Limited release", "Eco wrap"],
        },
        {
          id: "linen-meadow",
          name: "Linen Meadow",
          category: "modern",
          price: 650,
          description: "A sculptural mix of tulips, ranunculus, and structural greens.",
          image: "assets/images/tulips.JPG",
          icon: { petals: 3, shape: "pointed" },
          tone: "pine",
          tags: ["Editorial look", "Neutral palette"],
          featuredTitle: "Quiet luxury in a bouquet.",
          featuredDescription: "Soft cream tones meet clean lines for a modern statement.",
          featuredTags: ["Design led", "Premium pick"],
        },
        {
          id: "serene-grove",
          name: "Serene Grove",
          category: "garden",
          price: 700,
          description: "Fresh greens, white lilies, and meadow herbs for a calming feel.",
          image: "assets/images/lilies.JPG",
          icon: { petals: 6, shape: "slim" },
          tone: "moss",
          tags: ["Fresh greens", "Indoor calm"],
          featuredTitle: "A lush indoor escape.",
          featuredDescription: "Layered greens and luminous whites turn any room into a serene retreat.",
          featuredTags: ["Botanical", "Gift-ready"],
        },
        {
          id: "velvet-orchid",
          name: "Velvet Orchid",
          category: "modern",
          price: 650,
          description: "Statement orchids with a deep, polished silhouette.",
          image: "assets/images/orchids.JPG",
          icon: { petals: 5, shape: "pointed" },
          tone: "forest",
          tags: ["Bold mood", "Contemporary"],
          featuredTitle: "Bold florals that feel architectural.",
          featuredDescription: "Rich structure and elegant lines bring a striking finish to your space.",
          featuredTags: ["Statement", "Luxury finish"],
        },
        {
          id: "sunlit-petals",
          name: "Sunlit Petals",
          category: "romantic",
          price: 500,
          description: "Golden daisies and peach blooms for a warm, joyful arrangement.",
          image: "assets/images/daisies.JPG",
          icon: { petals: 10, shape: "round" },
          tone: "gold",
          tags: ["Sunny glow", "Soft texture"],
          featuredTitle: "Bright, cheerful, and full of energy.",
          featuredDescription: "A joyful mix of sunlit petals designed to welcome the room.",
          featuredTags: ["Seasonal", "Easy gifting"],
        },
        {
          id: "mint-whisper",
          name: "Mint Whisper",
          category: "garden",
          price: 700,
          description: "Minty greenery and white blooms for a fresh, spa-like look.",
          image: "assets/images/white%20bloom.JPG",
          icon: { petals: 4, shape: "slim" },
          tone: "pine",
          tags: ["Spa feel", "Airy stems"],
          featuredTitle: "A gentle green-inspired classic.",
          featuredDescription: "Cool tones and delicate shapes make this one feel effortlessly calm.",
          featuredTags: ["Fresh edit", "Weekend pick"],
        },
      ];
    }

    getFilteredProducts(category = "all") {
      if (category === "all") return this.products;
      return this.products.filter((product) => product.category === category);
    }

    getById(id) {
      return this.products.find((product) => product.id === id) || null;
    }

    getCategoryBadge(category) {
      switch (category) {
        case "romantic":
          return "Romantic edit";
        case "modern":
          return "Modern edit";
        case "garden":
          return "Garden edit";
        default:
          return "Signature edit";
      }
    }

    formatLabel(category) {
      return category === "all" ? "All flowers" : category.charAt(0).toUpperCase() + category.slice(1);
    }

    formatPrice(amount) {
      return `\u20b1${amount.toLocaleString("en-PH")}`;
    }
  }

  window.ProductCatalog = ProductCatalog;
})(window);
