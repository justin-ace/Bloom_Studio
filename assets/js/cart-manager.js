/**
 * CartManager
 * -----------
 * Single source of truth for cart state. Persists to localStorage so the
 * cart survives navigation between index.html and cart.html, and notifies
 * subscribers (e.g. the header badge) whenever it changes.
 */
(function (window) {
  const STORAGE_KEY = "bloomstudio.cart";
  const DELIVERY_FEE = 120;
  const GIFT_WRAP_FEE = 80;

  class CartManager {
    constructor(catalog) {
      this.catalog = catalog;
      this.listeners = [];
      this.items = this._load();
    }

    _load() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (err) {
        return {};
      }
    }

    _save() {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      } catch (err) {
        /* storage unavailable — cart still works for this page load */
      }
      this._notify();
    }

    onChange(callback) {
      this.listeners.push(callback);
    }

    _notify() {
      this.listeners.forEach((callback) => callback(this));
    }

    add(productId, qty = 1) {
      this.items[productId] = (this.items[productId] || 0) + qty;
      this._save();
    }

    setQuantity(productId, qty) {
      if (qty <= 0) {
        delete this.items[productId];
      } else {
        this.items[productId] = qty;
      }
      this._save();
    }

    remove(productId) {
      delete this.items[productId];
      this._save();
    }

    getLineItems() {
      return Object.entries(this.items)
        .map(([id, qty]) => {
          const product = this.catalog.getById(id);
          return product ? { product, qty } : null;
        })
        .filter(Boolean);
    }

    getCount() {
      return Object.values(this.items).reduce((sum, qty) => sum + qty, 0);
    }

    getSubtotal() {
      return this.getLineItems().reduce((sum, { product, qty }) => sum + product.price * qty, 0);
    }

    getTotals() {
      const subtotal = this.getSubtotal();
      const hasItems = this.getCount() > 0;
      const delivery = hasItems ? DELIVERY_FEE : 0;
      const giftWrap = hasItems ? GIFT_WRAP_FEE : 0;
      return {
        subtotal,
        delivery,
        giftWrap,
        total: subtotal + delivery + giftWrap,
      };
    }
  }

  window.CartManager = CartManager;
})(window);
