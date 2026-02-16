/**
 * Geocoding utility using OpenStreetMap Nominatim API
 * Free service, no API key required (respect usage policy)
 */

import { logger } from './logger';

interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

/**
 * Geocode an address to get latitude and longitude
 * Uses OpenStreetMap Nominatim API
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!address || address.trim().length === 0) {
    return null;
  }

  try {
    // Add delay to respect Nominatim usage policy (max 1 request per second)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BBooker/1.0 (bbooker.app)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      logger.error('Geocoding API error', new Error(response.statusText));
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      logger.debug('No geocoding results found for address', { address });
      return null;
    }

    const result = data[0];

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
    };
  } catch (error) {
    logger.error('Error geocoding address', error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BBooker/1.0 (bbooker.app)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      logger.error('Reverse geocoding API error', new Error(response.statusText));
      return null;
    }

    const data = await response.json();

    return data.display_name || null;
  } catch (error) {
    logger.error('Error reverse geocoding', error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}
