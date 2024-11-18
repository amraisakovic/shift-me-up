<template>
  <div class="picked-up-shifts">
    <h1>Picked Up Shifts</h1>
    <div v-if="shifts.length > 0" class="shift-list">
      <div v-for="shift in shifts" :key="shift.id" class="shift-card">
        <h2>{{ shift.title }}</h2>
        <p><strong>Location:</strong> {{ shift.location }}</p>
        <p><strong>Assigned To:</strong> {{ shift.assignedTo || "Unassigned" }}</p>
        <p><strong>Status:</strong> {{ shift.status }}</p>
        <p><strong>Date:</strong> {{ shift.date }}</p>
        <p><strong>Time:</strong> {{ shift.timeFrom }} - {{ shift.timeTo }}</p>
        <button @click="markAsComplete(shift.id)">Mark as Complete</button>
      </div>
    </div>
    <p v-else>No shifts have been picked up yet.</p>
  </div>
</template>

<script>
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      shifts: [], // List of picked up shifts
    };
  },
  methods: {
    async fetchPickedUpShifts() {
      try {
        // Fetch shifts where 'assignedTo' is not null
        const q = query(collection(db, "shifts"), where("assignedTo", "!=", null));
        const querySnapshot = await getDocs(q);

        this.shifts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching picked up shifts:", error);
      }
    },
    async markAsComplete(shiftId) {
      try {
        // Update the shift status to 'Completed'
        const shiftDoc = doc(db, "shifts", shiftId);
        await updateDoc(shiftDoc, { status: "Completed" });
        alert("Shift marked as completed!");
        this.fetchPickedUpShifts(); // Refresh the list
      } catch (error) {
        console.error("Error updating shift status:", error);
        alert("Failed to update shift status.");
      }
    },
  },
  mounted() {
    this.fetchPickedUpShifts(); // Fetch shifts on component load
  },
};
</script>

<style scoped>
.picked-up-shifts {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.shift-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.shift-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.shift-card h2 {
  margin: 0 0 10px;
  color: #2e8b57;
}

.shift-card p {
  margin: 5px 0;
}

button {
  padding: 8px 12px;
  background-color: #2e8b57;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #276c48;
}
</style>
