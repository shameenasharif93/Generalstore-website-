let products = JSON.parse(localStorage.getItem("products")) || [];

// Give older products a default unit if they do not have one.
products.forEach(product => {
    if (!product.unit) {
        product.unit = "piece";
    }
});

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function getUnitLabel(unit) {
    const labels = {
        kg: "kg",
        g: "g",
        litre: "litre",
        ml: "ml",
        piece: "pieces",
        packet: "packets",
        box: "boxes",
        bottle: "bottles",
        dozen: "dozen"
    };

    return labels[unit] || unit || "piece";
}

// ADD PRODUCT
const productForm = document.getElementById("productForm");

if (productForm) {
    productForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const quantityInput = document.getElementById("quantity").value;
        const quantity = Number(quantityInput);
        const unit = document.getElementById("unit").value;

        if (
            name === "" ||
            quantityInput === "" ||
            !Number.isFinite(quantity) ||
            quantity < 0 ||
            !unit
        ) {
            alert("Please enter a valid product name, quantity and unit.");
            return;
        }

        products.push({ name, quantity, unit });

        saveProducts();
        productForm.reset();
        displayProducts();
    });
}

// DISPLAY PRODUCTS
function displayProducts() {
    const list = document.getElementById("productList");
    if (!list) return;

    list.innerHTML = "";
    const searchBox = document.getElementById("search");
    const searchText = searchBox ? searchBox.value.toLowerCase() : "";

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchText)
    );

    filteredProducts.forEach(product => {
        const isLow = product.quantity < 25;
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const quantityCell = document.createElement("td");
        const statusCell = document.createElement("td");
        const actionCell = document.createElement("td");

        nameCell.textContent = product.name;
        quantityCell.textContent =
            product.quantity + " " + getUnitLabel(product.unit);

        statusCell.textContent = isLow ? "Low Stock Alert!" : "In Stock";
        statusCell.style.color = isLow ? "red" : "green";

        // UPDATE BUTTON
        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.type = "button";

        updateButton.addEventListener("click", function () {
            const newName = prompt(
                "Enter updated product name:",
                product.name
            );

            if (newName === null || newName.trim() === "") return;

            const newQuantity = prompt(
                "Enter updated quantity:",
                product.quantity
            );

            if (newQuantity === null || newQuantity.trim() === "") return;

            const quantity = Number(newQuantity);

            if (!Number.isFinite(quantity) || quantity < 0) {
                alert("Please enter a valid quantity.");
                return;
            }

            const newUnit = prompt(
                "Enter unit: kg, g, litre, ml, piece, packet, box, bottle or dozen",
                product.unit || "piece"
            );

            if (newUnit === null || newUnit.trim() === "") return;

            const allowedUnits = [
                "kg", "g", "litre", "ml", "piece",
                "packet", "box", "bottle", "dozen"
            ];

            const unit = newUnit.trim().toLowerCase();

            if (!allowedUnits.includes(unit)) {
                alert("Please enter a valid unit from the list.");
                return;
            }

            product.name = newName.trim();
            product.quantity = quantity;
            product.unit = unit;

            saveProducts();
            displayProducts();
        });

        // DELETE BUTTON
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            if (!confirm("Are you sure you want to delete this product?")) {
                return;
            }

            products.splice(products.indexOf(product), 1);
            saveProducts();
            displayProducts();
        });

        actionCell.appendChild(updateButton);
        actionCell.appendChild(deleteButton);

        row.append(nameCell, quantityCell, statusCell, actionCell);
        list.appendChild(row);
    });

    const totalElement = document.getElementById("total");
    const lowStockElement = document.getElementById("lowStock");
    const emptyMessage = document.getElementById("emptyMessage");

    if (totalElement) {
        totalElement.textContent = products.length;
    }

    if (lowStockElement) {
        lowStockElement.textContent =
            products.filter(product => product.quantity < 25).length;
    }

    if (emptyMessage) {
        emptyMessage.textContent =
            products.length === 0 ? "No products added yet." :
            filteredProducts.length === 0 ? "No matching products found." : "";
    }

    saveProducts();
}

// SEARCH
const searchBox = document.getElementById("search");

if (searchBox) {
    searchBox.addEventListener("input", displayProducts);
}

// LOGOUT
function logout() {
    window.location.href = "login.html";
}

// LOW STOCK PRODUCT NAMES
const lowStockCard = document.getElementById("lowStockCard");
const lowStockNames = document.getElementById("lowStockNames");

if (lowStockCard && lowStockNames) {
    function showLowStockNames() {
        if (lowStockNames.style.display === "none") {
            lowStockNames.innerHTML = "";

            const lowProducts = products.filter(
                product => product.quantity < 25
            );

            if (lowProducts.length === 0) {
                lowStockNames.textContent = "No low-stock products.";
            } else {
                lowProducts.forEach(product => {
                    const item = document.createElement("p");
                    item.textContent =
                        product.name + " — " + product.quantity + " " +
                        getUnitLabel(product.unit) + " left";
                    lowStockNames.appendChild(item);
                });
            }

            lowStockNames.style.display = "block";
        } else {
            lowStockNames.style.display = "none";
        }
    }

    lowStockCard.addEventListener("click", showLowStockNames);

    lowStockCard.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showLowStockNames();
        }
    });
}

// UPDATE PRODUCT FORM
const updateForm = document.getElementById("updateForm");

if (updateForm) {
    updateForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const currentName =
            document.getElementById("updateName").value.trim();

        const newName =
            document.getElementById("newProductName").value.trim();

        const quantityInput =
            document.getElementById("updateQuantity").value;

        const newQuantity = Number(quantityInput);
        const unitSelect = document.getElementById("updateUnit");
        const newUnit = unitSelect ? unitSelect.value : "";

        if (
            currentName === "" ||
            newName === "" ||
            quantityInput === "" ||
            !Number.isFinite(newQuantity) ||
            newQuantity < 0 ||
            !newUnit
        ) {
            alert("Please enter a valid name, quantity and unit.");
            return;
        }

        const product = products.find(
            p => p.name.toLowerCase() === currentName.toLowerCase()
        );

        if (!product) {
            alert("Product not found!");
            return;
        }

        const nameExists = products.some(
            p => p !== product &&
                p.name.toLowerCase() === newName.toLowerCase()
        );

        if (nameExists) {
            alert("Another product already has this name!");
            return;
        }

        product.name = newName;
        product.quantity = newQuantity;
        product.unit = newUnit;

        saveProducts();
        displayProducts();

        alert("Product updated successfully!");
        updateForm.reset();
    });
}

saveProducts();
displayProducts();