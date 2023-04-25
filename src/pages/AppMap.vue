<template>
  <div>
    <div>
      <div class="flex items-center justify-between">
        <div class="flex items-center ">
          <span class="q-pa-md text-h6">{{ date }}</span>

          <q-btn icon="event" round color="primary">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
<!--              <q-date :options="getDates()" v-model="date">-->
              <q-date  :events="getDates()" v-model="date">
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </div>
        <div>
<!--          <q-toggle @click="addMode?addModeActive:null" class="q-pr-md" v-model="addMode">Add Mode</q-toggle>-->
          <q-toggle @click="addModeActive" class="q-ma-sm" v-model="addMode">Add Mode</q-toggle>
          <q-toggle @click="editModeActive" class="q-ma-sm" v-model="editMode">Edit Mode</q-toggle>
          <q-btn class="q-ma-sm" @click="list = true" color="primary">
            Migrations List
          </q-btn>
          <q-btn class="q-ma-sm" @click="showMigrations" color="primary">
            Show migrations
          </q-btn>
        </div>
        <!--        <q-toggle @input="change" v-model="addMode">Admin Mode</q-toggle>-->

      </div>
    </div>
    <GMapMap @click="newMigration"
             :center="center"
             :zoom="8"
             class="map"
    >
      <div v-if="migrations">
        <GMapMarker
          :key="index"
          :draggable="editMode"
          @drag="dragMarker"
          @dragend="setM(m)"
          v-for="(m, index) in filterDate(migrations)"
          :icon="{
          url: m.Animal.icon,
          scaledSize: {
            height: 40,
            width: 40
          }
        }"
          :position="{
          lat: m.positionLat,
          lng: m.positionLng,
        }"
          :title="m.animal_id.toString()"
          :clickable="true"
          @click="toggleInfo(m, index)"
        >
        </GMapMarker>
      </div>
      >
      <GMapInfoWindow
        :options="infoOptions"
        :position="infoPosition"
        :opened="infoOpened"
        @closeclick="infoOpened=false">
        <!--        <h5 class="text-primary">{{ infoContent?.animal_id }}</h5>-->
        <img width="150" :src="infoContent?.Animal?.image" alt="">
        <p>Animal: {{ infoContent?.Animal?.name }}</p>
        <p>Quantity: {{ infoContent?.quantity }}</p>
<!--        <q-btn @click="migrate(infoContent)" color="red">-->
<!--          Migrate-->
<!--        </q-btn>-->
        <q-dialog full-height full-width v-model="list">
          <div  class="bg-white">
            <h2 class="text-h6 text-center">Migrations List</h2>
            <p>Are you sure you want to delete migration {{currentMarker?.id}}</p>
          </div>
        </q-dialog>
        <q-dialog full-height full-width v-model="list">
          <div  class="bg-white">
            <h2 class="text-h6 text-center">Migrations List</h2>
         <MigrationTable :migrations="migrations"/>
          </div>
        </q-dialog>
        <q-dialog v-model="migrationDialog">
         <MigrationDialog @hide="hide" @exit="editMode = false" :edit="editMode" :migration="currentMarker"/>
        </q-dialog>
      </GMapInfoWindow>
    </GMapMap>
    <q-dialog v-model="autoFillDialog">
      <div class="bg-white q-pa-md" style="width: 320px;">
        <h2 class="text-h6">This day don't have any migration data.</h2>
        <p>
          Do you want to fill it with the last migration data, and later you can change positions of animals in edit mode</p>
        <div class="flex justify-between">
          <q-btn v-close-popup @click="autoFill" color="green" label="Confirm AutoFill"/>
          <q-btn v-close-popup color="grey" label="Leave empty"/>
        </div>
      </div>
    </q-dialog>
    <q-dialog v-model="addModeDialog">
      <div class="bg-white q-pa-md">
        <h2 class="text-h5">
          Info
        </h2>
        <p>
          For using addMode just click on the map to add new migration!
        </p>
      </div>
    </q-dialog>
    <q-dialog v-model="editModeDialog">
      <div class="bg-white q-pa-md">
        <h2 class="text-h5">
          Info
        </h2>
        <p>
          For using editMode just drag the marker to new position!
        </p>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import moment from "moment";
import store from "src/myStore";
import MigrationTable from "components/MigrationTable.vue";
import MigrationDialog from "components/MigrationDialog.vue";

export default {
  name: "GoogleMap",
  components: {MigrationDialog, MigrationTable},
  data() {
    return {
      editMode: false,
      addMode: false,
      addModeDialog: null,
      editModeDialog: null,
      list: false,
      date: moment().format('YYYY/MM/DD'),
      newLocation: null,
      currentMarker: {
        animal_id: 3,
        quantity: 15,
        positionLat: 59.73979093723632,
        positionLng: 16.110176035156236,
        date: moment().format('YYYY/MM/DD'),
        Animal: {
          id: 3,
          name: "bear",
          icon: "icon/bear.png",
          image: "img/bear.jpeg",
        }
      },

      center: {
        lat: 59.334591,
        lng: 17.063240
      },
      migrationDialog: null,
      autoFillDialog: null,
      position: null,
      infoPosition: null,
      infoContent: null,
      infoID: null,
      infoRating: null,
      infoImage: null,
      infoOpened: false,
      infoCurrentKey: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
    };
  },
  watch: {
    date(newDate,oldDate){
      if(this.migrations && !this.getDates().includes(this.date) && this.migrations[this.migrations.length - 1]){
        this.autoFillDialog = true
      }
    }
  },
  computed: {
    migrations() {
      return store.state.migrations
    }
  },
  mounted() {
    store.actions.GetMigrations().then(()=>
    {
      if(this.migrations){
        this.date = moment(this.migrations[this.migrations.length - 1].date).format('YYYY/MM/DD')
      }
    })
  },
  methods: {
    hide(){
      this.migrationDialog = false
    },
    addModeActive(){
      this.addModeDialog = true
      this.editMode = false
    },
    editModeActive(){
      this.editModeDialog = true
      this.addMode = false
    },
    autoFill(){
      let migrations = this.migrations.filter(mig => mig.date ===  this.migrations[this.migrations.length - 1].date)
      migrations.map(item =>{
        // console.log('created ' + item.id)
        store.actions.CreateMigration({...item, date: this.date, id: null})
      })
    },
    notify(message,color) {
      this.$q.notify({
        message: message,
        color: color || 'primary',
        multiLine: true,
      })
    },
    newMigration(e) {
      if(this.addMode){
        this.newLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
        this.setM(this.currentMarker)
      } else {
        this.notify('Please activate add mode for creating new migrations','red')
      }
    },
    dragMarker(location) {
      this.newLocation = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      };
    },
    setM(m){
      this.currentMarker = m
      this.createMigration(m)
    },
    async createMigration(marker) {
      if(marker){
        this.currentMarker = {...this.currentMarker,
          positionLat:this.newLocation.lat,
          positionLng:this.newLocation.lng,
        }
      }
      this.migrationDialog = true
    },
    async showMigrations() {
      let that = this

      function makeArrayPrinter(arr, delayMillis) {
        let i = 0;
        return function printer() {
          if (i < arr.length) {
            that.date = arr[i]
            i++
            setTimeout(printer, delayMillis);
          }
        }
      }

      let f = makeArrayPrinter(this.getDates(), 3000);
      f()
    },
    getDates() {
      let dates = []
      this.migrations?.map(marker => !dates.includes(moment(marker.date).format('YYYY/MM/DD')) ?
        dates.push(moment(marker.date).format('YYYY/MM/DD')) : null)
      return dates
    },
    filterDate(markers) {
      return markers.filter(marker => moment(marker.date).format('YYYY/MM/DD') === moment(this.date).format('YYYY/MM/DD'))
    },

    toggleInfo(marker, key) {
      this.infoID = marker.id;
      this.infoPosition = {lat: marker.positionLat, lng: marker.positionLng};
      this.infoContent = marker
      if (this.infoCurrentKey == key) {
        this.infoOpened = !this.infoOpened;
      } else {
        this.infoOpened = true;
        this.infoCurrentKey = key;
      }
    }
  },
};
</script>

<style scoped>
.map {
  width: 100%;
  height: calc(100vh - 118px);
}

.highLight {
  filter: invert(50%);
}
</style>

