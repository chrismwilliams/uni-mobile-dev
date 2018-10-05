import { device } from "device.js";

function bodyPrepend(platform) {
  let body = document.querySelector("body"),
    script = document.createElement("script");

  script.onload = function() {
    console.log("Cordova script loaded!");
  };

  script.src = `platform_cordova_files/${platform}/cordova.js`;
  body.appendChild(script);

  console.log(`${platform} platform cordova.js injected.`);
}

if (device.desktop) bodyPrepend("browser");
else if (device.android) bodyPrepend("android");
else if (device.ios) bodyPrepend("ios");
else alert("Platform not found!");
