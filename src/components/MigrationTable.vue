<template>
  <div>
    <q-table
      :rows="migrations"
      :columns="columns"
      :rows-per-page-options="[0]"

    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="flex no-wrap justify-around" :props="props">
          <q-btn no-caps
                 dense
                 round
                 flat
                 color="grey"
                 @click="openEditDialog(props.row)"
                 icon="edit"
          />

          <q-dialog v-if="currentMigration?.id === props.row.id" v-model="editDialog">
            <MigrationDialog :migration="currentMigration" :edit="true"/>
          </q-dialog>
          <q-btn no-caps
                 dense
                 round
                 flat
                 color="grey"
                 @click="openDeleteDialog(props.row.id)"
                 icon="delete"
          />
          <q-dialog v-if="currentId === props.row.id" v-model="deleteDialog">
            <div class="bg-white q-pa-md flex column">
              Are you sure you want to delete migration <span class="text-bold">{{ props.row?.id + ' ?'}}</span>
              <div class="flex justify-between q-pt-md">
                <q-btn color="grey" v-close-popup>Cancel</q-btn>
                <q-btn color="red" @click="deleteMigration">Delete Migration</q-btn>
              </div>

            </div>
          </q-dialog>
        </q-td>
      </template>
    </q-table>

  </div>
</template>

<script>
import moment from "moment";
import store from "src/myStore";
import MigrationDialog from "components/MigrationDialog.vue";

export default {
  name: "MigrationTable",
  components: {MigrationDialog},
  props: ['migrations'],
  data() {
    return {
      filter: null,
      columns: [
        {
          name: "id",
          required: true,
          label: "Migration Id",
          align: "left",
          field: row => row.id,
          format: val => `${val}`,
          sortable: true,
          classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white'
        },
        {
          name: "date",
          required: true,
          label: "Date",
          align: "left",
          field: row => moment(row?.date).format('DD/MM/yyyy'),
          format: val => `${val}`,
          sortable: true,
          classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white'
        },
        {
          name: "animal",
          required: true,
          label: "Animal Name",
          align: "left",
          field: row => row?.Animal?.name,
          format: val => `${val}`,
          sortable: true,
          classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white'
        },
        {
          name: "quantity",
          required: true,
          label: "Quantity",
          align: "left",
          field: row => row?.quantity,
          format: val => `${val}`,
          sortable: true,
          classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white'
        },
        {
          name: "lat",
          required: true,
          label: "Position Lat",
          align: "left",
          field: row => row?.positionLat,
          format: val => `${val}`,
          sortable: true,
          classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white'
        },
        {
          name: "lng",
          required: true,
          label: "Position Lng",
          align: "left",
          field: row => row?.positionLng,
          format: val => `${val}`,
          sortable: true,
          classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white'
        },
        {
          name: "actions", label: "Actions", field: "", align: "center", classes: 'bg-grey-2 ellipsis',
          headerClasses: 'bg-primary text-white'
        }
      ],
      editDialog: null,
      deleteDialog: null,
      currentMigration: null,
      currentId: null,
    }
  },
  methods: {
    deleteMigration() {
      store.actions.DeleteMigration(this.currentId)
    },
    openEditDialog(migration) {
      this.currentMigration = migration
      this.editDialog = true
    },
    openDeleteDialog(id) {
      this.currentId = id
      this.deleteDialog = true
    }
  }
}
</script>

<style scoped>

</style>
