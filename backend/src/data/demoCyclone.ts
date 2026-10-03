import { Cyclone } from "../types";




export const demoCyclone: Cyclone = {
  id: "dana-2024",
  name: "Cyclone Dana",
  latitude: 19.24,
  longitude: 85.83,
  windSpeed: 155,
  category: "Severe Cyclonic Storm",
  movementDirection: "NNW",
  movementSpeed: 13,
  pressureHpa: 968,
  status: "ACTIVE",
  dataSource: "DEMO",
  estimatedLandfall: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  affectedDistricts: ["Puri", "Khordha", "Ganjam", "Kendrapara", "Jagatsinghpur", "Srikakulam"],
  windRadius: { r34kt: 280, r64kt: 110 },
  track: [
    { lat: 13.2, lng: 88.5, timestamp: "2024-10-21T06:00:00Z", windSpeed: 55 },
    { lat: 14.1, lng: 87.9, timestamp: "2024-10-21T18:00:00Z", windSpeed: 75 },
    { lat: 15.0, lng: 87.2, timestamp: "2024-10-22T06:00:00Z", windSpeed: 95 },
    { lat: 15.9, lng: 86.5, timestamp: "2024-10-22T18:00:00Z", windSpeed: 115 },
    { lat: 16.8, lng: 86.1, timestamp: "2024-10-23T06:00:00Z", windSpeed: 130 },
    { lat: 17.6, lng: 85.9, timestamp: "2024-10-23T18:00:00Z", windSpeed: 145 },
    { lat: 19.24, lng: 85.83, timestamp: new Date().toISOString(), windSpeed: 155 },
    { lat: 20.3,  lng: 85.6,  timestamp: new Date(Date.now() + 6  * 3600000).toISOString(), windSpeed: 140 },
    { lat: 20.86, lng: 85.5,  timestamp: new Date(Date.now() + 12 * 3600000).toISOString(), windSpeed: 120 },
    { lat: 21.5,  lng: 85.2,  timestamp: new Date(Date.now() + 18 * 3600000).toISOString(), windSpeed: 95  },
    { lat: 22.1,  lng: 84.9,  timestamp: new Date(Date.now() + 24 * 3600000).toISOString(), windSpeed: 70  },
  ],
};

