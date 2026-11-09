
import View from "./View.js";

class ProductView extends View {
  _parentElement = document.querySelector(".products");

  _errorMessage = "No products available.";

  _selectedImage = "";

  // Product categories.
  _categories = [
    "Mouse",
    "Keyboard",
    "Monitor",
    "Headset",
    "Speakers",
    "Webcam",
    "Microphone",
    "USB Flash Drive",
    "External Storage",
    "Laptop",
    "Desktop Computer",
    "Computer Components",
    "Networking Device",
    "Cable",
    "Adapter",
    "Other"
  ];

  // Escape special HTML characters.
  _escapeHTML = (value = "") => {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  };

  // Category options.
  _generateCategoryOptions = (selectedCategory = "") => {
    return this._categories.map(category => `
      <option
        value="${category}"
        ${category === selectedCategory ? "selected" : ""}
      >
        ${category}
      </option>
    `).join("");
  };

  // Product card.
  _generateMarkupCard = (product) => {
    const {
      id,
      name,
      category,
      price,
      stock,
      minimumStock,
      image
    } = product;

    const stockStatus = stock === 0
      ? `<span class="status status--out">Out of Stock</span>`
      : stock <= minimumStock
        ? `<span class="status status--low">Low Stock</span>`
        : `<span class="status status--good">In Stock</span>`;

    const productImage = image
      ? `
        <img
          src="${this._escapeHTML(image)}"
          alt="${this._escapeHTML(name)}"
          class="product-card__image"
        >
      `
      : `
        <div class="product-card__placeholder">
          📦
        </div>
      `;

    return `
      <article
        class="product-card"
        data-name="${this._escapeHTML(name.toLowerCase())}"
        data-category="${this._escapeHTML(category)}"
      >
        <div class="product-card__image-container">
          ${productImage}
        </div>

        <div class="product-card__details">
          <div class="product-card__title-row">
            <div>
              <h3>${this._escapeHTML(name)}</h3>
              <p class="muted">${this._escapeHTML(category)}</p>
            </div>

            ${stockStatus}
          </div>

          <div class="product-card__numbers">
            <span>
              <small>Price</small>
              <strong>₱${Number(price).toFixed(2)}</strong>
            </span>

            <span>
              <small>Available stock</small>
              <strong>${stock}</strong>
            </span>

            <span>
              <small>Low-stock level</small>
              <strong>${minimumStock}</strong>
            </span>
          </div>

          <div class="product-card__actions">
            <button
              class="button button--light edit-product"
              type="button"
              data-id="${id}"
            >
              Edit
            </button>

            <button
              class="button button--danger delete-product"
              type="button"
              data-id="${id}"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    `;
  };

  //Product Inventory page.
  _generateMarkup = () => {
    const {
      products,
      editingProduct,
      message,
      modalOpen,
      searchTerm = "",
      selectedCategory = ""
    } = this._data;

    const isEditing = Boolean(editingProduct);

    // Preserve the image when editing a product.
    this._selectedImage = editingProduct?.image || "";

    const imagePreview = this._selectedImage
      ? `
        <img
          src="${this._escapeHTML(this._selectedImage)}"
          alt="Product preview"
          id="image-preview"
        >
      `
      : `
        <div class="image-placeholder" id="image-placeholder">
          📷
          <span>No image selected</span>
        </div>
      `;

    return `
      <!-- Inventory Header -->
      <div class="inventory-toolbar">
        <div>
          <h2>Product Inventory</h2>
          <p class="muted">
            Manage your products and available stock.
          </p>
        </div>

        <button
          class="button button--primary open-add-modal"
          type="button"
        >
          + Add Product
        </button>
      </div>

      <!-- Category and Search -->
      <div class="inventory-filters">

        <div class="inventory-category">
          <label for="category-filter">Category</label>

          <select id="category-filter">
            <option value="">All Categories</option>
            ${this._categories.map(category => `
              <option
                value="${category}"
                ${category === selectedCategory ? "selected" : ""}
              >
                ${category}
              </option>
            `).join("")}
          </select>
        </div>

        <div class="inventory-search">
          <label for="product-search">Search Products</label>

          <input
            type="search"
            id="product-search"
            placeholder="Search product name..."
            value="${this._escapeHTML(searchTerm)}"
          >
        </div>

      </div>

      <!-- Product Count -->
      <div class="section-subheading">
        <div>
          <h3>Products</h3>
          <p class="muted">
            ${products.length} product(s) listed
          </p>
        </div>
      </div>

      <!-- Product Cards -->
      <div class="product-list">
        ${products.length
          ? products.map(product =>
              this._generateMarkupCard(product)
            ).join("")
          : `<p class="empty">No products available.</p>`
        }
      </div>

      <!-- Add / Edit Product Modal -->
      <div class="modal ${modalOpen ? "modal--open" : ""}">

        <div class="modal__backdrop" data-close-modal></div>

        <div
          class="modal__content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >

          <div class="modal__header">
            <div>
              <h2 id="product-modal-title">
                ${isEditing ? "Edit Product" : "Add Product"}
              </h2>

              <p class="muted">
                Enter the product details below.
              </p>
            </div>

            <button
              class="modal__close"
              type="button"
              data-close-modal
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          <form class="product-form" novalidate>

            <input
              type="hidden"
              id="product-id"
              value="${isEditing ? this._escapeHTML(editingProduct.id) : ""}"
            >

            <div class="form-group">
              <label for="product-name">Product Name</label>

              <input
                id="product-name"
                type="text"
                placeholder="e.g. Wireless Mouse"
                value="${isEditing ? this._escapeHTML(editingProduct.name) : ""}"
                required  
              >
            </div>

            <div class="form-group">
              <label for="product-category">Category</label>

              <select id="product-category" required>
                <option value="">Select category</option>

                ${this._generateCategoryOptions(
                  editingProduct?.category || ""
                )}
              </select>
            </div>

            <!-- Product Image -->
            <div class="form-group">
              <label for="product-image">Product Image</label>

              <input
                id="product-image"
                type="file"
                accept="image/*"
              >

              <div
                class="image-preview"
                id="image-preview-container"
              >
                ${imagePreview}
              </div>

              <small>Maximum image size: 2 MB.</small>
            </div>

            <div class="form-grid form-grid--two">

              <div class="form-group">
                <label for="product-price">Selling Price (₱)</label>

                <input
                  id="product-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value="${isEditing ? editingProduct.price : ""}"
                  required
                >
              </div>

              <div class="form-group">
                <label for="product-stock">Stock Quantity</label>

                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value="${isEditing ? editingProduct.stock : ""}"
                  required
                >
              </div>

            </div>

            <div class="form-group">
              <label for="minimum-stock">Minimum Stock Level</label>

              <input
                id="minimum-stock"
                type="number"
                min="0"
                step="1"
                placeholder="5"
                value="${isEditing ? editingProduct.minimumStock : ""}"
                required
              >
            </div>

            <p class="form-message" role="alert">
              ${this._escapeHTML(message || "")}
            </p>

            <div class="modal__actions">

              <button
                class="button button--light"
                type="button"
                data-close-modal
              >
                Cancel
              </button>

              <button
                class="button button--primary"
                type="submit"
              >
                ${isEditing ? "Save Changes" : "Add Product"}
              </button>

            </div>

          </form>
        </div>
      </div>
    `;
  };

  // Open the Add Product modal.
  addHandlerOpenModal = (handler) => {
    this._parentElement.addEventListener("click", event => {
      if (!event.target.closest(".open-add-modal")) return;

      handler();
    });
  };

  // Handle adding and updating products.
  addHandlerSubmit = (handler) => {
    this._parentElement.addEventListener("submit", event => {
      if (!event.target.matches(".product-form")) return;

      event.preventDefault();

      const form = event.target;

      const productData = {
        name: form.querySelector("#product-name").value.trim(),
        category: form.querySelector("#product-category").value,
        price: Number(form.querySelector("#product-price").value),
        stock: Number(form.querySelector("#product-stock").value),
        minimumStock: Number(
          form.querySelector("#minimum-stock").value
        ),
        image: this._selectedImage
      };

      handler(
        form.querySelector("#product-id").value,
        productData
      );
    });
  };

  // Preview the selected product image.
  addHandlerImageChange = () => {
    this._parentElement.addEventListener("change", event => {
      if (!event.target.matches("#product-image")) return;

      const file = event.target.files[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image.");
        event.target.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Image must not exceed 2 MB.");
        event.target.value = "";
        return;
      }

      const reader = new FileReader();

      reader.addEventListener("load", () => {
        this._selectedImage = reader.result;

        const previewContainer = this._parentElement.querySelector(
          "#image-preview-container"
        );

        if (previewContainer) {
          previewContainer.innerHTML = `
            <img
              src="${this._escapeHTML(this._selectedImage)}"
              alt="Product preview"
              id="image-preview"
            >
          `;
        }
      });

      reader.readAsDataURL(file);
    });
  };

  // Search products by name.
  addHandlerSearch = () => {
    this._parentElement.addEventListener("input", event => {
      if (!event.target.matches("#product-search")) return;

      this._filterProducts();
    });
  };

  // Filter products by category.
  addHandlerCategoryFilter = () => {
    this._parentElement.addEventListener("change", event => {
      if (!event.target.matches("#category-filter")) return;

      this._filterProducts();
    });
  };

  // Apply search and category filters to the product cards.
  _filterProducts = () => {
    const searchInput = this._parentElement.querySelector(
      "#product-search"
    );

    const categoryInput = this._parentElement.querySelector(
      "#category-filter"
    );

    if (!searchInput || !categoryInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryInput.value;

    const cards = this._parentElement.querySelectorAll(".product-card");

    let visibleCount = 0;

    cards.forEach(card => {
      const name = card.dataset.name;
      const category = card.dataset.category;

      const matchesSearch = name.includes(searchTerm);

      const matchesCategory =
        !selectedCategory || category === selectedCategory;

      const isVisible = matchesSearch && matchesCategory;

      card.style.display = isVisible ? "" : "none";

      if (isVisible) visibleCount++;
    });

    let emptyMessage = this._parentElement.querySelector(
      ".filter-empty"
    );

    if (visibleCount === 0) {
      if (!emptyMessage) {
        emptyMessage = document.createElement("p");
        emptyMessage.className = "empty filter-empty";
        emptyMessage.textContent = "No products match your search.";
        this._parentElement.querySelector(".product-list")
          ?.append(emptyMessage);
      }
    } else {
      emptyMessage?.remove();
    }
  };

  // Edit an existing product.
  addHandlerEditProduct = (handler) => {
    this._parentElement.addEventListener("click", event => {
      const button = event.target.closest(".edit-product");

      if (!button) return;

      handler(Number(button.dataset.id));
    });
  };

  // Delete a product.
  addHandlerDeleteProduct = (handler) => {
    this._parentElement.addEventListener("click", event => {
      const button = event.target.closest(".delete-product");

      if (!button) return;

      if (confirm("Are you sure you want to delete this product?")) {
        handler(Number(button.dataset.id));
      }
    });
  };

  // Close the modal.
  addHandlerCloseModal = (handler) => {
    this._parentElement.addEventListener("click", event => {
      if (event.target.closest("[data-close-modal]")) {
        handler();
      }
    });

    document.addEventListener("keydown", event => {
      if (
        event.key === "Escape" &&
        this._parentElement.querySelector(".modal--open")
      ) {
        handler();
      }
    });
  };
}

export default new ProductView();
