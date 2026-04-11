// core/services/weather.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { OpenMeteoResponse } from '../../interfaces/weather.interface';

interface GeocodingResult {
  results: { name: string; latitude: number; longitude: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = `https://api.open-meteo.com/v1/forecast`;
  private geoUrl = `https://geocoding-api.open-meteo.com/v1/search`;
  private geoapifyKey = '7fd6dc6b15ca46ee9e568ed8c08bb44c';

  constructor(private http: HttpClient) { }

  getWeatherIcon(code: number): string {
    if (code === 0) return 'wb_sunny'; // Clear sky
    if (code >= 1 && code <= 3) return 'cloud'; // Partly cloudy
    if (code >= 45 && code <= 48) return 'foggy'; // Fog
    if (code >= 51 && code <= 67) return 'grain'; // Drizzle/Rain
    if (code >= 71 && code <= 77) return 'ac_unit'; // Snow
    if (code >= 80 && code <= 82) return 'umbrella'; // Rain showers
    if (code >= 95) return 'thunderstorm'; // Thunderstorm
    return 'help_outline'; // Default
  }

  getWeatherDescription(code: number): string {
    const codes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
    };
    return codes[code] || 'Unknown';
  }

  getCurrentWeather(lat: number, lon: number): Observable<OpenMeteoResponse> {
    const url = `${this.apiUrl}?latitude=${lat}&longitude=${lon}&current=relative_humidity_2m&current_weather=true&timezone=auto`;
    return this.http.get<OpenMeteoResponse>(url);
  }

  getCityCoordinates(city: string): Observable<{ lat: number; lon: number; name: string }> {
    return this.http.get<any>(`${this.geoUrl}?name=${city}&count=1`).pipe(
      map(res => {
        if (res.results && res.results.length > 0) {
          const topResult = res.results[0];
          return {
            lat: topResult.latitude,
            lon: topResult.longitude,
            name: topResult.name
          };
        }
        throw new Error('City not found');
      })
    );
  }

  getOSMMapUrl(lat: number, lon: number): string {
    const offset = 0.02;
    const left = lon - offset;
    const bottom = lat - offset;
    const right = lon + offset;
    const top = lat + offset;

    // Standard OpenStreetMap Export URL
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik&marker=${lat},${lon}`;
  }

  getWeatherTip(code: number, temp: number): string {
    // Rain / Drizzle
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return '🌧️ Bring an umbrella, it might rain!';
    }
    // Thunderstorm
    if (code >= 95) {
      return '⛈️ Stay indoors if possible. Avoid open areas.';
    }
    // Snow
    if (code >= 71 && code <= 77) {
      return '❄️ Wear warm clothes and be careful on slippery roads.';
    }
    // Fog
    if (code >= 45 && code <= 48) {
      return '🌫️ Low visibility. Drive carefully.';
    }
    // Hot weather
    if (temp >= 35)
      return '🔥 Extreme heat! Avoid going out unless necessary.';
    if (temp >= 32) {
      return '🔥 It’s very hot! Stay hydrated and avoid direct sun.';
    }
    // Cold weather
    if (temp <= 10) {
      return '🥶 It’s cold! Wear something warm.';
    }
    // Cloudy
    if (code >= 1 && code <= 3) {
      return '☁️ Cloudy day. Might be a bit gloomy.';
    }
    // Clear sky
    if (code === 0) {
      return '☀️ Nice weather! Great day to go outside.';
    }
    return '🌤️ Have a great day!';
  }

  getNearbyAttractions(lat: number, lon: number): Observable<any[]> {
  const apiKey = '7fd6dc6b15ca46ee9e568ed8c08bb44c';
  // Combined categories for better variety
  const cats = 'tourism.attraction,entertainment.culture,leisure.park,heritage';
  const url = `https://api.geoapify.com/v2/places?categories=${cats}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=15&apiKey=${apiKey}`;
  
  return this.http.get<any>(url).pipe(
    map(res => {
      return res.features
        .filter((f: any) => f.properties.name)
        .map((f: any) => ({
          name: f.properties.name,
          address: f.properties.address_line2,
          // Generate a clickable Google Maps link using lat/lon
          mapLink: `https://www.google.com/maps/search/?api=1&query=${f.properties.lat},${f.properties.lon}`
        }));
    })
  );
}
}