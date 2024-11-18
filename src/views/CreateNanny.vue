<template>
  <div class="create-nanny-container">
    <h1>Create Nanny Account</h1>
    <form @submit.prevent="createNanny">
      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="nanny.email" type="email" id="email" placeholder="Enter nanny's email" required />
      </div>

      <div class="form-group">
        <label for="password">Temporary Password:</label>
        <input v-model="nanny.password" type="password" id="password" placeholder="Enter a temporary password" required />
      </div>

      <button type="submit" class="create-button">Create Account</button>
    </form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      nanny: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async createNanny() {
      const auth = getAuth();
      try {
        // Temporarily sign in as the admin
        const adminUser = auth.currentUser;

        // Create the nanny account
        const { user } = await createUserWithEmailAndPassword(auth, this.nanny.email, this.nanny.password);

        // Save nanny details in Firestore
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          email: this.nanny.email,
          role: "nanny",
          firstLogin: true,
        });

        alert("Nanny account created successfully!");

        // Sign out from the nanny account and restore admin session
        await signOut(auth);
        await auth.signInWithEmailAndPassword(adminUser.email, adminUser.password);

        // Reset form fields
        this.nanny.email = "";
        this.nanny.password = "";
      } catch (error) {
        console.error("Error creating nanny account: ", error);
        alert("Failed to create nanny account. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
/* Styling for the Create Nanny Form */
.create-nanny-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2e8b57;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button.create-button {
  width: 100%;
  padding: 10px;
  background-color: #2e8b57;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.create-button:hover {
  background-color: #276c48;
}
</style>
