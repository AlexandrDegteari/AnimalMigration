<template>
  <div v-if="currentMarker" style="width: 320px;" class="bg-white q-pa-sm">
    <h2 class="text-h6 text-center">{{ edit ? 'Edit' : 'New' }} Migration</h2>
    <div class="text-black">
      <q-select v-model="currentMarker.animal_id"
                :options="animals"
                map-options
                emit-value
                :option-value="'id'"
                :option-label="'name'"
                label="Animal Id:"/>
      <q-input v-model="currentMarker.quantity" type="number" label="Quantity:"/>
      <!--      <q-input step="0.0000000000001" v-model="currentMarker.positionLat" type="number" label="Position Lat:"/>-->
      <q-input v-model="currentMarker.positionLat" type="number" label="Position Lat:"/>
      <q-input v-model="currentMarker.positionLng" type="number" label="Position Lng:"/>
      <q-input filled v-model="currentMarker.date" mask="date" :rules="['date']">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="currentMarker.date">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <p class="text-red">{{ error }}</p>
      <div class="flex justify-between">
        <q-btn @click="createMigration(currentMarker)" color="blue" :label="edit?'Edit Migration':'Create Migration'"/>
        <q-btn @click="exitEdit" v-close-popup color="grey" label="Cancel"/>

      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment/moment";
import store from "src/myStore";

export default {
  name: "MigrationDialog",
  props: ['migration', 'edit'],
  data() {
    return {
      error: null,
      currentMarker: null,
      options: null,
    }
  },
  computed: {
    animals() {
      return store.state.animals
    },
  },
  methods: {
    exitEdit(){
      this.$emit('exit')
    },
    notify(message,color) {
      this.$q.notify({
        message: message,
        color: color || 'primary',
        multiLine: true,
      })
    },
    validateCoordinates(lat, lng) {
      const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
      const lngRegex = /^-?((1[0-7]|[1-9])?\d(\.\d+)?|180(\.0+)?)$/;

      if (!latRegex.test(lat)) {
        return false;
      }
      return lngRegex.test(lng);


    },
    createMigration(migration) {
      let data = {
        id: this.edit ? migration.id : null,
        animal_id: migration.animal_id,
        quantity: migration.quantity,
        date: migration.date,
        positionLat: migration.positionLat,
        positionLng: migration.positionLng,
      }
      if (this.edit) {
        this.validateCoordinates(data.positionLat, data.positionLng) ?
          store.actions.UpdateMigration(data)
            .then(() => {
              this.notify('Data Updated','green')
              this.$emit('hide')
            })

            .catch(err => {
              this.notify('Update Error','red')
            })
          : this.error = 'Check coordinates!'
      } else {
        this.validateCoordinates(data.positionLat, data.positionLng) ? store.actions.CreateMigration(data) : this.error = 'Check coordinates!'

      }
    }
  },
  mounted() {
    store.actions.GetAnimals()
    this.currentMarker = {...this.migration}
  }
}
</script>

<style scoped>

</style>
