
import View from "./View.js";

class DashboardView extends View {
  _parentElement = document.querySelector(".dashboard");

  _errorMessage = "Dashboard information is not available.";

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

  // Generate a low-stock product item.
  _generateLowStockCard = (product) => {
    return `
      <div class="low-stock-item">
        <div>
          <strong>${this._escapeHTML(product.name)}</strong>
          <p class="muted">${this._escapeHTML(product.category)}</p>
        </div>

        <span class="low-stock-count">
          ${product.stock} left
        </span>
      </div>
    `;
  };

  // Generate a recent sale item.
  _generateRecentSale = (sale) => {
    return `
      <div class="recent-sale-item">
        <div>
          <strong>${this._escapeHTML(sale.productName)}</strong>
          <p class="muted">${sale.quantity} unit(s)</p>
        </div>

        <strong>₱${Number(sale.subtotal).toFixed(2)}</strong>
      </div>
    `;
  };

  // Generate the 7-day sales graph.
  _generateSalesChart = (salesChartData) => {
    if (!salesChartData || !salesChartData.length) {
      return `<p class="empty">No sales data available.</p>`;
    }

    const highestSale = Math.max(
      ...salesChartData.map(day => day.total),
      1
    );

    return `
      <div class="sales-chart">
        ${salesChartData.map(day => {
          const barHeight = day.total > 0
            ? Math.max((day.total / highestSale) * 100, 4)
            : 0;

          return `
            <div class="sales-chart__day">
              <div class="sales-chart__amount">
                ${day.total > 0
                  ? `₱${Number(day.total).toLocaleString("en-PH", {
                      maximumFractionDigits: 0
                    })}`
                  : ""
                }
              </div>

              <div class="sales-chart__bar-area">
                <div
                  class="sales-chart__bar"
                  style="height: ${barHeight}%"
                  title="₱${Number(day.total).toFixed(2)}"
                ></div>
              </div>

              <span class="sales-chart__label">
                ${this._escapeHTML(day.label)}
              </span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  };

  // Generate the dashboard.
  _generateMarkup = () => {
    const {
      totalProducts,
      totalStock,
      totalSales,
      lowStockProducts,
      recentSales,
      salesChartData
    } = this._data;

    const weeklySales = salesChartData.reduce(
      (total, day) => total + day.total,
      0
    );

    return `
      <div class="dashboard-heading">
        <h2>Dashboard</h2>
        <p class="muted">
          Overview of your inventory and sales.
        </p>
      </div>

      <!-- Statistics -->
      <div class="stats-grid">

        <article class="stat-card">
          <span class="stat-card__label">Total Products</span>
          <strong>${totalProducts}</strong>
        </article>

        <article class="stat-card">
          <span class="stat-card__label">Remaining Stock</span>
          <strong>${totalStock}</strong>
        </article>

        <article class="stat-card">
          <span class="stat-card__label">Total Revenue</span>
          <strong>₱${Number(totalSales).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</strong>
        </article>

        <article class="stat-card">
          <span class="stat-card__label">Low-stock Products</span>
          <strong>${lowStockProducts.length}</strong>
        </article>

      </div>

      <!-- Sales Graph -->
      <section class="panel sales-chart-panel">

        <div class="panel__heading">
          <div>
            <h3>Sales Overview</h3>
            <p class="muted">Daily revenue for the last 7 days.</p>
          </div>

          <div class="sales-chart-total">
            <small>7-day revenue</small>
            <strong>
              ₱${weeklySales.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </strong>
          </div>
        </div>

        ${this._generateSalesChart(salesChartData)}

      </section>

      <!-- Low Stock and Recent Sales -->
      <div class="dashboard-grid">

        <section class="panel">
          <div class="panel__heading">
            <div>
              <h3>Low-stock Alerts</h3>
              <p class="muted">Products that need restocking.</p>
            </div>

            <span class="count-badge">
              ${lowStockProducts.length}
            </span>
          </div>

          <div class="low-stock-list">
            ${lowStockProducts.length
              ? lowStockProducts
                  .map(product => this._generateLowStockCard(product))
                  .join("")
              : `<p class="empty">No products need restocking.</p>`
            }
          </div>
        </section>

        <section class="panel">
          <div class="panel__heading">
            <div>
              <h3>Recent Sales</h3>
              <p class="muted">Latest recorded transactions.</p>
            </div>
          </div>

          <div class="recent-sales-list">
            ${recentSales.length
              ? recentSales
                  .map(sale => this._generateRecentSale(sale))
                  .join("")
              : `<p class="empty">No transactions yet.</p>`
            }
          </div>
        </section>

      </div>
    `;
  };
}

export default new DashboardView();
