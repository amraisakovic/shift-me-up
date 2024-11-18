<template>
  <div class="admin-panel">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: isMobile && !isMenuOpen }">
      <div class="menu-header">
        <!-- Hamburger Icon -->
        <button class="hamburger" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <!-- Show "Menu" only if expanded -->
        <h2 v-if="!isMobile || isMenuOpen">Menu</h2>
      </div>
      <ul v-if="!isMobile || isMenuOpen">
        <li
            v-for="menuItem in menu"
            :key="menuItem.name"
            :class="{ active: activeMenu === menuItem.name }"
            @click="selectMenu(menuItem.name)"
        >
          {{ menuItem.label }}
        </li>
        <!-- Logout Button -->
        <li @click="logout" class="logout">
          Logout
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <h1>{{ activeMenuLabel }}</h1>
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
import { getAuth, signOut } from "firebase/auth";

export default {
  data() {
    return {
      activeMenu: "ExistingShifts",
      isMobile: false,
      isMenuOpen: false, // Tracks sidebar visibility
      menu: [
        { name: "ExistingShifts", label: "Existing Shifts" },
        { name: "AddShift", label: "Add Shift" },
        { name: "PickedUpShifts", label: "Picked Up Shifts" },
        { name: "NannyOverview", label: "Nanny Overview" },
        { name: "CreateNanny", label: "Create Nanny Account" },
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
      if (this.isMobile) this.isMenuOpen = false; // Collapse menu after selection
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen; // Toggle menu visibility
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 768; // Check if screen size is mobile
      if (!this.isMobile) {
        this.isMenuOpen = true; // Ensure menu stays open on desktop
      }
    },
    logout() {
      const auth = getAuth();
      signOut(auth)
          .then(() => {
            alert("You have successfully logged out!");
            this.$router.push("/login"); // Redirect to login page
          })
          .catch((error) => {
            console.error("Logout Error:", error);
          });
    },
  },
  mounted() {
    this.handleResize(); // Initial check
    window.addEventListener("resize", this.handleResize); // Listen for resize events
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
/* Admin Panel Layout */
.admin-panel {
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 250px; /* Full width when expanded */
  background-color: #2e8b57;
  color: white;
  padding: 20px;
  z-index: 1000;
  transition: width 0.3s ease-in-out;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 30px; /* Thin vertical line with hamburger icon */
}

.menu-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
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
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sidebar ul li:hover,
.sidebar ul li.active {
  background-color: #276c48;
}

.sidebar ul li.logout {
  color: red;
  font-weight: bold;
}

.sidebar ul li.logout:hover {
  background-color: #a44;
}

/* Main Content */
.main-content {
  margin-left: 250px; /* Offset by the expanded sidebar width */
  padding: 30px;
  transition: margin-left 0.3s ease-in-out;
}

.sidebar.collapsed + .main-content {
  margin-left: 50px; /* Offset by the collapsed sidebar width */
}
</style>
