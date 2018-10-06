<template>
  <f7-page data-page="home" tabbar-labels-through>

    <div class="welcome center_div">
      <f7-block-title>Welcome to Remind Medi</f7-block-title>
    </div>

    <div v-if="items.length > 0">
      <f7-block class="list_heading">
        <f7-icon ion="ios-bell"></f7-icon>Your reminders
      </f7-block>
      <f7-list media-list>
        <f7-list-item swipeout
          v-for="item in items"
          :key="item.key"
          :title="item.name"
          :subtitle="'Quantity: ' + item.amount + 'x'"
          :text="item.timeScale + ' ' + item.period"
          media="<i class='icon ion-ios-medical'></i>"
          @swipeout:deleted="onSwipeoutDeleted($event,item)"
        >
          <f7-swipeout-actions right>
            <f7-swipeout-button delete>Delete</f7-swipeout-button>
          </f7-swipeout-actions>
        </f7-list-item>
      </f7-list>
    </div>

    <div v-else class="center_div">
      <f7-block-title class="home_message"><f7-icon ion="speakerphone"></f7-icon>You haven't set any notifications!</f7-block-title>
      <br>
      <f7-block>
        <p>Head over to the add page to add a new reminder</p>
      </f7-block>
      <f7-block>
        <p>Or the search page to find your local pharmacy</p>
      </f7-block>
    </div>

    <br>
    <!--Used in testing
    <f7-grid no-gutter>
      <f7-col width="20"></f7-col>
      <f7-col><f7-button round fill color="red" @click="clearAll">Clear All</f7-button></f7-col>
      <f7-col width="20"></f7-col>
    </f7-grid> -->                          
  </f7-page>

</template>

<script>
import notification from "../../static/js/notification.js";
import bus from "../../static/js/bus.js";

export default {
  name: "home",
  data() {
    return {
      items: [],
      test: null
    };
  },
  // App mounted and ready so set listener and get items stored
  mounted() {
    bus.$on("saved", e => this.getStoredItems());
    this.$nextTick(() => {
      this.getStoredItems();
    });
  },

  methods: {
    // Get all the reminders user has stored
    getStoredItems() {
      // Browser Only
      if (!window.cordova) {
        this.items = JSON.parse(localStorage.getItem("remind_medi")) || [];
        return;
      }
      // Get native result or delay until ready
      if (typeof NativeStorage === "undefined") {
        this.delayNativeCall();
      } else {
        NativeStorage.getItem("remind_medi", this.success, this.error);
      }
    },
    // Put result in items array
    success(result) {
      this.items = result;
    },
    // Error
    error(e) {
      if (e.code == 2) {
        // Assign items array to empty
        this.items = [];
      }
    },
    // Called when reminder deleted
    onSwipeoutDeleted(e, it) {
      // Delect notification(s)
      notification.delete(it.ids);

      // Delect from items array
      let pos = this.items.indexOf(it);
      this.items.splice(pos, 1);

      // Update Storage
      // Browser only
      if (!window.NativeStorage) {
        localStorage.setItem("remind_medi", JSON.stringify(this.items));
        // Update native
      } else {
        NativeStorage.setItem(
          "remind_medi",
          this.items,
          result => console.log(result),
          err => console.log(err)
        );
      }
    },
    // Used in testing
    clearAll() {
      NativeStorage.clear(
        function(result) {
          console.log(result);
        },
        function(e) {
          console.log(e);
        }
      );
      if (window.cordova) {
        cordova.plugins.notification.local.clearAll(function() {
          console.log("done");
        });
      }
    },
    // Delay call to getStoredItems
    delayNativeCall() {
      setTimeout(() => {
        this.getStoredItems();
      }, 200);
    }
  }
};
</script>

<style>
.home_message,
.list_heading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  color: #213442;
  font-size: 1.15em;
}

.list_heading {
  width: 80%;
  margin-top: 0;
  font-size: 1.3em;
}

.list_heading .icon,
.home_message .icon {
  color: #213442;
  margin-right: 0.7rem;
}

.home_message .icon {
  margin-right: 0.5rem;
}

.list_heading i.icon::before,
.home_message i.icon::before {
  font-size: x-large;
}

.center_div {
  text-align: center;
}

.welcome {
  margin-bottom: 70px;
}

.swipeout .item-inner {
  border-right: 3px solid #f44336;
}

.icon {
  color: #247ba0;
}

.sliding a,
.sliding i {
  color: white;
}

a.swipeout-delete {
  background: #f44336 !important;
}
</style>