Amnesia Game
===

[![React Native](https://img.shields.io/badge/react%20native-0.57.1-brightgreen.svg)](https://github.com/facebook/react-native)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/KalebPortillo/amnesia-game/blob/master/LICENSE)

Here is a quick start guide:

```
git clone git@github.com:KalebPortillo/amnesia-game.git
cd amnesia-game
yarn install
yarn run ios
```

For further setup instructions please see our [Getting Started](#getting-started) section.

## Contents

### Application Blueprint

* Always up-to-date [React Native](https://facebook.github.io/react-native/) scaffolding
* Modular and well-documented structure for application code
* [Redux](http://redux.js.org/) with [Ducks](https://github.com/erikras/ducks-modular-redux) proposal for state management
* [Reselect](http://redux.js.org/) for compute devided data
* [React Navigation](https://reactnavigation.org/) for awesome navigation with 60fps transitions
* [Redux Persist](https://github.com/rt2zz/redux-persist) Disk-persisted application state caching for offline support and snappy startup performance
* Sample app to show how to wire it all together
* [React Native Config](https://github.com/luggit/react-native-config) Multi-environment configuration (dev, staging, production) for iOS and Android
* Automagically update project version in both Android and iOS when running npm version command
* [Prettier](https://prettier.io/) for consistant code format
* Custom splash screen ready, just change the image asset

### Testing Setup

* [Jest](https://facebook.github.io/jest/) for unit testing application code and providing coverage information.
* [Enzyme](https://github.com/airbnb/enzyme) and fully mocked React Native for unit testing UI components
* Utilities for end-to-end integration testing Redux state, including side effects and asynchronous actions

## Getting started

You will need node, npm, yarn(preferably), Android Studio, Xcode, React Native CLI, and all these basic stuff setup in your machine

## Development workflow

After you have set up the project using above instructions, you can use your favorite IDE or text editor to write code, and run the application from the command line. Turn on React Native hot module reloading in the app developer menu to update your application as you code.

##### Start the application in iOS simulator
```
$ yarn ios
```

##### Start the application in Android simulator
(If using the stock emulator, the emulator must be running)
```
$ yarn android
```

##### Run unit tests
```
$ yarn test
```

##### Run tests every time code changes
```
$ yarn test:watch
```

##### Generate code coverage report
```
$ yarn coverage
```

##### Update project version
```
$ yarn version
```

For more awesome **yarn** commands, refer to [package.json](package.json) scripts section

## Debugging

For standard debugging select *Debug JS Remotely* from the React Native Development context menu (To open the context menu, press *CMD+D* in iOS or *D+D* in Android). This will open a new Chrome tab under [http://localhost:8081/debugger-ui](http://localhost:8081/debugger-ui) and prints all actions to the console.

For advanced debugging under **macOS** we suggest using the standalone [React Native Debugger](https://github.com/jhen0409/react-native-debugger), which is based on the official debugger of React Native.
It includes the React Inspector and Redux DevTools so you can inspect React views and get a detailed history of the Redux state.

You can install it via [brew](https://brew.sh/) and run it as a standalone app:
```
$ brew update && brew cask install react-native-debugger
```
> Note: Make sure you close all active chrome debugger tabs and then restart the debugger from the React Native Development context menu.

## Contributing

If you find any problems, please [open an issue](https://github.com/KalebPortillo/amnesia-game/issues/new) or submit a fix as a pull request.

We welcome new features, but for large changes let's discuss first to make sure the changes can be accepted and integrated smoothly.

## License

[MIT License](LICENSE)
