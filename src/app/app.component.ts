import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClockService } from './shared/internal-service/clock.service';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  clock = inject(ClockService);
  constructor() { }

}
