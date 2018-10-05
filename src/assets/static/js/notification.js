export default {
  setNotification (key, amount, name, period, time){
    if (!window.cordova) return
    return cordova.plugins.notification.local.schedule({
      id: key,
      text: "Reminder to take " + amount + "x " + name,
      every: period,
      at: time
    })
  },
  delete (ids) {
    if (!window.cordova) return
    return cordova.plugins.notification.local.cancel([...ids], function() {
            console.log("done")
          })
  },
  checkPermission (callback) {
    if(!window.cordova) {callback(true); return} 
    cordova.plugins.notification.local.hasPermission(function(granted) {
      if(granted) {
         callback(granted)
        } else {
          // IF granted == false this runs but iOS users have to grant permission in settings
          cordova.plugins.notification.local.registerPermission(function(grant){
            if(grant) {
              callback(grant)
            } else {
              callback(grant)
              }
          })
        }
    })
  }
}