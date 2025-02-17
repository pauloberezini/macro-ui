import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="scene">
      <div class="planet">
        <div class="crater"></div>
        <div class="crater"></div>
        <div class="crater"></div>
        <div class="crater"></div>
        <div class="crater"></div>
        <div class="rover">
          <div class="body"></div>
          <div class="wheels"></div>
          <div class="trace"></div>
        </div>
        <div class="flag">404</div>
      </div>
      <div class="message">
        <p>There is no life here, try to find
          <a href="https://macro.berezini.com">something else</a>.
        </p>
      </div>
    </div>
  `,
  standalone: true,
  styles: [`
    /* General styles */
    body {
      background: #212549;
      font-size: 62.5%;
      font-family: sans-serif;
      padding: 0;
      margin: 0;
    }

    .scene {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .planet {
      position: relative;
      width: 30em;
      height: 30em;
      background: #ddd;
      border-radius: 50%;
      box-shadow: inset -1.6em 0 0 0 #ccc, 0 0 1em 0 #ccc;
    }

    /* Craters */
    .crater {
      position: absolute;
      background: #999;
      border-radius: 50%;
      box-shadow: inset 0.5em 0 0.1em 0 #777, -0.1em 0 0 0.1em #eee, 0.4em 0 0.2em 0 #ccc;
    }
    .crater:nth-child(1) { left: 5.5em; top: 11em; width: 7.5em; height: 8em; }
    .crater:nth-child(2) { left: 16.2em; top: 25em; width: 4em; height: 2.8em; transform: rotate(-22deg); }
    .crater:nth-child(3) { left: 25.4em; top: 17em; width: 2em; height: 3em; transform: rotate(12deg); }
    .crater:nth-child(4) { left: 24.4em; top: 24.7em; width: 0.8em; height: 3em; transform: rotate(48deg); }
    .crater:nth-child(5) { left: 27.4em; top: 5.6em; width: 0.8em; height: 3.6em; transform: rotate(-31deg); }

    /* Rover */
    .rover {
      position: absolute;
      transform: rotate(110deg);
      left: 18.7em;
      top: 4.8em;
    }

    .body {
      position: absolute;
      width: 0.9em;
      height: 1.5em;
      background: #fff;
      border-radius: 0.3em;
      box-shadow: -0.1em 0 0 0 #ccc;
    }

    .wheels {
      position: absolute;
      left: -0.3em;
    }

    .wheels:before, .wheels:after {
      content: "";
      position: absolute;
      background: #111;
      width: 1.4em;
      height: 0.6em;
      border-radius: 0.2em;
    }

    .wheels:after { top: 0.9em; }
    .wheels:before { top: 0; }

    .trace {
      position: absolute;
      left: -0.6em;
      top: 1.5em;
      transform: rotate(-24deg);
    }

    /* Flag */
    .flag {
      position: absolute;
      background: #bb0000;
      padding: 0.2em 0.3em;
      color: #eee;
      border-radius: 0 0.1em 0.1em 0;
      left: 5em;
      transform: rotate(-32deg);
    }

    .flag:before {
      content: "";
      position: absolute;
      width: 0.2em;
      height: 2.7em;
      left: -0.1em;
      top: 0;
      background: #444;
    }

    /* Message */
    .message {
      position: absolute;
      color: #ddd;
      top: 40em;
      width: 100%;
      text-align: center;
      font-size: 1.6em;
    }

    .message a {
      color: inherit;
      text-decoration: none;
      border-bottom: 0.1rem dotted #999;
    }
  `]
})
export class NotFoundComponent { }
