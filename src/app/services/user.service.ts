import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Cambia localhost por tu IP si pruebas en un celular real
  private API_URL = 'http://localhost:3000';
  public usuarioSeleccionado: any;

  constructor(private http: HttpClient) { }

  // Obtener todos (para el Admin)
  getTodosLosUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/admin/usuarios`);
  }

  // Actualizar usuario (usando tu ruta PUT /usuario/:id)
  actualizarUsuario(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.API_URL}/usuario/${id}`, datos);
  }
}
