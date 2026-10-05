import { EventManagerPlugin } from '@angular/platform-browser';

export class DebounceEventPlugin extends EventManagerPlugin 
{
  override supports(eventName: string): boolean 
  {
    return eventName.includes('.debounce');
  }

  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function
  ): Function 
  {
    const listeParti = eventName.split('.');
    const baseEvent = listeParti[0];
    const delaisParse = parseInt(listeParti[2], 10);
    const delais = !isNaN(delaisParse) ? delaisParse : 300;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const listener = (event: Event) => 
    {
      if (timer)
        clearTimeout(timer);

      // Exécution après le délai imparti
      timer = setTimeout(() => handler(event), delais);
    };

    element.addEventListener(baseEvent, listener);

    // Fonction de nettoyage appelée à la destruction de l'élément
    return () => 
    {
      if (timer)
        clearTimeout(timer);

      element.removeEventListener(baseEvent, listener);
    };
  }
}