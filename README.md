# 📦 Premium Project Inventory REST API & Dashboard

A professional, feature-rich inventory management system built with **Laravel 11**, featuring a sleek premium dashboard, real-time currency conversion (including **Khmer Riel 🇰🇭**), interactive maps, and live weather tracking.

---

## ✨ Key Features

### 🚀 High-Performance REST API
*   **Scalable Architecture**: Full CRUD for Projects and Inventory Items (Products).
*   **Eager Loading**: Optimized database queries (N+1 protection).
*   **Robust Validation**: Strict input rules and unique SKU management.

### 🍱 Premium Dashboard
*   **Modern Aesthetics**: Glassmorphism design with a vibrant dark-mode interface.
*   **State-Driven UI**: Real-time updates without page reloads using Axios.
*   **Visual Analytics**: Dynamic stats for total projects, stock counts, and inventory value.

### 🌍 Smart Integrations
*   **Live Currency Switcher**: View prices in **USD, EUR, GBP, JPY,** and **KHR (៛)** with real-time exchange rates.
*   **Interactive Maps**: Visualize project locations using Leaflet.js (OpenStreetMap) with labeled markers.
*   **Weather Status**: Real-time environmental tracking for warehouse locations via the Open-Meteo API.

---

## 🛠️ Tech Stack

*   **Backend**: Laravel 11 (PHP 8.2+)
*   **Frontend**: Vanilla JavaScript (ES6+), CSS3 (Custom Variables), Vite
*   **Database**: SQLite (Default) / MySQL
*   **API Client**: Axios
*   **Mapping**: Leaflet.js
*   **Weather**: Open-Meteo API
*   **Exchange Rates**: Open Exchange Rates API

---

## ⚙️ Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/nallyhoo/laravel-rest-api.git
    cd laravel-rest-api
    ```

2.  **Install dependencies**:
    ```bash
    composer install
    npm install
    ```

3.  **Setup Environment**:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4.  **Migrate and Seed**:
    ```bash
    php artisan migrate:fresh --seed
    ```

5.  **Build Assets**:
    ```bash
    npm run build
    ```

6.  **Run Service**:
    ```bash
    php artisan serve
    ```

---

## 📋 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | List all projects with nested products. |
| `POST` | `/api/projects` | Create a new warehouse/project. |
| `GET` | `/api/products` | List all inventory items. |
| `POST` | `/api/products` | Add a new product to a project. |
| `GET` | `/api/exchange-rate` | Fetch latest USD base rates. |
| `GET` | `/api/weather` | Fetch weather for specific lat/lng. |

---

## 📚 Specialized Documentation

For deep dives into the implementation, check out our tutorial series in the root directory:
*   [Full Build Tutorial](./TUTORIAL.md)
*   [External API Integration](./TUTORIAL_EXTERNAL_API.md)
*   [Maps Integration Guide](./TUTORIAL_MAPS.md)
*   [Weather Tracking Guide](./TUTORIAL_WEATHER.md)
*   [Postman Testing Guide](./POSTMAN.md)

---

## 👨‍💻 Author

**NallyHoo** - *Maow Developer*

