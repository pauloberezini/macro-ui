# At [Macro Berezini](https://macro.berezini.com/), enhance your investment strategy and potentially increase your financial returns by leveraging a comprehensive suite of analytical tools designed for the stock market and Forex trading. 
## Here's what you can access:

Economic Events Calendar — Stay ahead of market movements with an interactive calendar that not only tracks key economic events but also offers historical data analysis. This feature allows you to anticipate market trends and make more informed decisions at crucial times.

Seasonal Analytics — Gain a competitive edge with detailed day-by-day analytics for top trading instruments. By understanding and utilizing seasonal trends, you can optimize your trading strategies to better capitalize on market conditions.

Analytics for Any Stock — Access extensive data analysis for stocks from any global exchange, spanning up to 20 years. This depth of insight provides you with the historical trends and patterns needed to make more strategic long-term investments.

By using these tools, you position yourself to make smarter investment choices, harnessing data-driven insights that could lead to higher profitability compared to operating without such detailed information. Explore Macro Berezini to empower your trading and investment decisions.



## Development server
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Docker + Cloudflare Tunnel

Avoid committing tokens. Use a local env file that is ignored by git.

1) Create `.env.local`:

```
# Do not commit this file
CLOUDFLARED_TOKEN=YOUR_TUNNEL_TOKEN_HERE
```

2) Bring up the stack:

```
docker compose up -d --build
```

3) Verify locally:

```
curl -I http://localhost:3000
```

The `docker-compose.yml` is configured to read `CLOUDFLARED_TOKEN` from `.env.local` and will not start the tunnel if it is missing.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
