import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Ionic standalone
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
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,   // 👈 IMPORTANTE
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem
  ]
})
export class Tab2Page implements OnInit {

  enlaces: any[] = [];
  apiUrl = 'http://localhost:3000/enlaces';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerEnlaces();
  }

  obtenerEnlaces() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.enlaces = data;
      },
      error: (err) => {
        console.error('Error cargando enlaces', err);
      }
    });
  }
}
