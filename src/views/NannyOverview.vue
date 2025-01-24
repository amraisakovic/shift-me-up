<template>
  <div>
    <h1>Nanny Overview</h1>

    <!-- Table for Nanny Information -->
    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Availability</th>
        <th>Picked Shifts</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="nanny in nannies" :key="nanny.id">
        <td>{{ nanny.name }}</td>
        <td>{{ nanny.age }}</td>
        <td>{{ nanny.availability }}</td>
        <td>{{ nanny.pickedShifts.length }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Calendar for Picked Shifts -->
    <div class="calendar-section">
      <h2>Picked Shifts Calendar</h2>
      <vue-cal
          class="availability-calendar"
          :events="calendarEvents"
          default-view="month"
          :time="24"
      ></vue-cal>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      nannies: [], // List of nannies with their information
      calendarEvents: [], // Events for the calendar
    };
  },
  methods: {
    async fetchNanniesAndShifts() {
      try {
        // Fetch all nannies
        const nanniesCollection = collection(db, "users");
        const querySnapshot = await getDocs(nanniesCollection);

        this.nannies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          pickedShifts: [], // Placeholder for nanny's picked shifts
        }));

        // Fetch picked shifts for each nanny
        for (const nanny of this.nannies) {
          if (nanny.role === "nanny") {
            const shiftsQuery = query(
                collection(db, "shifts"),
                where("assignedTo", "==", nanny.email)
            );
            const shiftsSnapshot = await getDocs(shiftsQuery);

            nanny.pickedShifts = shiftsSnapshot.docs.map((doc) => doc.data());

            // Add nanny's shifts to the calendar
            nanny.pickedShifts.forEach((shift) => {
              if (shift.date && shift.timeFrom && shift.timeTo) {
                const start = `${shift.date} ${shift.timeFrom}`;
                const end = shift.endDate
                    ? `${shift.endDate} ${shift.timeTo}`
                    : `${shift.date} ${shift.timeTo}`;

                const color =
                    shift.status === "Approved" ? "#d4edda" : "#d3d3d3"; // Light green for approved, gray otherwise

                this.calendarEvents.push({
                  title: `${shift.title} - ${nanny.name}`, // Show shift title and nanny name
                  start,
                  end,
                  class: "picked-shift-event",
                  style: { backgroundColor: color }, // Assign background color dynamically
                });
              }
            });
          }
        }

        console.log("Nannies:", this.nannies);
        console.log("Calendar Events:", this.calendarEvents);
      } catch (error) {
        console.error("Error fetching nannies and shifts:", error);
      }
    },
  },
  async mounted() {
    await this.fetchNanniesAndShifts();
  },
};
</script>

<style scoped>
/* General Styling */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.calendar-section {
  margin-top: 20px;
}

.availability-calendar {
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  font-size: 1rem;
}

::v-deep(.picked-shift-event) {
  padding: 5px;
  border-radius: 5px;
  font-size: 0.9rem;
}
</style>
