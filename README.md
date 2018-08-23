# Gremlin IDE
This application is a very basic development IDE for Tinkerpop Enabled databases built using Electron and React.  With this tool you are able to perform Gremlin queries and have the data returned and displayed in one of three ways.  You are able to see it as a table, the JSON, or as a node chart built on top of http://visjs.org/.  This was my first attempt at a React and Electron App so any feedback you may have on how to improve it would be appreciated.

## Usage
To run Gremlin IDE you need to click on the gremlin-ide application that you have downloaded.  

### Configuring Connections
In order to configure the connection to the database you need to press the hamburger menu in the top right of the window.  This will bring you up a window where you are able to enter the appropriate parameters and click Save.  This will then be persisted between sessions.

![alt text](https://github.com/practicalgraph/gremlin-ide/blob/master/doc/img/setup_connections.png "Connection Configuration")

Note: Currently the error handling on incorrect database parameters does not exist so these will cause the system to crash.  

### Running Queries
In order to run Gremlin queries you need to type them into the provided textbox and either hit the `Submit` button or hit `Shift + Enter` while in the query box.  This will then fire a query to the server, return the results and display them in the provided areas.

![alt text](https://github.com/practicalgraph/gremlin-ide/blob/master/doc/img/query.png "Query")

## Known Issues
* Currently Error Handling is only minimal so many things may cause this to freeze
* Only servers returning GraphSON v2 are currently supported, others may be in the future
* Only the Mac app is currently available for download
* This has only been tested against TinkerGraph and CosmosDB

Please feel free to file any issues you may find in this repo, or better yet fix the problem and put in a PR.


## Development
This repo was cloned from this starter repo https://github.com/pbarbiero/basic-electron-react-boilerplate

### To get started:
* Run `npm install`

##### Development
* Run `npm run dev` to start webpack-dev-server. Electron will launch automatically after compilation.

##### Production
* Run `npm run package` to have webpack compile your application into `dist/bundle.js` and `dist/index.html`, and then an electron-packager run will be triggered for the current platform/arch, outputting to `builds/`
* To build the DMG file for a Mac remove all the unneeded files from the builds folder and run `npm run dist`
