import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Ionic standalone
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonItem,
  IonLabel, IonSelect, IonSelectOption, IonInput, IonButton,
  IonIcon
} from '@ionic/angular/standalone';

// Íconos
import { addIcons } from 'ionicons';
import { cameraOutline, imageOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonItem,
    IonLabel, IonSelect, IonSelectOption, IonInput, IonButton,
    IonIcon
  ]
})
export class Tab1Page {

  material: number | 'otro' | null = null;
  otroMaterial: string = '';
  cantidad: number | null = null;
  fotoBase64: string | undefined = undefined;

  API = 'http://localhost:3000';

  constructor(
    private toastController: ToastController,
    private http: HttpClient
  ) {
    addIcons({ cameraOutline, imageOutline });
  }

  obtenerPlaceholderCantidad(): string {
    if (this.material === 2) return 'Ej. 5 botellas';
    if (this.material === 3 || this.material === 4) return 'Ej. 2 kg';
    return 'Ingresa la cantidad';
  }

  // 📸 TOMAR FOTO
  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      this.fotoBase64 = image.base64String || undefined;
    } catch (error) {
      console.error('Error cámara', error);
    }
  }

  // 🖼️ GALERÍA
  async elegirDeGaleria() {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });
      this.fotoBase64 = image.base64String || undefined;
    } catch (error) {
      console.error('Error galería', error);
    }
  }

  // 🔥 REGISTRAR
  async registrarReciclaje() {
    if (!this.material || !this.cantidad || this.cantidad <= 0) {
      this.mostrarMensaje('Completa material y cantidad válidos', 'warning');
      return;
    }

    // ✅ Validar que si es "otro", se haya escrito algo
    if (this.material === 'otro' && !this.otroMaterial.trim()) {
      this.mostrarMensaje('Especifica el material en "Otro"', 'warning');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    const datos = {
      residuo_id: this.material === 'otro' ? null : this.material,
      cantidad: this.cantidad,
      usuario_id: usuario.id || null,
      otro_material: this.material === 'otro' ? this.otroMaterial.trim() : null,
      foto: this.fotoBase64 || null
    };

    this.http.post(`${this.API}/reciclaje`, datos).subscribe({
      next: () => {
        this.mostrarMensaje('✅ Guardado en MySQL', 'success');
        // Resetear formulario
        this.material = null;
        this.otroMaterial = '';
        this.cantidad = null;
        this.fotoBase64 = undefined;
      },
      error: (err) => {
        console.error('Error al guardar reciclaje:', err);
        this.mostrarMensaje('❌ Error al guardar', 'danger');
      }
    });
  }

  // 🔔 TOAST
  async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}
