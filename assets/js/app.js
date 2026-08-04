(function () {
  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page === "cart" && window.CartPageApp) {
      new window.CartPageApp();
    } else if (window.ShopApp) {
      new window.ShopApp();
    }
  });
})();
