import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Ionic
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ],
})
export class Tab3Page implements OnInit {

  lat: number = 0;
  lng: number = 0;
  nombreUbicacion: string = '';
  mapaUrl: SafeResourceUrl | null = null;

  apiUrl = 'http://localhost:3000/ubicacion';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.obtenerUbicacion();
  }

  obtenerUbicacion() {
  this.http.get<any>(this.apiUrl).subscribe({
    next: (data) => {
      this.lat = data.lat;
      this.lng = data.lng;
      this.nombreUbicacion = data.nombre;

      // Vista satelital con etiquetas urbanas
      const url = `https://www.google.com/maps?q=${this.lat},${this.lng}&z=36&output=embed&layer=s`;
      this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    },
    error: (err) => console.error(err)
  });
}

abrirEnGoogleMaps() {
  const url = `https://www.google.com/maps?q=${this.lat},${this.lng}&z=36&layer=s`;
  window.open(url, '_blank');
}
}
