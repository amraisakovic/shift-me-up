<template>
  <div class="existing-shifts-container">
    <h1>Existing Shifts</h1>

    <!-- Loading Indicator -->
    <div v-if="loading" class="loading">Loading shifts...</div>

    <!-- Shifts List -->
    <div v-if="!loading && shifts.length" class="shifts-list">
      <div class="shift-card" v-for="shift in shifts" :key="shift.id">
        <p><strong>Title:</strong> {{ shift.title }}</p>
        <p><strong>Status:</strong> {{ shift.status }}</p>
        <p><strong>Assigned To:</strong> {{ shift.assignedTo }}</p>
        <p><strong>Date:</strong> {{ shift.date }}</p>
        <p><strong>End Date:</strong> {{ shift.endDate }}</p>
        <p><strong>Time:</strong> {{ shift.timeFrom }} - {{ shift.timeTo }}</p>
        <p><strong>Location:</strong> {{ shift.partialLocation }}</p>
        <p><strong>Pay:</strong> {{ shift.pay }}</p>
      </div>
    </div>

    <!-- No Shifts Message -->
    <div v-if="!loading && shifts.length === 0" class="no-shifts">
      No shifts available.
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure your Firebase configuration is correct

export default {
  data() {
    return {
      shifts: [], // Store fetched shifts from Firestore
      loading: true, // Show loading indicator until data is fetched
    };
  },
  methods: {
    async fetchShifts() {
      try {
        const shiftsCollection = collection(db, "shifts"); // Firestore collection name
        const snapshot = await getDocs(shiftsCollection);

        // Map Firestore data into usable format
        this.shifts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched shifts:", this.shifts);
      } catch (error) {
        console.error("Error fetching shifts:", error);
        alert("Failed to load shifts. Please try again.");
      } finally {
        this.loading = false; // Hide loading indicator after fetching
      }
    },
  },
  mounted() {
    this.fetchShifts(); // Fetch shifts when the component is mounted
  },
};
</script>

<style scoped>
/* Layout Adjustments */
.existing-shifts-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align to the left based on the sidebar */
  padding: 20px;
  background-color: #f8f9fa; /* Light gray background */
  margin-left: 80px; /* Accounts for the closed sidebar width */
  min-height: 100vh;
  width: calc(100% - 80px); /* Adjust width to exclude sidebar */
  box-sizing: border-box; /* Include padding and margin in width calculations */
}

/* Center Content Dynamically */
@media (min-width: 768px) {
  .existing-shifts-container {
    align-items: center; /* Center content on larger screens */
    margin-left: 250px; /* Accounts for the expanded sidebar width */
    width: calc(100% - 250px); /* Adjust width for the larger sidebar */
  }
}

/* Heading Styling */
.existing-shifts-container h1 {
  font-size: 1.8rem;
  color: #2e8b57; /* Emerald green */
  margin-bottom: 20px;
  text-align: left; /* Align to the left */
  width: 100%; /* Occupy full width */
}

/* Cards Container */
.shifts-list {
  display: flex;
  flex-wrap: wrap; /* Wrap cards to the next line when needed */
  gap: 15px; /* Space between cards */
  justify-content: flex-start; /* Align cards to the left */
  width: 100%;
}

/* Card Styling */
.shift-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  padding: 15px;
  font-size: 1rem;
  line-height: 1.4;
  color: #333; /* Dark gray text */
  flex: 1 1 calc(300px); /* Minimum width of 300px, adjusts dynamically */
  max-width: 500px; /* Prevent cards from being too wide */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  word-wrap: break-word; /* Handle long text gracefully */
}

/* Adjust Card Size Dynamically Based on Content */
.shift-card p {
  margin: 5px 0;
}

/* Hover Effect */
.shift-card:hover {
  transform: translateY(-5px); /* Lift the card slightly */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow */
}

/* Loading Indicator */
.loading {
  font-size: 1.2rem;
  color: #2e8b57;
  text-align: center;
  margin: 20px 0;
}

/* No Shifts Message */
.no-shifts {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin: 20px 0;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .existing-shifts-container {
    margin-left: 10px; /* Closed sidebar width */
    width: calc(100% - 40px); /* Adjust for smaller screens */
    align-items: flex-start; /* Keep content aligned left */
  }

  .shift-card {
    flex: 1 1 100%; /* Full width for smaller screens */
  }

  .shifts-list {
    justify-content: center; /* Center cards on smaller screens */
  }
}

@media (max-width: 480px) {
  .existing-shifts-container h1 {
    font-size: 1rem; /* Smaller heading size */
  }

  .shift-card {
    font-size: 0.7rem; /* Smaller font for compact screens */
    padding: 10px;
  }
}
</style>
