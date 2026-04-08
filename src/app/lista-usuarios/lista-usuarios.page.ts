import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 🔥 Necesario para *ngFor
import { IonicModule } from '@ionic/angular'; // 🔥 Importación rápida para todos los componentes
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
  standalone: true, // Asegúrate de que diga true
  imports: [IonicModule, CommonModule] // 🔥 Agregamos IonicModule y CommonModule aquí
})
export class ListaUsuariosPage implements OnInit {
  usuarios: any[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ionViewWillEnter() {
    this.cargarUsuarios();
  }

  ngOnInit() {}

  cargarUsuarios() {
    this.userService.getTodosLosUsuarios().subscribe(res => {
      this.usuarios = res;
    });
  }

  irAEditar(u: any) {
    this.userService.usuarioSeleccionado = u;
    this.router.navigate(['/editar-usuario']);
  }
}
