<template>
  <div class="admin-panel">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="menu-header">
        <!-- Hamburger Icon -->
        <button class="hamburger" @click="toggleSidebar">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <h2 v-if="!isCollapsed"><img src="../assets/Shift Me Up Logo.png" alt="Logo" class="logo" /></h2>
      </div>
      <ul v-if="!isCollapsed || !isMobile">
        <li
            v-for="menuItem in menu"
            :key="menuItem.name"
            :class="{ active: activeMenu === menuItem.name }"
            @click="selectMenu(menuItem.name)"
        >
          {{ menuItem.label }}
        </li>
        <li @click="logout" class="logout">Logout</li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content" :class="{ shifted: !isCollapsed }">
<!--      <h1>{{ activeMenuLabel }}</h1>-->
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script>
import ExistingShifts from "./ExistingShifts.vue";
import AddShift from "./AddShift.vue";
import PickedUpShifts from "./PickedUpShifts.vue";
import NannyOverview from "./NannyOverview.vue";
import CreateNanny from "./CreateNanny.vue";
import AdminNews from "./AdminNews.vue";
import { getAuth, signOut } from "firebase/auth";

export default {
  data() {
    return {
      activeMenu: "ExistingShifts",
      isCollapsed: true, // Sidebar starts collapsed
      isMobile: window.innerWidth <= 768, // Detect mobile view
      menu: [
        { name: "ExistingShifts", label: "Existing Shifts" },
        { name: "AddShift", label: "Add Shift" },
        { name: "PickedUpShifts", label: "Picked Up Shifts" },
        { name: "NannyOverview", label: "Nanny Overview" },
        { name: "CreateNanny", label: "Create Nanny Account" },
        { name: "AdminNews", label: "Manage News" },
      ],
    };
  },
  computed: {
    currentComponent() {
      const components = {
        ExistingShifts,
        AddShift,
        PickedUpShifts,
        NannyOverview,
        CreateNanny,
        AdminNews,
      };
      return components[this.activeMenu];
    },
    activeMenuLabel() {
      return this.menu.find((item) => item.name === this.activeMenu)?.label || "";
    },
  },
  methods: {
    selectMenu(menuName) {
      this.activeMenu = menuName;
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    logout() {
      const auth = getAuth();
      signOut(auth)
          .then(() => {
            alert("You have successfully logged out!");
            this.$router.push("/login");
          })
          .catch((error) => {
            console.error("Logout Error:", error);
          });
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.isCollapsed = false; // Ensure sidebar is expanded on desktop
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>

@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

/* Admin Panel Layout */
.admin-panel {
  display: flex;
  height: 100vh;
  overflow: auto;
  font-family: "Poppins", sans-serif;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 60px; /* Collapsed width */
  background-color: #2e8b57;
  color: white;
  overflow-x: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.sidebar:not(.collapsed) {
  width: 250px; /* Expanded width */
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
}

.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 24px;
  width: 30px;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 3px;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.sidebar ul li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sidebar ul li:hover,
.sidebar ul li.active {
  background-color: #276c48;
}

.sidebar ul li.logout {
  color: white;
  font-weight: bold;
}

.sidebar ul li.logout:hover {
  background-color: #a44;
}

/* Main Content */
.main-content {
  flex-grow: 1;
  margin-left: 60px; /* Default margin for collapsed sidebar */
  padding: 30px;
  transition: margin-left 0.3s ease;
}

.main-content.shifted {
  margin-left: 250px; /* Adjust based on expanded sidebar width */
}

img{
  height: 50px;
  width: auto;
}
</style>
