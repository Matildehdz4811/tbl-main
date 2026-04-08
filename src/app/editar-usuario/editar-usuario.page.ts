import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🔥 Necesario para [(ngModel)]
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] // 🔥 Agregamos los 3 necesarios
})
export class EditarUsuarioPage implements OnInit {
  // 🔥 Definimos la propiedad usuario para que el HTML la reconozca
  usuario: any = {
    nombre: '',
    apellidos: '',
    curp: '',
    foto: null
  };

  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Si hay un usuario seleccionado en el servicio, lo cargamos
    if (this.userService.usuarioSeleccionado) {
      this.usuario = this.userService.usuarioSeleccionado;
    }
  }

  guardar() {
    this.userService.actualizarUsuario(this.usuario.id, this.usuario).subscribe(async res => {
      const toast = await this.toastController.create({
        message: 'Usuario actualizado',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.navCtrl.back();
    });
  }
}
