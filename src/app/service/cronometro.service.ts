import { Injectable } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';

/**
 * Servicio que gestiona el cronómetro utilizando el patrón Observable Frío.
 * Un Observable Frío ('new Observable') no comienza su trabajo (el setInterval)
 * hasta que alguien se suscribe a él, lo cual cumple con el requisito.
 */
@Injectable({
  providedIn: 'root' // Hace el servicio Singleton y disponible globalmente
})
export class CronometroService {

  // Subject: Se usa como puente para emitir los valores del contador 
  // a todos los componentes que estén observando 'contador$'. 
  // Esto permite que múltiples componentes vean el mismo valor.
  private contadorSubject = new Subject<number>();
  public contador$ = this.contadorSubject.asObservable(); // Observable público para la vista

  private count: number = 0; // Almacena el valor actual del contador
  private currentSubscription: Subscription | null = null; // Guarda la suscripción para control
  
  /**
   * 🥶 Definición del Observable Frío.
   * Se construye con 'new Observable' y contiene la función productora (setInterval).
   * Esta función productora *solo* se ejecuta cuando se llama a .subscribe().
   */
  private coldObservable: Observable<number> = new Observable<number>(observer => {
      
      let currentCount = this.count; // Inicializa el conteo desde el valor actual

      // PRODUCER: El temporizador que emite valores cada segundo
      const intervalId = setInterval(() => {
        currentCount++;
        observer.next(currentCount); // Emite el nuevo valor al suscriptor
      }, 1000); // 1000 ms = 1 segundo

      // 🧹 CLEANUP FUNCTION: Se llama al desuscribirse (unsubscribe) o al completarse.
      // Detiene la función setInterval para liberar recursos.
      return () => {
        clearInterval(intervalId);
        console.log('Servicio: Observable Frío detenido y recursos liberados (Cleanup)');
      };
  });
  
  constructor() {}

  /**
   * Inicia el cronómetro.
   * 1. Se suscribe al Observable Frío, lo que activa el setInterval.
   * 2. Guarda la suscripción para poder detenerla más tarde.
   */
  public empezar(): void {
    if (this.currentSubscription) {
      // Evita suscripciones duplicadas
      return; 
    }
    
    // Suscripción: El Observable Frío empieza a emitir aquí
    this.currentSubscription = this.coldObservable.subscribe(valor => {
      this.count = valor;
      this.contadorSubject.next(this.count); // Emite el valor a la vista
    });
    console.log('Servicio: Cronómetro Iniciado (Suscripción activa)');
  }

  /**
   * Detiene el cronómetro y lo resetea a 0.
   * 1. Llama a .unsubscribe(), lo que activa la función cleanup del Observable Frío.
   * 2. Reinicia el contador visual y emite el valor 0.
   */
  public reiniciar(): void {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe(); // Detiene el Observable y el setInterval
      this.currentSubscription = null;
    }
    
    this.count = 0;
    this.contadorSubject.next(this.count); // Emite 0 para reiniciar la vista
    console.log('Servicio: Cronómetro Reiniciado y Desuscrito');
  }
  
  /**
   * Getter para verificar si el cronómetro está activo (usado para deshabilitar el botón "empezar").
   */
  public get estaCorriendo(): boolean {
    return !!this.currentSubscription;
  }
}