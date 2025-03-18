import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

interface Particle {
  text: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  angle: number;
  angularSpeed: number;
  amplitude: number;
  frequency: number;
  phase: number;
  opacity: number;
}

@Component({
  selector: 'app-animated-background',
  templateUrl: './animated-background.component.html',
  standalone:true,
  styleUrls: ['./animated-background.component.css']
})
export class AnimatedBackgroundComponent {}
