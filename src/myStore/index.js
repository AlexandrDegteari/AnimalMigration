import {reactive} from 'vue'
import axios from "axios";

const api = process.env.API_URL
axios.defaults.headers.common["Authorization"] = localStorage.getItem(
  "access_token")
const state = reactive({
  animals: null,
  migrations: null,
  navItems: [
    {
      root: '/',
      to: '/',
      icon: 'ui/sound.svg',
      label: 'Sounds',
      all: true
    },
    {
      root: '/profile',
      to: '/profile',
      icon: 'ui/profile.svg',
      label: 'Profile',
      auth: true
    },
  ],
  access_token: localStorage.getItem('access_token'),
  user: JSON.parse(localStorage.getItem('user')),
  usePageTransition: false,
  iosBrowserSwipingBack: false
})
const actions = {
  GetAnimals: () => {
    return axios
      .get(`${api}/animals`)
      .then(response => {
        if (response.data) {
          state.animals = response.data;
          return response.data
        }
        return false;
      })
      .catch(error => {
        return {error};
      });
  },
  GetMigrations: () => {
    return axios
      .get(`${api}/migrations`)
      .then(response => {
        if (response.data) {
          state.migrations = response.data;
          return response.data
        }
        return false;
      })
      .catch(error => {
        return {error};
      });
  },
  CreateMigration(data) {
    return axios
      .post(`${api}/migrations/add`, data)
      .then(response => {
        if (response.data) {
          actions.GetMigrations()
          return response.data;
        }
        return false;
      })
      .catch(error => {
        return {error};
      });
  },
  UpdateMigration(data) {
    return axios
      .put(`${api}/migrations/put/` + data.id, data)
      .then(response => {
        if (response.data) {
          actions.GetMigrations()
          return response.data;
        }
        return false;
      })
      .catch(error => {
        return {error};
      });
  },
  DeleteMigration(id) {
    return axios
      .delete(`${api}/migrations/` + id)
      .then(response => {
        if (response.data) {
          actions.GetMigrations()
          return response.data;
        }
        return false;
      })
      .catch(error => {
        return {error};
      });
  },
}
const getters = {
  isAuthenticated: () => state.access_token,
  getUser: () => state.user,
}
const store = {
  state,
  getters,
  actions
}
export default store
