# Tutorial: Building a Premium Project Inventory System

This tutorial walks you through building a professional Laravel REST API with a modern, dynamic dashboard and real-time currency conversion.

---

## 1. Project Architecture
Our system consists of two main entities:
*   **Projects**: High-level containers (e.g., "Main Warehouse").
*   **Products**: Inventory items linked to a specific project.

---

## 2. Setting Up the Backend (API)

### Step 2.1: Initialize Laravel
```bash
composer create-project laravel/laravel inventory-app
php artisan install:api
```

### Step 2.2: Models & Migrations
Create the models with their controllers and migrations:
```bash
php artisan make:model Project -a --api
php artisan make:model Product -a --api
```

**Key Relationship** (in `Project.php`):
```php
public function products() {
    return $this->hasMany(Product::class);
}
```

### Step 2.3: API Controller Logic
In `ProductController.php`, use **Eager Loading** to include the project data in every request:
```php
public function index() {
    return Product::with('project')->get();
}
```

---

## 3. The Premium UI (Frontend)

We use **Vite** with Vanilla JS and CSS to create a glassmorphism dashboard.

### Step 3.1: State Management
Instead of refreshing the page, we manage data in a JavaScript `state` object:
```javascript
let state = {
    projects: [],
    products: [],
    selectedCurrency: 'USD'
};
```

### Step 3.2: Dynamic Rendering
We use `document.createElement` to inject product rows based on the API response. This makes the UI feel fast and responsive.

---

## 4. Advanced: External API Integration

We integrated a **Currency Switcher** that allows users to view prices in **KHR (៛)**, **EUR**, etc.

### Step 4.1: The Backend Proxy
To protect API keys and avoid CORS issues, we create a proxy route in `api.php`:
```php
Route::get('/exchange-rate', function () {
    return Http::get('https://open.er-api.com/v6/latest/USD')->json();
});
```

### Step 4.2: Localization for Khmer Riel (KHR)
When formatting prices for KHR, we:
1.  Remove decimals (Riel values are typically high).
2.  Place the symbol (**៛**) after the number.
```javascript
const decimals = currency === 'KHR' ? 0 : 2;
return `${amount.toLocaleString()} ${symbol}`;
```

---

## 5. Testing & Verification

### Using Postman
1.  Import the generated `.json` collection.
2.  Set the `Accept: application/json` header.
3.  Test the `POST` endpoints to see validation errors automatically handled by Laravel.

---

## 6. Summary of Best Practices
*   **Security**: Never expose API keys in the frontend; always use a backend proxy.
*   **Performance**: Use `with()` in Eloquent to prevent N+1 query issues.
*   **UX**: Use skeleton loaders and glassmorphism styling for a premium enterprise feel.

---

*This project was developed with the assistance of Antigravity AI.*
