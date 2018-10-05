<template>

  <f7-page data-page="add_reminder" tabbar-labels-through>

      <div class="content-block-title">Please Enter A Name</div>
      <div class="list-block">
        <ul>
          <li>
            <div class="itemcontent">
              <div class="item-media">
                <i class="icon ion-clipboard"></i>
              </div>
              <div class="item-inner">
                <div class="item-input">
                  <input type="text" v-model.trim="name" placeholder="Name" /> 
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <f7-block class="tablets">
        <p><strong ref="num">{{numTablets}}</strong></p>
        <f7-grid no-gutter class="btngroup">
          <div @click="updateNum('sub')"><f7-icon ion="minus-circled"></f7-icon></div>
          <span>Number of tablets</span>
          <div @click="updateNum('add')"><f7-icon ion="plus-circled"></f7-icon></div>
        </f7-grid>
      </f7-block>   

      <div class="content-block-title">Select Frequency</div>
      <div class="list-block">
        <ul>
          <li>
            <div class="item-content">
              <div class="item-inner"> 
                <div class="item-input">
                  <input type="text" placeholder="Frequency" readonly="readonly" id="frequency-picker" ref="frequency" @change="frequencyChange" />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="showDays">
        <div class="content-block-title">Select The Days You Require</div>
        <div class="list-block">
          <ul>
            <li><a href="#" class="item-link smart-select">
              <select name="days" multiple v-model="smartSelect">
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title">Days</div>
                  <div class="item-after"></div>
                </div>
              </div>
            </a></li>
          </ul>
        </div>
      </div>

      <div v-if="amount > 0">
        <div class="content-block-title">Choose the time</div>
        <div class="list-block">
          <ul v-for="(index, val) in amount">
            <li :key={index}>
              <div class="item-content">
                <div class="item-media"><f7-icon ion="ios-stopwatch-outline"></f7-icon></div>
                <div class="item-inner">
                  <div class="item-title label">Alert {{index}}</div>
                  <div class="item-input">
                    <input type="time" :id="'time' + index" :key="index" v-model="times[index - 1]" @blur="checkTime($event)">
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div v-if="showStartDate">
        <div class="content-block-title">Select Start Date</div>
        <div class="list-block">
          <ul>
            <li>
              <div class="item-content">
                <div class="item-media"><f7-icon ion="calendar"></f7-icon></div>
                <div class="item-inner">
                  <div class="item-title label">Begin At</div>
                  <div class="item-input">
                    <input type="date" id="date" placeholder="Begin At" v-model="startDate">
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <f7-grid v-show="displayBtn" no-gutter>
        <f7-col width="15"></f7-col>
        <f7-col><f7-button round fill color="green" class="addbtn" @click="checkPermission">ADD REMINDER</f7-button></f7-col>
        <f7-col width="15"></f7-col>
      </f7-grid>  

      <br>
      <br>            
        
  </f7-page>

</template>

<script>
import notification from "../../static/js/notification.js";
import bus from "../../static/js/bus.js";

const moment = require("moment");

// Set object for picker values
const times = {
  Daily: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  Specific: [""]
};

export default {
  name: "add_reminder",

  data: function() {
    return {
      myApp: null,
      $: window.Dom7,
      fFrequency: null,
      name: "",
      numTablets: 1,
      frequency: "",
      amount: "",
      showDays: false,
      smartSelect: [],
      startDate: "",
      storage: [],
      notificationObj: {},
      times: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00"
      ]
    };
  },

  computed: {
    showStartDate() {
      if (this.frequency == "Daily") {
        return this.name != "";
      } else if (this.frequency == "Specific") {
        return this.name != "" && this.smartSelect.length > 0;
      } else {
        return false;
      }
    },
    displayBtn() {
      return this.showStartDate && this.startDate != "";
    }
  },

  methods: {
    onF7Init: function(f7) {
      this.myApp = f7;
      this.setPickers();
    },

    setPickers() {
      let self = this;

      self.fFrequency = this.myApp.picker({
        input: "#frequency-picker",
        rotateEffect: true,
        onClose: function(p) {
          p.cols[0].value == "Specific"
            ? (self.showDays = true)
            : (self.showDays = false);
        },
        formateValue: function(picker, values) {
          return values[1];
        },
        cols: [
          {
            textAlign: "left",
            values: ["Daily", "Specific"],
            onChange: function(picker, period) {
              if (picker.cols[1].replaceValues) {
                picker.cols[1].replaceValues(times[period]);
              }
            }
          },
          {
            values: times.Daily,
            width: 160
          }
        ]
      });
    },

    updateNum(value) {
      if (value == "add") {
        this.numTablets < 30 ? this.numTablets++ : this.numTablets;
      } else {
        this.numTablets > 1 ? this.numTablets-- : this.numTablets;
      }
    },

    randID() {
      // Generate random string for id & key
      let randNum = Math.floor(Math.random() * 2000);
      return randNum;
    },

    checkPermission() {
      notification.checkPermission(this.callback);
    },

    callback(result) {
      if (!result) {
        this.openAlert();
      } else {
        this.setReminder();
      }
    },

    openAlert() {
      this.myApp.alert(
        "This feature requires notifications to be granted. Please enable this in settings",
        "Remind Medi"
      );
    },

    setReminder() {
      // Set items and key to store
      let id = this.randID();
      let keyID = this.name + id;
      // Open new object with required key/values
      let objValue = {
        name: this.name,
        key: keyID,
        amount: this.numTablets,
        timeScale: "",
        period: "",
        ids: []
      };

      // Check date not in the past
      if (!moment(this.startDate).isSameOrAfter(moment(), "day")) {
        // Reset to today if it is
        this.startDate = moment().format("YYYY-MM-DD");
      }

      // Get node list of time(s)
      let timesArray = this.$el.querySelectorAll('input[type="time"]');

      // Get the frequency
      if (this.frequency == "Daily") {
        // Create an array
        let values = [...timesArray];
        // Just get the times
        values = values.map(time => time.value);
        // Set object timeScale and period
        objValue.timeScale = "Daily:";
        objValue.period = values.length + " times per day";

        // Loop through the times set, set the notification and push unique id to obj ids, to be used when deleting
        for (let val of values) {
          let splitVal = val.split(":");
          let timeVal = moment(this.startDate)
            .hour(splitVal[0])
            .minutes(splitVal[1])
            .toDate();
          let uniqueID = this.randID();
          objValue.ids.push(uniqueID);
          notification.setNotification(
            uniqueID,
            this.numTablets,
            this.name,
            "day",
            timeVal
          );
        }
        // Specific frequency
      } else {
        // Get the single time and split it
        let splitTime = timesArray[0].value.split(":");
        // Add the splitTime
        let time = moment(this.startDate)
          .hour(splitTime[0])
          .minutes(splitTime[1])
          .toDate();
        objValue.timeScale = "Specific:";
        // Every Day
        if (this.smartSelect.length == 7) {
          // Push id + period to object
          objValue.ids.push(id);
          objValue.period = "Every day";
          // Set the notification every day with details
          notification.setNotification(
            id,
            this.numTablets,
            this.name,
            "day",
            time
          );
          // Certain days of the week
        } else {
          objValue.period = this.smartSelect.length + " times per week";
          // Loop through all days set, get the time and set the notification per day seek for each week
          let items = [...this.smartSelect];
          for (let item of items) {
            let t = moment(this.startDate).day(item);
            t.hour(splitTime[0]).minutes(splitTime[1]);
            t = t.toDate();
            let uniqueID = this.randID();
            objValue.ids.push(uniqueID);
            notification.setNotification(
              uniqueID,
              this.numTablets,
              this.name,
              "week",
              t
            );
          }
        }
      }
      // Once finished now store it
      this.notificationObj = objValue;
      // Get the native storage
      this.getNative();
    },
    // Check if any storage set
    getNative() {
      // Browser only then store in local
      if (!window.NativeStorage) {
        this.storage = JSON.parse(localStorage.getItem("remind_medi")) || [];
        this.storage.push(this.notificationObj);
        localStorage.setItem("remind_medi", JSON.stringify(this.storage));
        this.resetData();
      } else {
        // Otherwise store natively by first checking if storage already exists
        NativeStorage.getItem("remind_medi", this.getSuccess, this.getError);
      }
    },
    // Storage found so put it in storage and call addToStorage
    getSuccess(result) {
      this.storage = result;
      this.addToStorage();
    },
    // Error/couldn't find so create a new array and call addToStorage
    getError(e) {
      // Nothing set
      if (e.code == 2) {
        this.storage = [];
        this.addToStorage();
      } else {
        console.log(e);
      }
    },
    // Add the object created to the storage array
    addToStorage() {
      let self = this;
      this.storage.push(this.notificationObj);
      // Store the item in native then reset
      NativeStorage.setItem("remind_medi", this.storage, function(result) {
        self.resetData(),
          function(e) {
            console.log("failed: " + e);
          };
      });
    },
    // Used to get the value of the picker and the value chosen
    frequencyChange() {
      this.frequency = this.fFrequency.value[0];
      if (this.frequency == "Daily") {
        this.amount = +this.fFrequency.value[1];
      } else {
        this.amount = 1;
      }
    },
    // Used to make sure the time isn't empty
    checkTime(e) {
      if (e.currentTarget.value == "") {
        let index = e.currentTarget.id;
        index = parseInt(index.replace("time", ""));
        this.resetTime(e.currentTarget, index - 1);
      }
    },
    // If time is empty just reset it
    resetTime(target, i) {
      let time = i > 1 ? "" : "0";
      time += i + 8 + ":00";
      this.times[i] = time;
      target.value = time;
    },
    // Reset all the data to original and tell home page to get new data saved
    resetData() {
      bus.$emit("saved");
      Object.assign(this.$data, this.$options.data());
      this.myApp = window.f7;
      this.setPickers();
      this.loadHome();
    },
    // Load the home tab
    loadHome() {
      this.myApp.showTab("#main-view");
    }
  }
};
</script>

<style scoped>
a.back.link {
  color: white;
}

.itemcontent {
  box-sizing: border-box;
  padding-left: 15px;
  min-height: 44px;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
}

.tablets {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
}

.tablets p {
  margin: 0px;
  width: 100%;
  height: 23px;
  text-align: center;
  margin-top: -25px;
  font-size: 20px;
  color: #ff1654;
  transition: all 0.7s;
}

.update {
  font-size: 25px;
}

.btngroup {
  width: 65%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.date {
  margin-top: -20px;
}

@keyframes changeColour {
  0% {
    background-color: #3f7d74;
  }
  50% {
    background-color: #00c4a7;
  }
  100% {
    background-color: #3f7d74;
  }
}

.addbtn {
  background-color: #3f7d74 !important;
  height: 35px;
  line-height: 35px;
  border-radius: 5px;
  animation: changeColour 6s ease-in-out infinite;
}

.clear {
  margin: auto;
  width: 70%;
}

input[type="time"] {
  height: 100%;
  min-height: 20px;
  display: block;
  text-align: right;
}

#date {
  text-align: right;
}
</style>