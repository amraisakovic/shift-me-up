<template>
  <div>
    <!-- Navigation Bar - Only show when the role is 'nanny' -->
    <nav class="navbar" v-if="isNanny">
      <div class="logo">
        <router-link to="/"><img src="./assets/Shift Me Up Logo.png"></router-link>
      </div>
      <ul class="nav-links" v-if="!isFetchingRole">
        <li><router-link to="/">Home</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
        <li v-if="isNanny"><router-link to="/jobs">Jobs</router-link></li>
        <li v-if="isNanny"><router-link to="/profile">Profile</router-link></li>
        <li v-if="isNanny"><router-link to="/my-shifts">My Shifts</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin">Admin Panel</router-link></li>
        <li v-if="isLoggedIn">
          <button @click="logout">Logout</button>
        </li>
      </ul>
      <div v-else>Loading...</div>
    </nav>

    <!-- Main Content -->
    <router-view></router-view>
  </div>
</template>

<script>
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js"; // Ensure the path to firebase.js is correct

export default {
  name: "App",
  data() {
    return {
      userRole: null,
      isFetchingRole: true,
      remainingTime: 600,
      inactivityTimer: null,
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.userRole;
    },
    isNanny() {
      return this.userRole === "nanny";
    },
    isAdmin() {
      return this.userRole === "admin";
    },
  },
  methods: {
    async fetchUserRole(user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          this.userRole = userDoc.data().role;
        } else {
          this.userRole = null;
        }
      } catch (error) {
        console.error("Error fetching user role: ", error);
      }
    },
    startInactivityTimer() {
      if (this.inactivityTimer) {
        clearInterval(this.inactivityTimer);
      }

      this.inactivityTimer = setInterval(() => {
        this.remainingTime -= 1;
        if (this.remainingTime <= 0) {
          this.logout();
        }
      }, 1000);

      document.addEventListener("mousemove", this.resetInactivityTimer);
      document.addEventListener("keydown", this.resetInactivityTimer);
    },
    resetInactivityTimer() {
      this.remainingTime = 600; // Reset to 10 minutes
    },
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        alert("You have been logged out.");
        this.userRole = null;
        this.$router.push("/login");
        window.location.reload();
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
        this.fetchUserRole(user).finally(() => {
          this.isFetchingRole = false;
        });
        this.startInactivityTimer();
      } else {
        this.userRole = null;
        this.isFetchingRole = false;
      }
    });
  },
  beforeUnmount() {
    this.clearInactivityTimer();
    // Remove event listeners
    ["click", "mousemove", "keydown"].forEach((event) => {
      window.removeEventListener(event, this.resetInactivityTimer);
    });
  },
};
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2e8b57;
  color: #fff;
  font-family: Poppins, sans-serif;
}

.navbar .logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.logo img{
  width: 100px;
  height: 100px;
}

.navbar .nav-links {
  display: flex;
  list-style: none;
}

.navbar .nav-links li {
  margin-left: 1rem;
}

.navbar .nav-links a {
  text-decoration: none;
  color: #fff;
  font-weight: 500;
}

.navbar .nav-links a:hover {
  text-decoration: underline;
}

.navbar .nav-links button {
  padding: 0.5rem 1rem;
  background-color: white;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.navbar .nav-links button:hover {
  background-color: #d32f2f;
}
</style>
