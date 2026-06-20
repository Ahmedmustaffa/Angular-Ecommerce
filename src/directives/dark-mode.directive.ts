import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDarkMode]',
  standalone: true
})
export class DarkModeDirective {
  private isDark = false;

  @HostListener('click') onClick() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}