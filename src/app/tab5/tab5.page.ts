import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Ionic
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonAvatar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonSegment,
    IonSegmentButton,
    IonSegmentContent,
    IonSegmentView,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ]
})
export class Tab5Page implements OnInit {

  usuario: any = null;
  usuarioOriginal: any = null;
  modoEdicion: boolean = false;

  reciclajes: any[] = [];
  reciclajesMostrados: any[] = [];
  estadisticas: any[] = [];
  estadisticasMostradas: any[] = [];

  selectedSegment: string = 'first'; // por defecto muestra el perfil

  apiUrl = 'http://localhost:3000/usuario';
  apiReciclajes = 'http://localhost:3000/reciclajes';
  apiEstadisticas = 'http://localhost:3000/estadisticas';

  private batchSize = 5; // cuántos registros mostrar por carga

  // 🔧 Mapa de materiales (se sigue usando en reciclajes)
  materiales: { [key: number]: string } = {
    1: 'Plástico',
    2: 'Vidrio',
    3: 'Papel',
    4: 'Orgánico'
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuario();
    this.obtenerReciclajes();
    this.obtenerEstadisticas();
  }

  obtenerUsuario() {
    const usuarioLog = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuarioLog.id) return;

    this.http.get<any>(`${this.apiUrl}/${usuarioLog.id}`).subscribe({
      next: (data) => {
        if (data.foto) data.foto = 'data:image/jpeg;base64,' + data.foto;
        this.usuario = data;
        this.usuarioOriginal = JSON.parse(JSON.stringify(data));
      },
      error: (err) => console.error('Error al obtener usuario:', err)
    });
  }

  obtenerReciclajes() {
    const usuarioLog = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuarioLog.id) return;

    this.http.get<any[]>(`${this.apiReciclajes}/${usuarioLog.id}`).subscribe({
      next: (data) => {
        this.reciclajes = data || [];
        this.reciclajesMostrados = this.reciclajes.slice(0, this.batchSize);
      },
      error: (err) => console.error('Error al cargar reciclajes:', err)
    });
  }

  obtenerEstadisticas() {
    const usuarioLog = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuarioLog.id) return;

    this.http.get<any[]>(`${this.apiEstadisticas}/${usuarioLog.id}`).subscribe({
      next: (data) => {
        // ✅ El backend ya devuelve "material" y "total"
        this.estadisticas = data || [];
        this.estadisticasMostradas = this.estadisticas.slice(0, this.batchSize);
      },
      error: (err) => console.error('Error al cargar estadísticas:', err)
    });
  }

  cargarMasReciclajes(event: any) {
    const nextIndex = this.reciclajesMostrados.length;
    const nuevos = this.reciclajes.slice(nextIndex, nextIndex + this.batchSize);
    this.reciclajesMostrados = [...this.reciclajesMostrados, ...nuevos];
    setTimeout(() => event.target.complete(), 500);
  }

  cargarMasEstadisticas(event: any) {
    const nextIndex = this.estadisticasMostradas.length;
    const nuevos = this.estadisticas.slice(nextIndex, nextIndex + this.batchSize);
    this.estadisticasMostradas = [...this.estadisticasMostradas, ...nuevos];
    setTimeout(() => event.target.complete(), 500);
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  cancelarEdicion() {
    this.usuario = JSON.parse(JSON.stringify(this.usuarioOriginal));
    this.modoEdicion = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.usuario.foto = (reader.result as string).split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  guardarCambios() {
    const usuarioLog = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuarioLog.id) return;

    const datos = {
      nombre: this.usuario.nombre || '',
      apellidos: this.usuario.apellidos || '',
      email: this.usuario.email || '',
      telefono: this.usuario.telefono || '',
      password: this.usuario.password || '',
      foto: this.usuario.foto ? this.usuario.foto.split(',')[1] || this.usuario.foto : null
    };

    this.http.put(`${this.apiUrl}/${usuarioLog.id}`, datos).subscribe({
      next: (res: any) => {
        alert('✅ Cambios guardados en MySQL');
        if (res.usuario) {
          if (res.usuario.foto) res.usuario.foto = 'data:image/jpeg;base64,' + res.usuario.foto;
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
          this.usuario = res.usuario;
          this.usuarioOriginal = JSON.parse(JSON.stringify(res.usuario));
        }
        this.modoEdicion = false;
      },
      error: (err) => {
        console.error('Error al guardar cambios:', err);
        alert('❌ Error al guardar');
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  }
}
