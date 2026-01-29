# Tutorial: Real-World External API Integration

This tutorial explains how we integrated a **Live Currency Switcher** into the Inventory System. You will learn how to safely fetch data from a third-party service and use it to transform your UI.

---

## 🏗️ 1. The "Backend Proxy" Strategy
**Problem**: Why can't we just call the Currency API directly from JavaScript?
1.  **CORS Issues**: Some APIs block direct browser requests.
2.  **Security**: Storing API keys in JavaScript exposes them to the world.
3.  **Performance**: The backend can cache results so you don't hit the external API too often.

**Solution**: We create a route in *our* Laravel server that acts as a bridge (Proxy).

---

## 🚀 2. Step-by-Step Implementation

### Step 1: Create the Backend Proxy
In `routes/api.php`, we use Laravel's `Http` client to fetch currency data.

```php
use Illuminate\Support\Facades\Http;

Route::get('/exchange-rate', function () {
    // We use a public exchange rate API
    return Http::get('https://open.er-api.com/v6/latest/USD')->json();
});
```

### Step 2: Build the UI Selector
In your Dashboard (`dashboard.blade.php`), add a dropdown for users to select their currency.

```html
<select id="currency-selector" onchange="window.changeCurrency(this.value)">
    <option value="USD">USD ($)</option>
    <option value="KHR">KHR (៛)</option>
    <!-- other options -->
</select>
```

### Step 3: Handle State in JavaScript
In `app.js`, we need to store the exchange rates once they are fetched.

```javascript
let state = {
    exchangeRates: {}, // Stores rates like { "KHR": 4100, "EUR": 0.92 }
    selectedCurrency: 'USD'
};

async function fetchExchangeRates() {
    const res = await axios.get('/api/exchange-rate');
    state.exchangeRates = res.data.rates;
}
```

### Step 4: The Conversion Logic
Every time the UI renders a price, we multiply the base price (USD) by the current exchange rate.

```javascript
function formatCurrency(usdAmount) {
    const rate = state.exchangeRates[state.selectedCurrency] || 1;
    const converted = usdAmount * rate;
    
    // Custom formatting for Khmer Riel (No decimals)
    const decimals = state.selectedCurrency === 'KHR' ? 0 : 2;
    
    return `${converted.toLocaleString(undefined, {
        minimumFractionDigits: decimals
    })} ${getSymbol(state.selectedCurrency)}`;
}
```

---

## 🇰🇭 3. Case Study: Khmer Riel (KHR) Integration
Integrating the Riel required two special considerations:
1.  **High Multiplier**: 1 USD is ~4,100 KHR. This means numbers get large quickly.
2.  **Symbol Position**: Unlike the dollar sign ($100), the Riel symbol is usually placed *after* the value (`400,000 ៛`).
3.  **Rounding**: In Cambodia, small change in Riel is rarely used for high-value items, so we removed decimals (`.00`) to increase readability.

---

## 🛠️ 4. Common Pitfalls to Avoid
*   **Missing Timeouts**: If the external API is slow, your whole dashboard will hang. Always use `Http::timeout(3)`.
*   **JSON Errors**: Check if the response is successful using `$response->successful()` before trying to access `.rates`.
*   **Rate Limits**: Most free APIs allow 100-1,000 calls per day. Cache the result in Laravel using `Cache::remember()` to save credits.

---

*Tutorial created for the Laravel Project Inventory System.*
