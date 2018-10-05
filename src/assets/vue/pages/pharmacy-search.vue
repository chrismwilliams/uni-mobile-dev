<template>

  <f7-page pull-to-refresh @ptr:refresh="onRefresh" @ptr:pullstart="startRefresh"  @ptr:done="endRefresh" data-page="pharm_search" tabbar-labels-through>
    <div class="arrow">
      <transition name="fade">
        <f7-icon v-show="!refreshing" ion="arrow-down-a"><p>Pull to refresh</p></f7-icon>
      </transition>
    </div>

    <div v-if="showWelcome" class="center_div welcome">
          <i class='icon ion-compass'></i>
          <h4>To start your search</h4>
    </div>
    <div v-else>
      <f7-block class="title">
        Find your local pharmacy
      </f7-block>
      <div class="img_container"><img src="../../static/images/google_img.png" alt="Google logo"></div>
    </div>

    <template v-if="!showPlaceError">
      <f7-block id="places" v-if="!showLocError">
        <f7-card v-for="(result, index) in results" :key="index">
          <f7-card-header>{{ result.name }}</f7-card-header>
          <f7-card-content class="content"><i class='icon ion-home'></i> {{ result.formatted_address }} <br><br> <span v-if="result.international_phone_number != ''" class="number" @click="openPhone(result.international_phone_number)"><i class='icon ion-ios-telephone'></i> {{ result.formatted_phone_number }}</span> </f7-card-content>
          <f7-card-content><strong>Distance:</strong> {{ distance(result.geometry.location) }} mi. </f7-card-content>
          <div class="card-footer" :style="{color: textStyle(result.opening_hours)}">{{ returntxt(result.opening_hours) }}
          <a @click="openLink(result.url)" class="link">Open Map</a>
          </div>   
        </f7-card>
      </f7-block>
      <div v-else>
        <div class="spacer"></div>
        <div class="center_div">
          <h3>Oops something went wrong finding your location</h3>
          <f7-block><p>Please enable location services if disabled</p></f7-block>
        </div>    
      </div>
    </template>
    <template v-else>
      <div class="spacer"></div>
      <div class="center_div">
        <h3>Oops something went wrong</h3>
        <f7-block><p>You may have insufficient bandwidth or data has been turned off</p></f7-block>
      </div>
    </template>
  </f7-page>  
</template>

<script>
const googleAPI = process.env.GOOGLE_API;
// Google node with api key
const googleMaps = require("@google/maps").createClient({
  key: googleAPI || ""
});
// Library to handle distances
const haversine = require("haversine-js");

export default {
  name: "pharm_search",
  // All the data required for component
  data: function() {
    return {
      loc: { latitude: "undefined", longitude: "undefined" },
      results: [],
      placeID: [],
      havOptions: {
        radius: haversine.EARTH.MILE
      },
      showLocError: false,
      showPlaceError: false,
      refreshing: false,
      showWelcome: true
    };
  },

  methods: {
    // If getting location services is succesfull
    onSuccess(position) {
      let self = this;
      // Don't show error
      self.showLocError = false;

      self.loc.latitude = position.coords.latitude;
      self.loc.longitude = position.coords.longitude;

      // Search for local pharmacies based on user location
      googleMaps.placesNearby(
        {
          language: "en",
          location: [self.loc.latitude, self.loc.longitude],
          rankby: "distance",
          type: "pharmacy"
        },
        function(err, response) {
          if (!err) {
            self.showPlaceError = false;
            // Pass response to lookUpPlace
            self.lookUpPlace(response.json.results);
          } else {
            // Error getting data from Google
            self.showPlaceError = true;
          }
        }
      );
    },
    // Used to get more information of the place with the unique id passed
    lookUpPlace(result) {
      let self = this;
      let places = result;
      // Loop through each result
      for (let p of places) {
        // New search which returns more details
        googleMaps.place(
          {
            placeid: p.place_id
          },
          function(err, response) {
            if (!err) {
              // Push all the data to the results array
              self.results.push(response.json.result);
            }
          }
        );
      }
    },
    // Error getting user location
    onError(error) {
      this.showLocError = true;
    },
    // Open inapp browser at the url when a user clicks on a card
    openLink(url) {
      cordova.InAppBrowser.open(url, "_blank", "location=no");
    },
    // Open the option to call the number upon clicking, remove whitespace just in case
    openPhone(num) {
      cordova.InAppBrowser.open("tel:" + num.replace(/\s/g, ""), "_system");
    },
    // Used to style the place open/closed/unknown text
    textStyle(place) {
      if (place == null) {
        return "orange";
      } else if (place.open_now) {
        return "mediumseagreen";
      } else {
        return "red";
      }
    },
    // Used to set the text for place current opening situation
    returntxt(place) {
      if (place == null) {
        return "Opening times unknown";
      } else if (place.open_now) {
        return "Open Now";
      } else {
        return "Closed";
      }
    },
    // Used to work out the distance between the user's device and the place location passed
    distance(location) {
      let place = {
        latitude: location.lat,
        longitude: location.lng
      };
      return haversine(this.loc, place, this.havOptions).toFixed(2);
    },
    // Used to refresh the results with a timeout to stop it being spammed
    onRefresh(event, done) {
      let self = this;
      self.results.splice(0, this.results.length);
      setTimeout(function() {
        navigator.geolocation.getCurrentPosition(self.onSuccess, self.onError);
        done();
      }, 2000);
    },
    // Hide the top message and arrow when refreshing
    startRefresh() {
      (this.refreshing = true), (this.showWelcome = false);
    },
    // Refreshing the page done so show icon again
    endRefresh() {
      this.refreshing = false;
    }
  }
};
</script>

<style scoped>
.arrow {
  height: 40px;
  text-align: center;
  margin-bottom: 30px;
}

.title {
  padding-left: 35px;
  margin-bottom: 0.5rem;
}

.img_container {
  padding: 0 35px;
}

.number {
  color: #007aff;
}

.icon {
  color: #808080;
}

.arrow {
  margin-top: -3px;
}

.arrow i.icon::before {
  font-size: medium;
}

.arrow p {
  margin: 0;
  margin-top: -7px;
  font-size: 12px;
}

i.icon::before {
  font-size: large;
}

.img_container img {
  width: 50%;
}

.spacer {
  margin-top: 80px;
}

h3 {
  margin: 0 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.center_div {
  text-align: center;
}

.welcome h4 {
  margin-top: 0px;
  color: #213442;
}

.welcome i {
  margin-top: -7px;
  color: #213442;
}

.welcome i.icon::before {
  font-size: xx-large;
}
</style>