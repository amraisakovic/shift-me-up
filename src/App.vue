<template>
  <div id="app">
    <!-- Global Header -->
    <header v-if="!isAdminRoute" class="main-header">
      <!-- Navigation Links -->
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li v-if="isNanny"><router-link to="/jobs">Jobs</router-link></li>
        <li v-if="isNanny"><router-link to="/profile">Profile</router-link></li>
        <li v-if="isNanny"><router-link to="/my-shifts">My Shifts</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin">Admin Panel</router-link></li>
      </ul>

      <!-- Logout Button -->
      <button v-if="isLoggedIn" class="logout-button" @click="logout">Logout</button>
    </header>

    <!-- Route Content -->
    <router-view />
  </div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export default {
  data() {
    return {
      userRole: null, // Store the role of the logged-in user
    };
  },
  computed: {
    isLoggedIn() {
      return this.userRole !== null; // User is logged in if a role exists
    },
    isAdmin() {
      return this.userRole === "admin"; // Check if the user is an admin
    },
    isNanny() {
      return this.userRole === "nanny"; // Check if the user is a nanny
    },
    isAdminRoute() {
      // Check if the current route starts with "/admin"
      return this.$route.path.startsWith("/admin");
    },
  },
  methods: {
    async fetchUserRole(user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        this.userRole = userDoc.data()?.role; // Set the role (admin/nanny)
      } catch (error) {
        console.error("Error fetching user role: ", error);
      }
    },
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        alert("You have been logged out.");
        this.userRole = null; // Reset the role
        this.$router.push("/login"); // Redirect to login page
      } catch (error) {
        console.error("Error logging out: ", error);
        alert("Failed to log out. Please try again.");
      }
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.fetchUserRole(user); // Fetch user role when logged in
      } else {
        this.userRole = null; // Reset role when logged out
      }
    });
  },
};
</script>

<style scoped>
/* Header Styling */
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ensures logout button is on the far right */
  padding: 10px 20px;
  background-color: #2e8b57;
  color: white;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.nav-links li {
  margin: 0;
}

.nav-links li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.nav-links li a:hover {
  text-decoration: underline;
}

.logout-button {
  background-color: white;
  color: #2e8b57;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
}

.logout-button:hover {
  background-color: #276c48;
  color: white;
}
</style>
