export interface OpenMeteoCurrent {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export interface OpenMeteoCurrentExtended {
  relative_humidity_2m: number;
  time?: string;
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current_weather: OpenMeteoCurrent;
  current?: OpenMeteoCurrentExtended;
}