import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () => import('./tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () => import('./tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () => import('./tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'tab4',
        loadComponent: () => import('./tab4/tab4.page').then((m) => m.Tab4Page),
      },
      {
        path: 'tab5',
        loadComponent: () => import('./tab5/tab5.page').then((m) => m.Tab5Page),
      },
      // Ruta para ver la lista de usuarios dentro de los tabs (Opcional)
      {
        path: 'lista-usuarios',
        loadComponent: () => import('./lista-usuarios/lista-usuarios.page').then( m => m.ListaUsuariosPage)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  // RUTAS DE ADMINISTRACIÓN (Pantalla completa)
  {
    path: 'lista-usuarios',
    loadComponent: () => import('./lista-usuarios/lista-usuarios.page').then( m => m.ListaUsuariosPage)
  },
  {
    path: 'editar-usuario',
    loadComponent: () => import('./editar-usuario/editar-usuario.page').then( m => m.EditarUsuarioPage)
  },
  // RUTA POR DEFECTO: Si no estás logueado, mandarlo al login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // Captura cualquier ruta inexistente y manda al login o tabs
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
