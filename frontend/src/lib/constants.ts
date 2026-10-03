// API base URL from env
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Map default center — Bay of Bengal near Odisha coast
export const MAP_DEFAULT_CENTER: [number, number] = [19.5, 85.8];
export const MAP_DEFAULT_ZOOM = 7;

// Tile layers
const BASEMAP_KEY = import.meta.env.VITE_BASEMAPS_API_KEY || "cb1_48es_1_3ad78a929e660f58eaa28083";
export const TILE_URL = BASEMAP_KEY
  ? `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${BASEMAP_KEY}`
  : "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION = '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>';

// Impact corridor buffer radius in km
export const CORRIDOR_BUFFER_KM = 150;
