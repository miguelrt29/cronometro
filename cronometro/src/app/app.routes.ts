import { Routes } from '@angular/router';
// 1. Importa tu componente 'Service'
import { Service } from './service/service'; 

export const routes: Routes = [
    /**
     * Define la ruta principal (path: '') para cargar tu componente Service.
     * Al ser standalone, el componente se importa directamente aquí.
     */
    { 
        path: '', 
        component: Service, 
        title: 'Cronómetro Observable Frío' 
    },
    
    // Ruta de comodín para cualquier otra URL no definida (opcional)
    { 
        path: '**', 
        redirectTo: '' 
    }
];