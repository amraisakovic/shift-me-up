<template>
  <div class="shifts">
    <h1>Available Shifts</h1>
    <div v-if="shifts.length === 0" class="no-shifts">
      No shifts are currently available.
    </div>
    <ul v-else>
      <li v-for="shift in shifts" :key="shift.id">
        <h2>{{ shift.title }}</h2>
        <p><strong>Pay:</strong> {{ shift.pay }}</p>
        <p><strong>Location:</strong> {{ shift.partialLocation }}</p>
        <p><strong>Number of Children:</strong> {{ shift.children }}</p>
        <p><strong>Date:</strong> {{ shift.date }}</p>
        <p><strong>Time:</strong> {{ shift.timeFrom }} - {{ shift.timeTo }}</p>
        <p><strong>Status:</strong> {{ shift.status }}</p>
        <button v-if="shift.status === 'Unassigned'" @click="pickShift(shift)">
          Pick Up Shift
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      shifts: [], // Shifts fetched from Firestore
    };
  },
  methods: {
    async fetchShifts() {
      try {
        // Fetch shifts from Firestore 'shifts' collection
        const shiftsCollection = collection(db, "shifts");
        const querySnapshot = await getDocs(shiftsCollection);

        // Map Firestore documents to shifts array and filter by unassigned or pending approval
        this.shifts = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((shift) => shift.status === "Unassigned" || shift.status === "Pending Approval");

        console.log("Fetched available shifts:", this.shifts); // Debug log for fetched shifts
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    },
    async pickShift(shift) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("You need to log in to pick up a shift.");
        return;
      }

      try {
        // Reference to the shift document in Firestore
        const shiftRef = doc(db, "shifts", shift.id);

        // Add the nanny's email to the 'applications' array
        await updateDoc(shiftRef, {
          status: "Pending Approval", // Keep the status as 'Pending Approval'
          applications: [...shift.applications, user.email], // Add the nanny's email to the applications array
        });

        alert(`Shift request submitted: ${shift.title}. Await admin approval.`);
        this.fetchShifts(); // Refresh shifts list
      } catch (error) {
        console.error("Error picking shift:", error);
        alert("Failed to pick up the shift. Please try again.");
      }
    },
  },
  mounted() {
    this.fetchShifts(); // Fetch shifts when the component mounts
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

.shifts {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: "Poppins", sans-serif;
}

.no-shifts {
  text-align: center;
  color: gray;
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

button {
  padding: 10px 15px;
  background-color: #2e8b57;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #276c48;
}
</style>
