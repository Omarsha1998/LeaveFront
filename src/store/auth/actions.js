// actions.js
import axios from 'axios';
import { Cookies } from 'quasar';
let api = process.env.API_HOST;

export default {

  async loginUser({ commit }, { username, password }) {
    if (!username || !password) {
      console.log('Username and Password are required!');
      return false;
    }
    try {
      const response = await axios.post(`${api}/user/login`, {
        username,
        password,
      });

      Cookies.set('token', response.data.token,{ sameSite: 'None', secure: true } );
      commit('SET_TOKEN', response.data.token);
      commit('SET_USER', response.data.user);
      commit('SET_LOGGEDIN', true);

      console.log('Login Successful');
      return true;
    } catch (error) {
      console.error('Login Failed', error);
      return false;
    }
  },

  async registerUser(_, { newUsername, newPassword }) {
    try {
      await axios.post(`${api}/user/register`, {
        username: newUsername,
        password: newPassword,
      });

      console.log('Register Successful');
      return true;
    } catch (error) {
      console.error('Register Failed', error);
      return false;
    }
  },

  async logoutUser({ commit }) {
    try {
      await axios.post(`${api}/user/logout`, {}, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });

      Cookies.remove('token');
      commit('SET_AUTHENTICATED', false);
      commit('SET_TOKEN', null);
      commit('SET_USER', null);
      commit('SET_USER_ID', null)
      commit('SET_LOGGEDIN', false);
      console.log('Logout Successfull');
      this.$router.push("/");
    } catch (error) {
      console.error('Logout Failed', error);
    }
  },

  clearUserDetails({ commit }) {
    try {
      Cookies.remove('token');
      commit('SET_AUTHENTICATED', false);
      commit('SET_TOKEN', null);
      commit('SET_USER', null);
      commit('SET_USER_ID', null)
      commit('SET_LOGGEDIN', false);
      this.$router.push("/");
    } catch (error) {
      console.error('Error Clear Details', error)
    };
  },

  async fetchUserData({ commit }) {
    try {
      const token = Cookies.get('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
  
        const Name = payload.Name;
        const EmployeeCode = payload.EmployeeCode; 
  
        commit('SET_USER', Name);
        commit('SET_USER_ID', EmployeeCode); 
      }
    } catch (error) {
      console.error('Error getting username and UserID from JWT', error);
    }
  },

  checkAuth({ commit }) {
    const token = Cookies.get('token');
    if (token) {
      commit('SET_LOGGEDIN', true);
      commit('SET_TOKEN', token);
    }
  },
  

}
