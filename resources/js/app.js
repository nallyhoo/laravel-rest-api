import axios from 'axios';

// API Config
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

let state = {
    projects: [],
    products: [],
    selectedProjectId: null,
    selectedCurrency: 'USD',
    exchangeRates: { USD: 1 },
    map: null,
    marker: null
};

// --- API Calls ---

async function fetchProjects() {
    try {
        const res = await api.get('/projects');
        state.projects = res.data;
        renderProjects();
        updateProjectSelects();
        updateStats();
    } catch (err) {
        console.error('Error fetching projects:', err);
    }
}

async function fetchProducts(projectId = null) {
    try {
        const url = projectId ? `/projects/${projectId}` : '/products';
        const res = await api.get(url);

        if (projectId) {
            state.products = res.data.products;
        } else {
            state.products = res.data;
        }

        renderProducts();
        updateStats();
    } catch (err) {
        console.error('Error fetching products:', err);
    }
}

async function fetchExchangeRates() {
    try {
        const res = await api.get('/exchange-rate');
        state.exchangeRates = res.data.rates;
        updateStats();
    } catch (err) {
        console.error('Error fetching exchange rates:', err);
    }
}

async function fetchWeather(lat, lng) {
    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-desc');
    const iconEl = document.getElementById('weather-icon');

    try {
        const res = await api.get('/weather', { params: { lat, lng } });
        const weather = res.data.current_weather;

        tempEl.innerText = `${Math.round(weather.temperature)}°C`;
        const info = getWeatherInfo(weather.weathercode);
        descEl.innerText = info.text;
        iconEl.innerText = info.icon;
    } catch (err) {
        console.error('Error fetching weather:', err);
        descEl.innerText = 'Weather unavailable';
    }
}

function getWeatherInfo(code) {
    const mapping = {
        0: { text: 'Clear sky', icon: '☀️' },
        1: { text: 'Mainly clear', icon: '🌤️' },
        2: { text: 'Partly cloudy', icon: '⛅' },
        3: { text: 'Overcast', icon: '☁️' },
        45: { text: 'Fog', icon: '🌫️' },
        48: { text: 'Depositing rime fog', icon: '🌫️' },
        51: { text: 'Light drizzle', icon: '🌦️' },
        53: { text: 'Moderate drizzle', icon: '🌦️' },
        55: { text: 'Dense drizzle', icon: '🌦️' },
        61: { text: 'Slight rain', icon: '🌧️' },
        63: { text: 'Moderate rain', icon: '🌧️' },
        65: { text: 'Heavy rain', icon: '🌧️' },
        71: { text: 'Slight snow fall', icon: '🌨️' },
        73: { text: 'Moderate snow fall', icon: '🌨️' },
        75: { text: 'Heavy snow fall', icon: '🌨️' },
        80: { text: 'Slight rain showers', icon: '🌦️' },
        81: { text: 'Moderate rain showers', icon: '🌦️' },
        82: { text: 'Violent rain showers', icon: '🌧️' },
        95: { text: 'Thunderstorm', icon: '⛈️' }
    };
    return mapping[code] || { text: 'Unknown', icon: '🌡️' };
}

// --- Renderers ---

function renderProjects() {
    const list = document.getElementById('project-list');
    if (!list) return;

    list.innerHTML = `
        <div class="item-card ${!state.selectedProjectId ? 'active' : ''}" onclick="window.selectProject(null)">
            <div style="font-weight: 600;">All Products</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">View inventory across all projects</div>
        </div>
    `;

    state.projects.forEach(project => {
        const card = document.createElement('div');
        card.className = `item-card ${state.selectedProjectId === project.id ? 'active' : ''}`;
        card.onclick = () => window.selectProject(project.id);
        card.innerHTML = `
            <div style="font-weight: 600;">${project.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${project.products?.length || 0} items</div>
        `;
        list.appendChild(card);
    });
}

function renderProducts() {
    const tbody = document.getElementById('product-tbody');
    if (!tbody) return;

    if (state.products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 3rem;">No products found.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    state.products.forEach(product => {
        const currentRate = state.exchangeRates[state.selectedCurrency] || 1;
        const convertedPrice = parseFloat(product.price) * currentRate;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 500;">${product.name}</td>
            <td><code>${product.sku}</code></td>
            <td>${formatCurrency(convertedPrice)}</td>
            <td><span class="badge badge-stock">${product.stock} in stock</span></td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn" style="padding: 0.4rem; background: rgba(239, 68, 68, 0.1); color: #ef4444;" onclick="window.deleteProduct(${product.id})">
                        <i data-lucide="trash-2" style="width: 16px;"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update Lucide icons
    if (window.lucide) window.lucide.createIcons();
}

function updateProjectSelects() {
    const select = document.getElementById('modal-project-select');
    if (!select) return;

    select.innerHTML = '<option value="">Select a project</option>';
    state.projects.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
    });
}

function updateStats() {
    const statProjects = document.getElementById('stat-projects');
    const statProducts = document.getElementById('stat-products');
    const statValue = document.getElementById('stat-value');

    if (statProjects) statProjects.innerText = state.projects.length;

    // Note: To get accurate total global stats when filtering, we'd need a separate call or keep original.
    // For now, let's just show visible or fetch all once.

    if (statProducts) statProducts.innerText = state.products.length;

    const currentRate = state.exchangeRates[state.selectedCurrency] || 1;
    const totalVal = state.products.reduce((acc, p) => acc + (parseFloat(p.price) * p.stock), 0);
    const convertedTotal = totalVal * currentRate;

    if (statValue) statValue.innerText = formatCurrency(convertedTotal);
}

function formatCurrency(amount) {
    const symbolMap = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'KHR': '៛' };
    const symbol = symbolMap[state.selectedCurrency] || '$';

    // For KHR, we usually don't show decimals and use spaces as thousands separators often, 
    // but we'll stick to a standard format with 0 decimals for KHR specifically.
    const decimals = state.selectedCurrency === 'KHR' ? 0 : 2;

    return `${amount.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })} ${symbol}`;
}

// --- Event Handlers (Attached to Window) ---

window.changeCurrency = (currency) => {
    state.selectedCurrency = currency;
    renderProducts();
    updateStats();
};

window.selectProject = (id) => {
    state.selectedProjectId = id;
    const title = document.getElementById('products-title');
    const mapContainer = document.getElementById('project-map-container');
    const addressEl = document.getElementById('project-address');

    if (id) {
        const project = state.projects.find(proj => proj.id === id);
        title.innerText = project ? project.name : 'Products';

        // Handle Map
        if (project && project.latitude && project.longitude) {
            mapContainer.style.display = 'block';
            addressEl.innerText = project.address || 'No address provided';
            updateMap(project.latitude, project.longitude, project.name);
            fetchWeather(project.latitude, project.longitude);
        } else {
            mapContainer.style.display = 'none';
        }
    } else {
        title.innerText = 'All Products';
        mapContainer.style.display = 'none';
    }
    renderProjects();
    fetchProducts(id);
};

function updateMap(lat, lng, name) {
    if (!window.L) return;

    if (!state.map) {
        state.map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(state.map);
        state.marker = L.marker([lat, lng]).addTo(state.map)
            .bindPopup(name)
            .openPopup();
    } else {
        const newPos = [lat, lng];
        state.map.setView(newPos, 13);
        state.marker.setLatLng(newPos)
            .getPopup().setContent(name);
        state.marker.openPopup();

        // Fix for leaflet grey tiles when container was hidden
        setTimeout(() => {
            state.map.invalidateSize();
        }, 100);
    }
}

window.handleProjectSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        await api.post('/projects', data);
        e.target.reset();
        window.closeModal('projectModal');
        fetchProjects();
    } catch (err) {
        alert('Error creating project: ' + (err.response?.data?.message || err.message));
    }
};

window.handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        await api.post('/products', data);
        e.target.reset();
        window.closeModal('productModal');
        fetchProjects(); // To update counts
        fetchProducts(state.selectedProjectId);
    } catch (err) {
        alert('Error adding product: ' + (err.response?.data?.message || err.message));
    }
};

window.deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        await api.delete(`/products/${id}`);
        fetchProjects();
        fetchProducts(state.selectedProjectId);
    } catch (err) {
        console.error('Error deleting product:', err);
    }
};

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    fetchProducts();
    fetchExchangeRates();
});
