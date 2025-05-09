<template>
  <div class="picked-up-shifts">
    <h1>Picked Up Shifts</h1>
    <div v-if="shifts.length > 0" class="shift-list">
      <div v-for="shift in shifts" :key="shift.id" class="shift-card">
        <h2>{{ shift.title }}</h2>
        <p><strong>Partial Location:</strong> {{ shift.partialLocation }}</p>
        <p><strong>Assigned To:</strong> {{ shift.assignedTo || "Unassigned" }}</p>
        <p><strong>Status:</strong> {{ shift.status }}</p>
        <p><strong>Date:</strong> {{ shift.date }}</p>
        <p><strong>Time:</strong> {{ shift.timeFrom }} - {{ shift.timeTo }}</p>
        <div class="actions" v-if="shift.status === 'Pending Approval'">
          <button @click="approveShift(shift.id, shift.applications)">Approve</button>
          <button @click="declineShift(shift.id)">Decline</button>
        </div>
      </div>
    </div>
    <p v-else>No shifts are awaiting approval.</p>
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
        // Fetch shifts where 'status' is 'Pending Approval'
        const q = query(collection(db, "shifts"), where("status", "==", "Pending Approval"));
        const querySnapshot = await getDocs(q);

        this.shifts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching picked up shifts:", error);
      }
    },
    async approveShift(shiftId, applications) {
      try {
        if (applications.length === 0) {
          alert("No applications to approve.");
          return;
        }

        // Assuming the admin selects the first nanny from the applications array
        const nannyToApprove = applications[0]; // You can add a selection mechanism if needed

        const shiftDoc = doc(db, "shifts", shiftId);

        // Update the shift with the approved nanny and change status to "Assigned"
        await updateDoc(shiftDoc, {
          status: "Assigned", // Change the status to "Assigned"
          assignedTo: nannyToApprove, // Assign the shift to the selected nanny
          applications: [], // Clear the applications array after assigning
        });

        alert("Shift approved successfully!");
        this.fetchPickedUpShifts(); // Refresh the list
      } catch (error) {
        console.error("Error approving shift:", error);
        alert("Failed to approve shift.");
      }
    },
    async declineShift(shiftId) {
      try {
        // Update the shift status to 'Declined' and reset the assignedTo field
        const shiftDoc = doc(db, "shifts", shiftId);
        await updateDoc(shiftDoc, { status: "Declined", assignedTo: null });
        alert("Shift declined successfully!");
        this.fetchPickedUpShifts(); // Refresh the list
      } catch (error) {
        console.error("Error declining shift:", error);
        alert("Failed to decline shift.");
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

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
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

button:last-child {
  background-color: #d9534f; /* Red for Decline */
}

button:last-child:hover {
  background-color: #c9302c;
}
</style>
