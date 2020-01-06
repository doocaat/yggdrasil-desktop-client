[![Angular Logo](https://www.vectorlogo.zone/logos/angular/angular-icon.svg)](https://angular.io/) [![Electron Logo](https://www.vectorlogo.zone/logos/electronjs/electronjs-icon.svg)](https://electronjs.org/)

# !WPI!

# Introduction

(Yggdrasil network)[https://yggdrasil-network.github.io/] desktop client the project with Angular 8 (Material) and Electron (Typescript + SASS + Hot Reload) desktop applications.

# Roadmap

Application modules:
[] Web Browser - WPI
[] Yggdrasil configurations manager
[] Yggdrasil service control
[] Remote yggdrasil admin
[] Application settings

Concept dApps yggdrasil network services:
[] Search
[] Crypt currency
[] Dns service
[] Advert

screenshots
![peers](/screenshots/peers.png)
![setting](/screenshots/settings.png)
![web browser](/screenshots/webbrowser.png)

Currently runs with:

- Angular v8
- Electron v7
- Electron Builder v21

/!\ Angular 8.0 CLI needs Node 10.9 or later to work.

## Getting Started

Clone this repository locally :

``` bash
git clone https://github.com/Stanyslav/yggdrasil-desktop-client
```

Install dependencies with npm :

``` bash
npm install
```

There is an issue with `yarn` and `node_modules` that are only used in electron on the backend when the application is built by the packager. Please use `npm` as dependencies manager.


If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

``` bash
npm install -g @angular/cli
```

## Yggdrasil

Change option AdminListen in yggdrasil config (yggdrasil.conf)

```
"AdminListen": "tcp://localhost:9091"
```

Run the yggdrasil service:

```
service yggdrasil start
```

# Started

``` bash
npm start
```
wait for the tray icon to appear

## To build for development

- **in a terminal window** -> npm start

Voila! You can use your Angular + Electron app in a local development environment with hot reload !

The application code is managed by `main.ts`. In this sample, the app runs with a simple Angular App (http://localhost:4200) and an Electron window.
The Angular component contains an example of Electron and NodeJS native lib import.
You can disable "Developer Tools" by commenting `win.webContents.openDevTools();` in `main.ts`.

## Included Commands

|Command|Description|
|--|--|
|`npm start`| Build and run the app. |
|`npm run ng:serve:web`| Execute the app in the browser |
|`npm run build`| Build the app. Your built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Your built files are in the /dist folder. |
|`npm run electron:local`| Builds your application and start electron
|`npm run electron:linux`| Builds your application and creates an app consumable on linux system |
|`npm run electron:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |

**Your application is optimised. Only /dist folder and node dependencies are included in the executable.**

## You want to use a specific lib (like rxjs) in electron main thread ?

You can do this! Just by importing your library in npm dependencies (not devDependencies) with `npm install --save`. It will be loaded by electron during build phase and added to the final package. Then use your library by importing it in `main.ts` file. Easy no ?

## Browser mode

Maybe you want to execute the application in the browser with hot reload ? You can do it with `npm run ng:serve:web`.
**Note that you can't use Electron or NodeJS native libraries in this case.** Please check `providers/electron.service.ts` to watch how conditional import of electron/Native libraries is done.