<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated :class="$q.dark.isActive ? 'bg-primary' : 'bg-primary'">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title
          :style="{
            height: '50%',
            fontWeight: 'bold',
            fontSize: $q.screen.lt.sm ? '12px' : ($q.screen.lt.md ? '16px' : ($q.screen.gt.md && $q.screen.lt.xl ? '20px' : '18px'))
          }"
          >
          Leave Module / Application
          </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      elevated
      show-if-above
      :width="$q.screen.gt.md ? 250 : $q.screen.gt.sm ? 220 : 180"
    >
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 170px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="55px" class="q-mb-md">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div
            :style="{
              height: '50%',
              fontWeight: 'bold',
              fontSize: $q.screen.lt.sm
                ? '12px'
                : $q.screen.lt.md
                ? '16px'
                : $q.screen.gt.md && $q.screen.lt.xl
                ? '20px'
                : '18px',
            }"
          >
            {{ user }}
          </div>
          <div>@emailsample.com</div>
        </div>
      </q-img>

      <q-scroll-area
        style="
          height: calc(100% - 170px);
          margin-top: 170px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list v-if="mainLinks">
          <q-expansion-item
            v-for="mainLink in mainLinks"
            :key="mainLink.title"
            :label="mainLink.title"
            :caption="mainLink.caption"
            :icon="mainLink.icon"
            :style="{
              fontSize: $q.screen.lt.sm ? '12px' : ($q.screen.lt.md ? '14px' : ($q.screen.gt.md && $q.screen.lt.xl ? '19px' : '17px')),
              fontWeight: 'bold',
            }"
          >
              <q-item
                clickable
                v-for="link in filteredChildren"
                :key="link.title"
                :href="link.link"
                :class="{ 'active-link': link.active }"
                @click="activateLink(link)"
              >
                <q-item-label style="margin-left: 20px; display: flex; align-items: center;"
                :style="{
                  fontSize: $q.screen.lt.sm ? '12px' : ($q.screen.lt.md ? '14px' : ($q.screen.gt.md && $q.screen.lt.xl ? '19px' : '17px')),
                  fontWeight: 'bold',
                }"
                >{{ link.title }}</q-item-label>
              </q-item>
          </q-expansion-item>
          
          <q-item full-width>
            <q-item-section>
              <q-btn color="negative" text-color="white" @click="logoutUser" label="Logout" />
            </q-item-section>
          </q-item>
        </q-list> 
        
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { Cookies } from "quasar";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainLayout",

  data() {
    return {
      leftDrawerOpen: false,
      expandedItems: [],
    };
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },

    isAdmin() {
      const token = Cookies.get("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.isAdmin === true;
      }
      return false;
    },

    mainLinks() {
      return this.$store.getters["helpers/mainLinks"];
    },

    filteredChildren() {
      if (this.isAdmin) {
        return this.mainLinks[0].children;
      } else {
        return this.mainLinks[0].children.filter(child => child.title !== 'Leave Approval');
      }
    },
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },

    activateLink(link) {
      this.mainLinks.forEach((mainLink) => {
        mainLink.children.forEach((childLink) => {
          childLink.active = false;
        });
        mainLink.active = false;
      });
      link.active = true;
    },

    getIconName(title) {
      if (title === 'My Leaves') {
        return 'menu';
      } else if (title === 'Leave Approval') {
        return 'menu';
      }
    },

    toggleDropdown(mainLink) {
      mainLink.active = !mainLink.active;
    },

    async logoutUser() {
      await this.$store.dispatch("auth/logoutUser");
    },

    async fetchUserData() {
      try {
        await this.$store.dispatch("auth/fetchUserData");
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    },
  },

  created() {
    this.fetchUserData();
  },
});
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
