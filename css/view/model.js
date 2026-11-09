// The model stores application data and handles all data changes.
// It does not access the DOM or import any View.

const STORAGE_KEY = "boxTrackData";

const starterProducts = [
  {
    id: 1,
    name: "Logitech Mouse",
    category: "Mouse",
    price: 450,
    stock: 20,
    minimumStock: 5,
    image: "image/jtechmouse.jpg"
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    category: "Keyboard",
    price: 1500,
    stock: 8,
    minimumStock: 5,
    image: "image/keyboard.jpg"
  },
  {
    id: 3,
    name: "USB Flash Drive",
    category: "USB Flash Drive",
    price: 250,
    stock: 3,
    minimumStock: 5,
    image: "image/flashdrive.jpg"
  }
];

export const state = {
  products: starterProducts,
  sales: [],
  selectedProductId: "",
  saleQuantity: 1
};

// Save the current application data in the browser.
const saveToLocalStorage = () => {
  const data = {
    products: state.products,
    sales: state.sales
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Load previously saved data when the application starts.
const loadFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) return;

    const parsedData = JSON.parse(savedData);

    if (Array.isArray(parsedData.products) && Array.isArray(parsedData.sales)) {
      state.products = parsedData.products;
      state.sales = parsedData.sales;
    }
  } catch (error) {
    console.error("Unable to load saved ElectroTrack data:", error);
  }
};

loadFromLocalStorage();

// Return one product using its ID.
export const getProduct = (id) => {
  return state.products.find(product => product.id === Number(id));
};

// Add a new product after validating its information.
export const addProduct = (productData) => {
  const product = validateProduct(productData);

  product.id = Date.now();
  state.products.push(product);

  saveToLocalStorage();
};

// Update an existing product.
export const updateProduct = (id, productData) => {
  const product = validateProduct(productData);
  const index = state.products.findIndex(item => item.id === Number(id));

  if (index === -1) {
    throw new Error("The selected product could not be found.");
  }

  state.products[index] = {
    ...state.products[index],
    ...product,
    id: Number(id)
  };

  saveToLocalStorage();
};

// Remove a product from the inventory.
export const deleteProduct = (id) => {
  const productExists = state.products.some(
    product => product.id === Number(id)
  );

  if (!productExists) {
    throw new Error("The selected product could not be found.");
  }

  state.products = state.products.filter(
    product => product.id !== Number(id)
  );

  if (state.selectedProductId === Number(id)) {
    state.selectedProductId = "";
    state.saleQuantity = 1;
  }

  saveToLocalStorage();
};

// Validate product information in one place.
const validateProduct = (data) => {
  const name = data.name.trim();
  const category = data.category.trim();
  const price = Number(data.price);
  const stock = Number(data.stock);
  const minimumStock = Number(data.minimumStock);
  const image = data.image || "";

  if (!name || !category) {
    throw new Error("Please enter the product name and category.");
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Price must be greater than zero.");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Stock must be a whole number and cannot be negative.");
  }

  if (!Number.isInteger(minimumStock) || minimumStock < 0) {
    throw new Error(
      "Minimum stock must be a whole number and cannot be negative."
    );
  }

  return {
    name,
    category,
    price,
    stock,
    minimumStock,
    image
  };
};

// Select a product for the sales form.
export const selectProduct = (id) => {
  state.selectedProductId = id === "" ? "" : Number(id);
};

// Update the quantity entered in the sales form.
export const setSaleQuantity = (quantity) => {
  state.saleQuantity = Number(quantity);
};

// Calculate the current sale amount.
export const calculateSaleTotal = () => {
  const product = getProduct(state.selectedProductId);
  const quantity = state.saleQuantity;

  if (!product || !Number.isInteger(quantity) || quantity <= 0) {
    return 0;
  }

  return product.price * quantity;
};

// Record a sale and deduct the sold quantity from inventory.
export const recordSale = () => {
  const product = getProduct(state.selectedProductId);
  const quantity = Number(state.saleQuantity);

  if (!product) {
    throw new Error("Please select a product.");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a whole number greater than zero.");
  }

  if (quantity > product.stock) {
    throw new Error(Only ${product.stock} unit(s) are available.);
  }

  const subtotal = product.price * quantity;

  const sale = {
    id: Date.now(),
    productId: product.id,
    productName: product.name,
    quantity,
