  // The controller connects the model and the views.
  // It handles events, asks the model to update data, and refreshes the views.

  import * as model from "./model.js";
  import dashboardView from "./css/view/DashboardView.js";
  import productView from "./css/view/ProductView.js";
  import salesView from "./css/view/SalesView.js";

  // Prepare the dashboard data and display it.
 const renderDashboard = () => {
  dashboardView.render({
    totalProducts: model.getTotalProducts(),
    totalStock: model.getTotalStock(),
    totalSales: model.getTotalSales(),
    lowStockProducts: model.getLowStockProducts(),
    recentSales: model.getRecentSales(),
    salesChartData: model.getSalesChartData()
  });
};

const renderProducts = (
  message = "",
  editingProduct = null,
  modalOpen = false
) => {
  productView.render({
    products: model.state.products,
    message,
    editingProduct,
    modalOpen
  });
};

  // Display the sales form and transaction history.
  const renderSales = (message = "") => {
    const selectedProduct = model.getProduct(model.state.selectedProductId);

    salesView.render({
      products: model.state.products,
      sales: model.state.sales,
      selectedProductId: model.state.selectedProductId,
      selectedProduct,
      saleQuantity: model.state.saleQuantity,
      total: model.calculateSaleTotal(),
      message
    });
  };

  // Refresh all views after a data change.
  const renderAll = () => {
    renderDashboard();
    renderProducts();
    renderSales();
  };

  // Open the modal when the Add Product button is clicked.
const controlOpenAddModal = () => {
  renderProducts("", null, true);
};

// Close the product modal.
const controlCloseModal = () => {
  renderProducts();
};

// Add a new product or update an existing one.
const controlProductSubmit = (id, productData) => {
  try {
    if (id) {
      model.updateProduct(id, productData);
    } else {
      model.addProduct(productData);
    }

    renderAll();
  } catch (error) {
    const editingProduct = id ? model.getProduct(id) : null;
    renderProducts(error.message, editingProduct, true);
  }
};

// Open the modal with the selected product's information.
const controlEditProduct = (id) => {
  const product = model.getProduct(id);

  if (product) {
    renderProducts("", product, true);
  }
};

// Delete a product.
const controlDeleteProduct = (id) => {
  const product = model.getProduct(id);

  if (!product) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${product.name}"?`
  );

  if (!confirmed) return;

  try {
    model.deleteProduct(id);
    renderAll();
  } catch (error) {
    renderProducts(error.message);
  }
};

  // Cancel product editing.
  const controlCancelEdit = () => {
    renderProducts();
  };

  // Update selected product in the sale form.
  const controlProductSelect = (id) => {
    model.selectProduct(id);
    const product = model.getProduct(id);

    salesView.renderTotal(model.calculateSaleTotal());
    salesView.renderStock(product);
  };

  // Recalculate the sale amount as the quantity changes.
  const controlQuantity = (quantity) => {
    model.setSaleQuantity(quantity);
    salesView.renderTotal(model.calculateSaleTotal());
  };

  // Record the sale and update the stock.
  const controlRecordSale = () => {
    try {
      const sale = model.recordSale();
      renderAll();
      renderSales(`Sale recorded: ${sale.productName} × ${sale.quantity}.`);
    } catch (error) {
      renderSales(error.message);
    }
  };

  // Switch between the three main pages.
  const controlNavigation = () => {
    const navigation = document.querySelector(".navigation");

    navigation.addEventListener("click", event => {
      const button = event.target.closest(".nav-btn");

      if (!button) return;

      const page = button.dataset.page;

      document.querySelectorAll(".page-section").forEach(section => {
        section.hidden = section.id !== `${page}-page`;
      });

      document.querySelectorAll(".nav-btn").forEach(navButton => {
        navButton.classList.toggle("nav-btn--active", navButton === button);
      });
    });
  };

// Register all view event handlers.
const init = () => {
  renderAll();

  // Product event handlers
  productView.addHandlerOpenModal(controlOpenAddModal);
  productView.addHandlerSubmit(controlProductSubmit);
  productView.addHandlerImageChange();
  productView.addHandlerEditProduct(controlEditProduct);
  productView.addHandlerDeleteProduct(controlDeleteProduct);
  productView.addHandlerCloseModal(controlCloseModal);
  productView.addHandlerSearch();
  productView.addHandlerCategoryFilter();

  // Sales event handlers
  salesView.addHandlerProductSelect(controlProductSelect);
  salesView.addHandlerQuantity(controlQuantity);
  salesView.addHandlerRecordSale(controlRecordSale);

  // Navigation
  controlNavigation();
};

init();
