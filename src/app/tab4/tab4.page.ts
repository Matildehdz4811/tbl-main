import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// Ionic
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
    HttpClientModule,
  ],
})
export class Tab4Page implements OnInit {

  alertas: any[] = [];
  apiUrl = 'http://localhost:3000/alertas';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerAlertas();
  }

  obtenerAlertas() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.alertas = data;
      },
      error: (err) => {
        console.error('Error cargando alertas', err);
      }
    });
  }
}
