<template>
  <div id="app">
    <!-- Global Header -->
    <header v-if="!isAdminRoute" class="main-header">
      <!-- Logo Section -->
      <div class="logo-section">
        <router-link to="/">
          <img src="./assets/Shift Me Up Logo.png" alt="Logo" class="logo" />
        </router-link>
      </div>

      <!-- Navigation Links -->
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
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

    <!-- Auto-Logout Timer -->
    <div v-if="isLoggedIn && remainingTime < 300" class="logout-timer">
      Auto-logout in: {{ formattedTime }}
    </div>
  </div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import throttle from "lodash/throttle";

export default {
  data() {
    return {
      userRole: null, // Store the role of the logged-in user
      remainingTime: 600, // Timer starts at 600 seconds (10 minutes)
      inactivityTimer: null,
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
    formattedTime() {
      // Format the remaining time as mm:ss
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;
      return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
    },
  },
  methods: {
    padZero(time) {
      return time < 10 ? `0${time}` : time; // Add leading zero if less than 10
    },
    async fetchUserRole(user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          this.userRole = userDoc.data()?.role || "guest"; // Default to guest role
        } else {
          console.warn("User document not found!");
          this.userRole = "guest";
        }
      } catch (error) {
        console.error("Error fetching user role: ", error);
        alert("An error occurred while fetching user data.");
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
    startInactivityTimer() {
      this.clearInactivityTimer(); // Clear any previous timers
      this.remainingTime = 600; // Reset the timer to 10 minutes
      this.inactivityTimer = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime === 60) {
          alert("You will be logged out in 1 minute due to inactivity.");
        }
        if (this.remainingTime <= 0) {
          this.logout(); // Log out user
          this.clearInactivityTimer();
        }
      }, 1000); // Update every second
    },
    clearInactivityTimer() {
      if (this.inactivityTimer) {
        clearInterval(this.inactivityTimer);
        this.inactivityTimer = null;
      }
    },
    resetInactivityTimer() {
      if (this.isLoggedIn) {
        this.startInactivityTimer(); // Restart timer on user activity
      }
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.fetchUserRole(user); // Fetch user role when logged in
        this.startInactivityTimer(); // Start the inactivity timer
      } else {
        this.userRole = null; // Reset role when logged out
      }
    });

    // Listen for user interactions to reset the inactivity timer
    const resetThrottled = throttle(this.resetInactivityTimer, 500);
    ["click", "mousemove", "keydown"].forEach((event) => {
      window.addEventListener(event, resetThrottled);
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

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

/* Header Styling */
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #2e8b57;
  color: white;
  font-family: Poppins, serif;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  width: auto;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
  font-family: Poppins, serif;
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

/* Timer Styling */
.logout-timer {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-family: Poppins, serif;
  font-size: 14px;
}

@media (max-width: 768px) {
  .main-header {
    flex-direction: column;
    align-items: start;
  }
  .nav-links {
    flex-direction: column;
    gap: 10px;
  }
  .logout-timer {
    bottom: 20px;
    right: 20px;
    font-size: 12px;
  }
}
</style>
