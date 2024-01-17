<template>
  <div class="row">
    <div class="col-12">
      <div class="maindiv">
        <div class="card">
          <q-card class="text-h6 text-center"> LOGIN
            <q-card-section>
              <q-form>
                <q-input v-model="username" standout="bg-primary text-white" required label="Username" class="q-mb-md" @keyup.enter="loginUser"></q-input>
                <q-input v-model="password" standout="bg-primary text-white" required label="Password" type="password" class="q-mb-md" @keyup.enter="loginUser"></q-input>
                <div style="display: flex; justify-content: center; gap: 10px;">
                  <q-btn color="primary" @click="loginUser"> LOGIN </q-btn>
                  <q-btn color="teal-3" text-color="black" @click="registerDialog = true">Register</q-btn>
                </div>  
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>

        <q-dialog v-model="registerDialog" persistent>
          <q-card class="text-h6 text-center" style="min-width: 450px;"> Register
            <q-card-section>
              <q-form>
                <q-input v-model="newUsername" standout="bg-primary text-white" label="Username" required class="q-mb-md"></q-input>
                <q-input v-model="newPassword" standout="bg-primary text-white" label="Password" required type="password" class="q-mb-md"></q-input>
                <div style="display: flex; justify-content: center; gap: ;">
                  <q-btn color="primary" label="Register" @click="registerUser"></q-btn>
                  <q-btn color="negative" text-color="black" label="Cancel" @click="registerDialog = false"></q-btn>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
        
    </div>
  </div>
</template>

<script>
import { QSpinnerTail } from 'quasar';

export default {
  data() {
    return {
      registerDialog: false,
      username: '',
      password: '',
      newUsername: '',
      newPassword: '',
    };
  },

  methods: {

    async loginUser() {
      if (!this.username || !this.password) {
        this.$q.notify({
          color: 'negative',
          position: 'center',
          message: 'Please Input the Required Fields',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 1500,
          progress: true,
        });
        return;
      }

      this.$q.loading.show({
        spinner: QSpinnerTail,
        message: 'Logging In',
        messageColor: 'white',
        backgroundColor: 'gray',
        spinnerColor: 'blue',
        customClass: 'custom-loading-style',
      });

      this.timer = setTimeout(() => {
        this.$q.loading.hide();
        this.timer = undefined;
      }, 2000);

      const success = await this.$store.dispatch('auth/loginUser', {
        username: this.username,
        password: this.password,
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      clearTimeout(this.timer);
      this.$q.loading.hide();

      if (success) {
        this.username = '';
        this.password = '';
        this.$q.notify({
          color: 'positive',
          position: 'center',
          message: 'Success Logging In',
          icon: 'check',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
        this.$router.push('/Leave');
      } else {
        this.$q.notify({
          color: 'negative',
          position: 'center',
          message: 'Wrong Credential',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 1500,
          progress: true,
        });
        this.username = '';
        this.password = '';
      }
    },

    async registerUser() {
      if (!this.username || !this.password) {
        this.$q.notify({
          color: 'negative',
          position: 'center',
          message: 'Please Input the Required Fields',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 1500,
          progress: true,
        });
        return;
      }

      this.$q.loading.show({
        spinner: QSpinnerTail,
        message: 'Logging In',
        messageColor: 'white',
        backgroundColor: 'gray',
        spinnerColor: 'blue',
        customClass: 'custom-loading-style',
      });

      this.timer = setTimeout(() => {
        this.$q.loading.hide();
        this.timer = undefined;
      }, 2000);

      const success = await this.$store.dispatch('auth/registerUser', {
        newUsername: this.newUsername,
        newPassword: this.newPassword,
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      clearTimeout(this.timer);
      this.$q.loading.hide();

      if (success) {
        this.newUsername = '';
        this.newPassword = '';
        this.$q.notify({
          color: 'positive',
          position: 'center',
          message: 'Success Registration',
          icon: 'check',
          iconColor: 'white',
          timeout: 1500,
          progress: true,
        });
        this.registerDialog = false;
      } else {
        this.$q.notify({
          color: 'negative',
          position: 'center',
          message: 'Existing Credential. Find Another Username and Password',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 1500,
          progress: true,
        });
        this.newUsername = '';
        this.newPassword = '';
      }
    },
  },

}


</script>


<style>

.card {
  height: 400px;
  width: 450px;
}

.maindiv {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}




</style>

