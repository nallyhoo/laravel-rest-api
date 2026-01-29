<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Inventory | Premium Dashboard</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>

<body>
    <div class="container">
        <header style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
                <h1>Inventory Dashboard</h1>
                <p class="subtitle">Efficiently track your projects and warehouse stock</p>
            </div>
            <div style="background: var(--card-bg); padding: 0.5rem 1rem; border-radius: 1rem; border: 1px solid var(--glass-border);">
                <label style="margin-bottom: 0.25rem; font-size: 0.7rem;">Display Currency</label>
                <select id="currency-selector" onchange="window.changeCurrency(this.value)" style="background: transparent; border: none; font-weight: 600; cursor: pointer; padding: 0.25rem 0;">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="KHR">KHR (៛)</option>
                </select>
            </div>
        </header>

        <!-- Stats Overview -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Projects</div>
                <div id="stat-projects" class="stat-value">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Stock Items</div>
                <div id="stat-products" class="stat-value">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Value</div>
                <div id="stat-value" class="stat-value">$0.00</div>
            </div>
        </div>

        <div class="dashboard-grid">
            <!-- Projects Sidebar -->
            <section class="section-card">
                <div class="section-header">
                    <h2>Projects</h2>
                    <button class="btn btn-primary" onclick="openModal('projectModal')">
                        <i data-lucide="plus-circle"></i> New
                    </button>
                </div>
                <div id="project-list" class="item-list">
                    <!-- Projects will be injected here -->
                    <div class="skeleton" style="height: 60px;"></div>
                    <div class="skeleton" style="height: 60px; margin-top: 10px;"></div>
                </div>
        </div>

        <!-- Project Map Section -->
        <div id="project-map-container" style="margin-top: 1.5rem; display: none;">
            <h3 style="margin-bottom: 0.5rem; font-size: 1rem;">Location & Status</h3>
            <div id="map" style="height: 200px; border-radius: 1rem; border: 1px solid var(--glass-border);"></div>
            <p id="project-address" style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted); font-style: italic;"></p>

            <!-- Weather Widget -->
            <div id="weather-widget" style="margin-top: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 1rem; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 1rem;">
                <div id="weather-icon" style="font-size: 2rem;"></div>
                <div>
                    <div id="weather-temp" style="font-size: 1.25rem; font-weight: 700;">--°C</div>
                    <div id="weather-desc" style="font-size: 0.8rem; color: var(--text-muted);">Loading weather...</div>
                </div>
            </div>
        </div>
        </section>

        <!-- Products Table -->
        <section class="section-card">
            <div class="section-header">
                <h2 id="products-title">All Products</h2>
                <button class="btn btn-primary" onclick="openModal('productModal')">
                    <i data-lucide="package-plus"></i> Add Item
                </button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="product-tbody">
                        <!-- Products will be injected here -->
                    </tbody>
                </table>
            </div>
        </section>
    </div>
    </div>

    <!-- Project Modal -->
    <div id="projectModal" class="modal">
        <div class="modal-content">
            <h3>Create New Project</h3>
            <form id="projectForm" onsubmit="handleProjectSubmit(event)">
                <div class="form-group">
                    <label>Project Name</label>
                    <input type="text" name="name" required placeholder="e.g. Warehouse expansion">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="2" placeholder="Project details..."></textarea>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" name="address" placeholder="Phnom Penh, Cambodia">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Latitude</label>
                        <input type="number" step="0.0001" name="latitude" placeholder="11.5449">
                    </div>
                    <div class="form-group">
                        <label>Longitude</label>
                        <input type="number" step="0.0001" name="longitude" placeholder="104.9135">
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" class="btn" style="background: #334155;" onclick="closeModal('projectModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Project</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Product Modal -->
    <div id="productModal" class="modal">
        <div class="modal-content">
            <h3>Add Inventory Item</h3>
            <form id="productForm" onsubmit="handleProductSubmit(event)">
                <div class="form-group">
                    <label>Project</label>
                    <select name="project_id" id="modal-project-select" required>
                        <option value="">Select a project</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Product Name</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>SKU</label>
                    <input type="text" name="sku" required placeholder="SKU-XXXX">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Price ($)</label>
                        <input type="number" step="0.01" name="price" required>
                    </div>
                    <div class="form-group">
                        <label>Stock Quantity</label>
                        <input type="number" name="stock" required>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="button" class="btn" style="background: #334155;" onclick="closeModal('productModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Product</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        lucide.createIcons();

        function openModal(id) {
            document.getElementById(id).style.display = 'flex';
        }

        function closeModal(id) {
            document.getElementById(id).style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = "none";
            }
        }
    </script>
</body>

</html>