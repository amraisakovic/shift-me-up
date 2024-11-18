<template>
  <div class="setup-page">
    <h1>Complete Your Profile</h1>
    <form @submit.prevent="saveProfileAndPassword">
      <div>
        <label for="name">Name:</label>
        <input v-model="profile.name" type="text" id="name" placeholder="Enter your name" required />
      </div>
      <div>
        <label for="age">Age:</label>
        <input v-model="profile.age" type="number" id="age" placeholder="Enter your age" required />
      </div>
      <div>
        <label for="experience">Experience:</label>
        <textarea
            v-model="profile.experience"
            id="experience"
            placeholder="Enter your experience"
            required
        ></textarea>
      </div>
      <div>
        <label for="preferredLocation">Preferred Location:</label>
        <input
            v-model="profile.preferredLocation"
            type="text"
            id="preferredLocation"
            placeholder="Enter your preferred location"
            required
        />
      </div>
      <div>
        <label for="password">New Password:</label>
        <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your new password"
            required
        />
      </div>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import { getAuth, updatePassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      profile: {
        name: "",
        age: "",
        experience: "",
        preferredLocation: "",
      },
      password: "",
    };
  },
  methods: {
    async saveProfileAndPassword() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("You need to be logged in.");
        return;
      }

      try {
        // Check if `firstLogin` is still true to ensure proper flow
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data().firstLogin) {
          // Save profile to Firestore
          await setDoc(
              userRef,
              {
                ...this.profile,
                firstLogin: false, // Mark first login as complete
              },
              { merge: true }
          );

          // Update password
          await updatePassword(user, this.password);
          alert("Profile and password updated successfully!");

          // Redirect to profile or home page
          this.$router.push("/profile");
        } else {
          alert("You have already completed your setup.");
          this.$router.push("/profile"); // Redirect to the profile page
        }
      } catch (error) {
        console.error("Error saving profile or updating password:", error);
        alert("Failed to complete setup. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.setup-page {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f8f9fa;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #2e8b57;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #276c48;
}
</style>
