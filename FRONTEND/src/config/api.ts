// Central API configuration for the frontend
// Default to the production Railway backend URL unless overridden by VITE_API_URL at build time
const RAILWAY_DEFAULT = 'https://josnishop000-backend-production.up.railway.app';
const base = (import.meta.env.VITE_API_URL ?? RAILWAY_DEFAULT).replace(/\/$/, '');
export const API = base;
export const STORAGE = (import.meta.env.VITE_STORAGE_URL ?? `${base}/storage`).replace(/\/$/, '');
const protocol = base.startsWith('https') ? 'wss' : 'ws';
export const CHAT_WS = import.meta.env.VITE_CHAT_WS ?? `${protocol}://${base.replace(/^https?:\/\//, '')}/ws`;

export default API;
