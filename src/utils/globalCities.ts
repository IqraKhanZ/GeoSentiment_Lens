// Comprehensive global cities database for live feed mapping
export interface CityData {
  lat: number;
  lng: number;
  city: string;
  country: string;
  region: string;
  population?: number;
  timezone?: string;
}

export const globalCities: CityData[] = [
  // North America
  { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA', region: 'north-america', population: 8400000 },
  { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA', region: 'north-america', population: 3900000 },
  { lat: 41.8781, lng: -87.6298, city: 'Chicago', country: 'USA', region: 'north-america', population: 2700000 },
  { lat: 29.7604, lng: -95.3698, city: 'Houston', country: 'USA', region: 'north-america', population: 2300000 },
  { lat: 33.4484, lng: -112.0740, city: 'Phoenix', country: 'USA', region: 'north-america', population: 1600000 },
  { lat: 39.7392, lng: -104.9903, city: 'Denver', country: 'USA', region: 'north-america', population: 700000 },
  { lat: 47.6062, lng: -122.3321, city: 'Seattle', country: 'USA', region: 'north-america', population: 750000 },
  { lat: 25.7617, lng: -80.1918, city: 'Miami', country: 'USA', region: 'north-america', population: 470000 },
  { lat: 32.7767, lng: -96.7970, city: 'Dallas', country: 'USA', region: 'north-america', population: 1300000 },
  { lat: 37.7749, lng: -122.4194, city: 'San Francisco', country: 'USA', region: 'north-america', population: 880000 },
  
  // Canada
  { lat: 43.6532, lng: -79.3832, city: 'Toronto', country: 'Canada', region: 'north-america', population: 2930000 },
  { lat: 45.5017, lng: -73.5673, city: 'Montreal', country: 'Canada', region: 'north-america', population: 1780000 },
  { lat: 49.2827, lng: -123.1207, city: 'Vancouver', country: 'Canada', region: 'north-america', population: 675000 },
  { lat: 51.0447, lng: -114.0719, city: 'Calgary', country: 'Canada', region: 'north-america', population: 1340000 },
  { lat: 45.4215, lng: -75.6972, city: 'Ottawa', country: 'Canada', region: 'north-america', population: 990000 },
  
  // Mexico
  { lat: 19.4326, lng: -99.1332, city: 'Mexico City', country: 'Mexico', region: 'north-america', population: 9200000 },
  { lat: 20.6597, lng: -103.3496, city: 'Guadalajara', country: 'Mexico', region: 'north-america', population: 1560000 },
  { lat: 25.6866, lng: -100.3161, city: 'Monterrey', country: 'Mexico', region: 'north-america', population: 1140000 },

  // Europe
  { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK', region: 'europe', population: 9000000 },
  { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', region: 'europe', population: 2160000 },
  { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany', region: 'europe', population: 3670000 },
  { lat: 41.9028, lng: 12.4964, city: 'Rome', country: 'Italy', region: 'europe', population: 2870000 },
  { lat: 40.4168, lng: -3.7038, city: 'Madrid', country: 'Spain', region: 'europe', population: 3220000 },
  { lat: 55.7558, lng: 37.6176, city: 'Moscow', country: 'Russia', region: 'europe', population: 12500000 },
  { lat: 59.9311, lng: 30.3609, city: 'St. Petersburg', country: 'Russia', region: 'europe', population: 5380000 },
  { lat: 52.3676, lng: 4.9041, city: 'Amsterdam', country: 'Netherlands', region: 'europe', population: 870000 },
  { lat: 50.1109, lng: 8.6821, city: 'Frankfurt', country: 'Germany', region: 'europe', population: 750000 },
  { lat: 48.1351, lng: 11.5820, city: 'Munich', country: 'Germany', region: 'europe', population: 1470000 },
  { lat: 59.3293, lng: 18.0686, city: 'Stockholm', country: 'Sweden', region: 'europe', population: 970000 },
  { lat: 55.6761, lng: 12.5683, city: 'Copenhagen', country: 'Denmark', region: 'europe', population: 640000 },
  { lat: 60.1699, lng: 24.9384, city: 'Helsinki', country: 'Finland', region: 'europe', population: 650000 },
  { lat: 59.9139, lng: 10.7522, city: 'Oslo', country: 'Norway', region: 'europe', population: 690000 },
  { lat: 47.3769, lng: 8.5417, city: 'Zurich', country: 'Switzerland', region: 'europe', population: 420000 },
  { lat: 48.2082, lng: 16.3738, city: 'Vienna', country: 'Austria', region: 'europe', population: 1900000 },

  // Asia
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan', region: 'asia', population: 37400000 },
  { lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China', region: 'asia', population: 21500000 },
  { lat: 31.2304, lng: 121.4737, city: 'Shanghai', country: 'China', region: 'asia', population: 27100000 },
  { lat: 22.3193, lng: 114.1694, city: 'Hong Kong', country: 'China', region: 'asia', population: 7500000 },
  { lat: 19.0760, lng: 72.8777, city: 'Mumbai', country: 'India', region: 'asia', population: 20400000 },
  { lat: 28.6139, lng: 77.2090, city: 'New Delhi', country: 'India', region: 'asia', population: 32900000 },
  { lat: 12.9716, lng: 77.5946, city: 'Bangalore', country: 'India', region: 'asia', population: 13200000 },
  { lat: 37.5665, lng: 126.9780, city: 'Seoul', country: 'South Korea', region: 'asia', population: 9700000 },
  { lat: 35.1796, lng: 129.0756, city: 'Busan', country: 'South Korea', region: 'asia', population: 3400000 },
  { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore', region: 'asia', population: 5900000 },
  { lat: 3.1390, lng: 101.6869, city: 'Kuala Lumpur', country: 'Malaysia', region: 'asia', population: 1800000 },
  { lat: 13.7563, lng: 100.5018, city: 'Bangkok', country: 'Thailand', region: 'asia', population: 10500000 },
  { lat: -6.2088, lng: 106.8456, city: 'Jakarta', country: 'Indonesia', region: 'asia', population: 10600000 },
  { lat: 14.5995, lng: 120.9842, city: 'Manila', country: 'Philippines', region: 'asia', population: 13500000 },
  { lat: 21.0285, lng: 105.8542, city: 'Hanoi', country: 'Vietnam', region: 'asia', population: 8100000 },
  { lat: 10.8231, lng: 106.6297, city: 'Ho Chi Minh City', country: 'Vietnam', region: 'asia', population: 9000000 },
  { lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE', region: 'asia', population: 3400000 },
  { lat: 41.0082, lng: 28.9784, city: 'Istanbul', country: 'Turkey', region: 'asia', population: 15500000 },
  { lat: 39.9334, lng: 32.8597, city: 'Ankara', country: 'Turkey', region: 'asia', population: 5600000 },

  // Africa
  { lat: 30.0444, lng: 31.2357, city: 'Cairo', country: 'Egypt', region: 'africa', population: 20900000 },
  { lat: -26.2041, lng: 28.0473, city: 'Johannesburg', country: 'South Africa', region: 'africa', population: 5600000 },
  { lat: -33.9249, lng: 18.4241, city: 'Cape Town', country: 'South Africa', region: 'africa', population: 4600000 },
  { lat: 6.5244, lng: 3.3792, city: 'Lagos', country: 'Nigeria', region: 'africa', population: 15300000 },
  { lat: 9.0579, lng: 7.4951, city: 'Abuja', country: 'Nigeria', region: 'africa', population: 3600000 },
  { lat: -1.2921, lng: 36.8219, city: 'Nairobi', country: 'Kenya', region: 'africa', population: 4900000 },
  { lat: -6.7924, lng: 39.2083, city: 'Dar es Salaam', country: 'Tanzania', region: 'africa', population: 7400000 },
  { lat: 5.6037, lng: -0.1870, city: 'Accra', country: 'Ghana', region: 'africa', population: 2400000 },
  { lat: 33.8869, lng: 9.5375, city: 'Tunis', country: 'Tunisia', region: 'africa', population: 2300000 },
  { lat: -4.4419, lng: 15.2663, city: 'Kinshasa', country: 'Congo', region: 'africa', population: 15600000 },
  { lat: 33.9716, lng: -6.8498, city: 'Rabat', country: 'Morocco', region: 'africa', population: 580000 },
  { lat: 33.5731, lng: -7.5898, city: 'Casablanca', country: 'Morocco', region: 'africa', population: 3400000 },

  // South America
  { lat: -23.5505, lng: -46.6333, city: 'São Paulo', country: 'Brazil', region: 'south-america', population: 22400000 },
  { lat: -22.9068, lng: -43.1729, city: 'Rio de Janeiro', country: 'Brazil', region: 'south-america', population: 13600000 },
  { lat: -15.8267, lng: -47.9218, city: 'Brasília', country: 'Brazil', region: 'south-america', population: 3100000 },
  { lat: -34.6037, lng: -58.3816, city: 'Buenos Aires', country: 'Argentina', region: 'south-america', population: 15200000 },
  { lat: -12.0464, lng: -77.0428, city: 'Lima', country: 'Peru', region: 'south-america', population: 10700000 },
  { lat: 4.7110, lng: -74.0721, city: 'Bogotá', country: 'Colombia', region: 'south-america', population: 11000000 },
  { lat: -33.4489, lng: -70.6693, city: 'Santiago', country: 'Chile', region: 'south-america', population: 6800000 },
  { lat: 10.4806, lng: -66.9036, city: 'Caracas', country: 'Venezuela', region: 'south-america', population: 2900000 },
  { lat: -25.2637, lng: -57.5759, city: 'Asunción', country: 'Paraguay', region: 'south-america', population: 3200000 },
  { lat: -34.9011, lng: -56.1645, city: 'Montevideo', country: 'Uruguay', region: 'south-america', population: 1400000 },
  { lat: -0.1807, lng: -78.4678, city: 'Quito', country: 'Ecuador', region: 'south-america', population: 2800000 },
  { lat: -16.2902, lng: -63.5887, city: 'Santa Cruz', country: 'Bolivia', region: 'south-america', population: 1400000 },

  // Oceania
  { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia', region: 'oceania', population: 5300000 },
  { lat: -37.8136, lng: 144.9631, city: 'Melbourne', country: 'Australia', region: 'oceania', population: 5100000 },
  { lat: -27.4698, lng: 153.0251, city: 'Brisbane', country: 'Australia', region: 'oceania', population: 2600000 },
  { lat: -31.9505, lng: 115.8605, city: 'Perth', country: 'Australia', region: 'oceania', population: 2100000 },
  { lat: -34.9285, lng: 138.6007, city: 'Adelaide', country: 'Australia', region: 'oceania', population: 1400000 },
  { lat: -36.8485, lng: 174.7633, city: 'Auckland', country: 'New Zealand', region: 'oceania', population: 1700000 },
  { lat: -41.2865, lng: 174.7762, city: 'Wellington', country: 'New Zealand', region: 'oceania', population: 420000 },
  { lat: -43.5321, lng: 172.6362, city: 'Christchurch', country: 'New Zealand', region: 'oceania', population: 380000 },
  { lat: -17.7134, lng: 168.3273, city: 'Port Vila', country: 'Vanuatu', region: 'oceania', population: 51000 },
  { lat: -21.1789, lng: -175.1982, city: 'Nuku\'alofa', country: 'Tonga', region: 'oceania', population: 23000 },
  { lat: -13.8333, lng: -171.7500, city: 'Apia', country: 'Samoa', region: 'oceania', population: 37000 },
  { lat: -18.1416, lng: 178.4419, city: 'Suva', country: 'Fiji', region: 'oceania', population: 93000 }
];

// Helper functions for city selection
export const getCitiesByRegion = (region: string): CityData[] => {
  if (region === 'global') {
    return globalCities;
  }
  return globalCities.filter(city => city.region === region);
};

export const getRandomCity = (region?: string): CityData => {
  const cities = region ? getCitiesByRegion(region) : globalCities;
  return cities[Math.floor(Math.random() * cities.length)];
};

export const getCitiesByCountry = (country: string): CityData[] => {
  return globalCities.filter(city => city.country.toLowerCase() === country.toLowerCase());
};

export const getMajorCities = (minPopulation: number = 1000000): CityData[] => {
  return globalCities.filter(city => (city.population || 0) >= minPopulation);
};

export const getRegionStats = () => {
  const stats = globalCities.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = { count: 0, totalPopulation: 0 };
    }
    acc[city.region].count++;
    acc[city.region].totalPopulation += city.population || 0;
    return acc;
  }, {} as Record<string, { count: number; totalPopulation: number }>);
  
  return stats;
};