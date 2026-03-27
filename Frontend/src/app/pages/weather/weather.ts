import { Component } from '@angular/core';
import { WeatherService } from '../../core/services/weather-service/weather';
import { OpenMeteoResponse } from '../../core/interfaces/weather.interface';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { PAGES_IMPORTS } from '../pages.imports';
import { AlertService } from '../../core/services/alert-service/alert';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './weather.html',
  styleUrls: ['./weather.scss'],
})
export class WeatherComponent {
  city = '';
  displayCity = '';
  weather$: Observable<OpenMeteoResponse | null> = of(null);
  error = '';
  isLoading = false;
  // Add to your class properties
  mapUrl: SafeResourceUrl | null = null;
  constructor(
    public weatherService: WeatherService,
    private alertService: AlertService,
    private sanitizer: DomSanitizer
  ) {
  }

  // fetchWeather(city: string) {
  //   if (!city.trim()) return;

  //   this.error = '';
  //   this.isLoading = true;

  //   this.weather$ = this.weatherService.getCityCoordinates(city).pipe(
  //     switchMap(geoData => {
  //       this.displayCity = geoData.name;
  //       return this.weatherService.getCurrentWeather(geoData.lat, geoData.lon);
  //     }),
  //     tap(() => {
  //       this.isLoading = false;
  //       // Clean one-liner
  //       this.alertService.success('Search Successful', `Found data for ${this.displayCity}`);
  //     }),
  //     catchError(err => {
  //       this.isLoading = false;
  //       const msg = err.message || 'City not found';

  //       // Clean one-liner for error
  //       this.alertService.error('Error', msg);

  //       return of(null);
  //     })
  //   );
  // }
  fetchWeather(city: string) {
    if (!city.trim()) return;
    this.error = '';
    this.isLoading = true;
    this.mapUrl = null;

    this.weather$ = this.weatherService.getCityCoordinates(city).pipe(
      switchMap(geoData => {
        this.displayCity = geoData.name;
        const delta = 0.02;
        const bbox = `${geoData.lon - delta},${geoData.lat - delta},${geoData.lon + delta},${geoData.lat + delta}`;

        // Construct OpenStreetMap Embed URL
        const rawUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${geoData.lat},${geoData.lon}`;

        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);

        return this.weatherService.getCurrentWeather(geoData.lat, geoData.lon);
      }),
      tap(() => {
        this.isLoading = false;
        this.alertService.success('Search Successful', `Found data for ${this.displayCity}`);
      }),
      catchError(err => {
        this.isLoading = false;
        const msg = err.message || 'City not found';
        this.alertService.error('Error', msg);
        return of(null);
      })
    );
  }
}