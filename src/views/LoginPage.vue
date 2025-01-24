<template>
  <div class="login-page">
    <div class="login-container">
      <img src="../assets/Shift Me Up Logo.png" alt="Logo" class="logo" />
      <h1>Welcome Back!</h1>
      <p>Please login to your account</p>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
              v-model="email"
              type="email"
              id="email"
              placeholder="Enter your email"
              required
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Enter your password"
              required
          />
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      email: "",
      password: "",
      isLoading: false, // Add a loading state
    };
  },
  methods: {
    async login() {
      const auth = getAuth();
      this.isLoading = true; // Set loading state to true
      try {
        // Sign in the user with email and password
        const { user } = await signInWithEmailAndPassword(auth, this.email, this.password);

        if (user) {
          // Fetch user data from Firestore
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Redirect based on the firstLogin status or role
            if (userData.firstLogin) {
              this.$router.push("/setup"); // Redirect to setup page
            } else if (userData.role === "admin") {
              this.$router.push("/admin"); // Redirect to admin panel
            } else if (userData.role === "nanny") {
              this.$router.push("/profile"); // Redirect to profile page
            } else {
              throw new Error("Unauthorized Role");
            }
          } else {
            console.error("User document not found in Firestore.");
            alert("Account setup incomplete. Contact admin for assistance.");
          }
        }
      } catch (error) {
        console.error("Error logging in: ", error);
        alert("Access Denied: " + error.message);
      } finally {
        this.isLoading = false; // Set loading state to false
      }
    },
  },
};
</script>

<style scoped>

@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

/* Your existing styling */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f9f9f9;
}

.login-container {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  font-family: "Poppins", sans-serif;
}

.login-container h1 {
  margin-bottom: 10px;
  color: #2e8b57;
}

.login-container p {
  margin-bottom: 30px;
  color: #555555;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #2e8b57;
}

.login-button {
  padding: 10px 20px;
  background-color: #2e8b57;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.login-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.login-button:hover {
  background-color: #276c48;
}

.login-button:active {
  background-color: #1c5233;
}

.logo{
  height: 150px;
  width: 150px;
}
</style>
