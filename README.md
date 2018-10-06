# Remind Medi Mobile Application

Final version of an iOS Mobile Application for reminding user's to take their medication, and to find local pharmacies

- Please note that the notification plugin for this version of iOS (ver. 11) was broken during developement and hand-in

## Project Requirements

---

- Install Xcode
- The project requires [node.js](https://nodejs.org/en/download/)
- Install cordova globally via: `sudo npm install -g cordova`
- Install the platform via: `cordova platform add ios --save` in project directory
- Install ios-deploy tools to launch app on an iOS device from the command line `npm intall -g ios-deploy`
- Install required plugins:
  - `cordova plugin add cordova-plugin-device --save`
  - `cordova plugin add cordova-plugin-console --save`
  - `cordova plugin add cordova-plugin-dialogs --save`
  - `cordova plugin add cordova-plugin-nativestorage --save`
  - `cordova plugin add cordova-plugin-geolocation --save`
  - `cordova plugin add cordova-plugin-inappbrowser --save`
  - `cordova plugin add cordova-plugin-local-notification --save`
- Install all the development/project dependencies via: `npm install` in project root directory
- Rename .env.example to .env with a googleAPI key in order to search for pharmacies

## Code run in the command line in the project directory

With the iOS platform installed and to view in the browser (localhost:8080) once webpack has compiled.

`cordova run ios -- --lr`

**These last three can be inspected via Safari -> development toolbar**

\*Provisioning setup _re: signing in Xcode_ also required

### Run on the device which must be plugged-in and unlocked at the same time.

`cordova run ios --device`

### Run in an emulator on an apple mac. Simulate both hardware & software, here the target is set to an iPhone 6s

`cordova emulate ios --target="iPhone-6s"`

### Run a simulation on an apple mac, again an iPhone 6s.

`cordova run ios --target=“iPhone-6s”`

## Project files (found in src folder)

- index.html (js files get injected, inc .vue
- main.vue is the parent of all the other vue components (src/assets/vue)
- Static (src/static) contains assets used such as icons + images & scss/css files
  - Includes javascript files for notifications and custom functions, as well as the event listener bus.js
