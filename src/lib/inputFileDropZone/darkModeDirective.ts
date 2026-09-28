import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from "@angular/core";

@Directive({
  selector: '[darkModeTheme]',
  standalone: true
})
export class DarkModeDirective implements OnInit, OnDestroy 
{
  private mediaQueryList: MediaQueryList;
  private themeOnChange: (event: MediaQueryListEvent) => void;

  constructor(
    private el: ElementRef,    // élément sur lequel la directive est placée
    private renderer: Renderer2 // manipuler le DOM
  ) 
  {
    this.mediaQueryList = window.matchMedia('(prefers-color-scheme: light)');
    this.themeOnChange = (event) => this.MiseAjourTheme(event.matches);
  }

  ngOnInit(): void
  {
    this.MiseAjourTheme(this.mediaQueryList.matches);
    this.mediaQueryList.addEventListener('change', this.themeOnChange);
  }

  ngOnDestroy(): void
  {
    this.mediaQueryList.removeEventListener('change', this.themeOnChange);
  }

  private MiseAjourTheme(_modeDarkTheme: boolean): void 
  {
    if (_modeDarkTheme) 
    {
      this.renderer.addClass(this.el.nativeElement, "drop-zone-dark");
      this.renderer.removeClass(this.el.nativeElement, "drop-zone-light");
    } 
    else 
    {
      this.renderer.addClass(this.el.nativeElement, "drop-zone-light");
      this.renderer.removeClass(this.el.nativeElement, "drop-zone-dark");
    }
  }
}