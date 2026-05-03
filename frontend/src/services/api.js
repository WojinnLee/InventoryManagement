const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, '');
const API_BASE = normalizedApiUrl.endsWith('/api')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const res = await fetch(url, config);
  const json = await res.json();

  if (!res.ok || !json.ok) {
    throw new Error(json.message || `Request failed: ${res.status}`);
  }

  return json;
}

// Health
export const checkHealth = () => request('/health');

// Items
export const getItems = () => request('/items');
export const createItem = (data) =>
  request('/items', { method: 'POST', body: JSON.stringify(data) });
export const updateItem = (id, data) =>
  request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteItem = (id) =>
  request(`/items/${id}`, { method: 'DELETE' });

// Inventory
export const getInventory = () => request('/inventory');

// Stock Logs
export const getStockLogs = () => request('/stock-logs');
export const stockIn = (data) =>
  request('/stock-logs/in', { method: 'POST', body: JSON.stringify(data) });
export const stockOut = (data) =>
  request('/stock-logs/out', { method: 'POST', body: JSON.stringify(data) });
