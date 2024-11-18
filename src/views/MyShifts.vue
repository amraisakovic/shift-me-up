<template>
  <div class="my-shifts">
    <h1>My Shifts</h1>

    <div v-if="shifts.length === 0" class="no-shifts">
      <p>You have not picked up any shifts yet.</p>
    </div>

    <div v-else class="shift-list">
      <div
          v-for="shift in shifts"
          :key="shift.id"
          class="shift-card"
      >
        <h2>{{ shift.title }}</h2>
        <p><strong>Pay:</strong> {{ shift.pay }}</p>
        <p><strong>Location:</strong> {{ shift.location }}</p>
        <p><strong>Number of Children:</strong> {{ shift.children }}</p>
        <p><strong>Description:</strong> {{ shift.description }}</p>
        <p><strong>Date:</strong> {{ shift.date }}</p>
        <p><strong>Time:</strong> {{ shift.timeFrom }} - {{ shift.timeTo }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase";

export default {
  data() {
    return {
      shifts: [], // Store the shifts picked up by the current user
    };
  },
  methods: {
    async fetchMyShifts() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("You need to log in to view your shifts.");
        return;
      }

      try {
        // Fetch shifts assigned to the current user
        const shiftsCollection = collection(db, "shifts");
        const q = query(shiftsCollection, where("assignedTo", "==", user.email));
        const querySnapshot = await getDocs(q);

        // Map Firestore documents to the shifts array
        this.shifts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched my shifts:", this.shifts); // Debug log
      } catch (error) {
        console.error("Error fetching my shifts:", error);
      }
    },
  },
  mounted() {
    this.fetchMyShifts(); // Fetch shifts when the component mounts
  },
};
</script>

<style scoped>
.my-shifts {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.no-shifts {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}

.shift-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.shift-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.shift-card h2 {
  font-size: 1.5rem;
  color: #2e8b57;
  margin-bottom: 10px;
}

.shift-card p {
  margin: 5px 0;
  font-size: 1rem;
}
</style>
