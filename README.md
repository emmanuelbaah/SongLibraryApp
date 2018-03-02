# SongLibraryApp

## Requirements
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)

## Setup

Please make sure to have Node.js version >= 8.9.4 (preferably LTS version).  
Yarn will also be needed for packages.

To install required packages:
```
yarn install
```

## Run

To run the development mode servers:
```
yarn sd
```

This should start up _tsc_ in watchmode to actively compile all TypeScript files in the `./src` folder excluding the `./src/public` subfolder (which is for the front-end code bundled by the Angular CLI).

To run only the live UI dev:
```
ng s
```

This should start a live web server for just the front-end code using Angular CLI. Visit the stated address to view the pages (typically [localhost:4000](localhost:4000)).