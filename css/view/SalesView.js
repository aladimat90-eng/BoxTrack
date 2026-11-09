import View from "./View.js";

class SalesView extends View {
  _parentElement = document.querySelector(".sales");

  _errorMessage = "Sales information is not available.";

  // Generate one sale history row.
  _generateMarkupSale = (sale) => {
    const date = new Date(sale.saleDate).toLocaleString();

    return `
      <article class="sale-row">
        <div>
          <strong>${this._escapeHTML(sale.productName)}</strong>
          <p class="muted">${date}</p>
        </div>
        <div class="sale-row__numbers">
          <span>${sale.quantity} × ₱${sale.unitPrice.toFixed(2)}</span>
          <strong>₱${sale.subtotal.toFixed(2)}</strong>
        </div>
      </article>
    `;
  };

  _generateMarkup = () => {
    const selectedId = this._data.selectedProductId;

    return `
      <div class="sales-grid">
        <div class="panel">
          <div class="panel__heading">
            <div>
              <h3>Record a Sale</h3>
              <p class="muted">Select a product and enter the quantity.</p>
            </div>
          </div>

          <form class="sale-form" novalidate>
            <label>
              Product
              <select id="sale-product">
                <option value="">Select a product</option>
                ${this._data.products.map(product => `
                  <option value="${product.id}" ${Number(selectedId) === product.id ? "selected" : ""}>
                    ${this._escapeHTML(product.name)} — ₱${product.price.toFixed(2)} (${product.stock} available)
                  </option>
                `).join("")}
              </select>
            </label>

            <label>
              Quantity
              <input id="sale-quantity" type="number" min="1" step="1"
                value="${this._data.saleQuantity}">
            </label>

            <div class="sale-total-box">
              <span>Sale total</span>
              <strong class="sale-total">₱${this._data.total.toFixed(2)}</strong>
            </div>

            <p class="sale-stock muted">
              ${this._data.selectedProduct
                ? ${this._data.selectedProduct.stock} unit(s) currently available.
                : "Choose a product to see its available stock."}
            </p>

            <button class="button button--primary button--wide" type="submit"
              ${this._data.products.length === 0 ? "disabled" : ""}>
              Record Sale
            </button>

            <p class="form-message ${this._data.message ? "form-message--visible" : ""}" role="alert">
              ${this._escapeHTML(this._data.message || "")}
            </p>
          </form>
        </div>

        <div class="panel">
          <div class="panel__heading">
            <div>
              <h3>Sales Summary</h3>
              <p class="muted">Recorded transactions</p>
            </div>
            <span class="count-badge">${this._data.sales.length} sales</span>
          </div>

          <div class="sales-history">
            ${this._data.sales.length
              ? this._data.sales.map(sale => this._generateMarkupSale(sale)).join("")
              : `<p class="empty">No sales have been recorded yet.</p>`}
          </div>
        </div>
      </div>
    `;
  };

  _escapeHTML = (value) => {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  };

  addHandlerProductSelect = (handler) => {
    this._parentElement.addEventListener("change", event => {
      if (!event.target.matches("#sale-product")) return;
      handler(event.target.value);
    });
  };

  addHandlerQuantity = (handler) => {
    this._parentElement.addEventListener("input", event => {
      if (!event.target.matches("#sale-quantity")) return;
      handler(event.target.value);
    });
  };

  addHandlerRecordSale = (handler) => {
    this._parentElement.addEventListener("submit", event => {
      if (!event.target.matches(".sale-form")) return;
      event.preventDefault();
      handler();
    });
  };

  // Update the total without rebuilding the form while the user types.
  renderTotal = (total) => {
    const totalElement = this._parentElement.querySelector(".sale-total");
    if (totalElement) {
      totalElement.textContent = ₱${total.toFixed(2)};
    }
  };

  renderStock = (product) => {
    const stockElement = this._parentElement.querySelector(".sale-stock");

    if (!stockElement) return;

    stockElement.textContent = product
      ? ${product.stock} unit(s) currently available.
      : "Choose a product to see its available stock.";
  };
}

export default new SalesView();
