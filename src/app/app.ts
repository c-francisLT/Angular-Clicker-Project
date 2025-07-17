import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Clicker } from './clicker.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Clicker],
  template: "<clicker-check></clicker-check>",
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-clicker-game');
}
