import { Component, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CronometroService } from './cronometro.service'; // Importa el servicio creado

/**
 * Componente principal para mostrar el cronómetro. 
 * Asume el nombre 'Service' basado en la estructura de archivos del usuario.
 * Se encarga de la interfaz de usuario y delega la lógica del cronómetro al servicio.
 */
@Component({
  selector: 'app-service',
  // Es necesario importar AsyncPipe para usar el pipe 'async' en el template
  imports: [AsyncPipe], 
  templateUrl: './service.html',
  styleUrl: './service.css',
  standalone: true // Asumiendo que usas componentes Standalone (por la propiedad 'imports')
})
export class Service implements OnDestroy {

  /**
   * Inyección de dependencias: El servicio se inyecta y se hace público 
   * para que el template (service.html) pueda acceder a sus métodos y observables.
   */
  constructor(public cronometroService: CronometroService) {}

  /**
   * Getter que simplifica el acceso al estado del cronómetro para la vista.
   */
  get estaCorriendo(): boolean {
    return this.cronometroService.estaCorriendo;
  }

  /**
   * Ciclo de vida: Asegura la desuscripción al destruir el componente.
   * Esto es crucial para prevenir fugas de memoria si el componente se desmonta.
   */
  ngOnDestroy(): void {
    // Llama al método del servicio para detener el cronómetro y limpiar el interval
    this.cronometroService.reiniciar();
  }
}