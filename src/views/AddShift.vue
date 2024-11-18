<template>
  <div class="add-shift-container">
    <form @submit.prevent="addShift">
      <h1>Add a New Shift</h1>

      <div class="form-group">
        <label for="title">Job Title:</label>
        <input v-model="newShift.title" type="text" id="title" placeholder="Enter job title" />
      </div>

      <div class="form-group">
        <label for="pay">Pay:</label>
        <input v-model="newShift.pay" type="text" id="pay" placeholder="Enter pay (e.g., $20/hour)" />
      </div>

      <div class="form-group">
        <label for="location">Location:</label>
        <input v-model="newShift.location" type="text" id="location" placeholder="Enter location" />
      </div>

      <div class="form-group">
        <label for="children">Number of Children:</label>
        <input v-model.number="newShift.children" type="number" id="children" placeholder="Enter number of children" />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea v-model="newShift.description" id="description" placeholder="Enter job description"></textarea>
      </div>

      <div class="form-group">
        <label for="date">Date:</label>
        <input v-model="newShift.date" type="date" id="date" />
      </div>

      <div class="form-group">
        <label for="time">Start Time:</label>
        <input v-model="newShift.timeFrom" type="time" id="timeFrom" />
      </div>

      <div class="form-group">
        <label for="duration">Duration (hours):</label>
        <input v-model.number="newShift.duration" type="number" id="duration" placeholder="Enter duration in hours" />
      </div>

      <button type="submit">Add Shift</button>
    </form>
  </div>
</template>

<script>
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      newShift: {
        title: "",
        pay: "",
        location: "",
        children: 0,
        description: "",
        date: "",
        timeFrom: "",
        duration: 0, // Duration in hours
      },
    };
  },
  methods: {
    async addShift() {
      try {
        const startTime = new Date(`${this.newShift.date}T${this.newShift.timeFrom}`);
        const endTime = new Date(startTime.getTime() + this.newShift.duration * 60 * 60 * 1000);
        const formattedEndTime = endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
        const formattedEndDate = endTime.toISOString().split("T")[0];

        const shiftsCollection = collection(db, "shifts");
        const docRef = await addDoc(shiftsCollection, {
          ...this.newShift,
          timeTo: formattedEndTime,
          endDate: formattedEndDate,
          createdAt: new Date().toISOString(),
          assignedTo: null,
          status: "Unassigned",
        });

        console.log("Shift added with ID:", docRef.id);
        alert("Shift added successfully!");
        this.resetForm();
      } catch (error) {
        console.error("Error adding shift:", error);
        alert("Failed to add shift! Please check your Firebase setup.");
      }
    },
    resetForm() {
      this.newShift = {
        title: "",
        pay: "",
        location: "",
        children: 0,
        description: "",
        date: "",
        timeFrom: "",
        duration: 0,
      };
    },
  },
};
</script>

<style scoped>
/* Import Poppins Font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

/* General Styling */
.add-shift-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
  color: #2e8b57;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

input,
textarea {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  background-color: #2e8b57;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #276c48;
  transform: scale(1.02);
}

/* Add subtle transition */
button:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .add-shift-container {
    padding: 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  input,
  textarea {
    font-size: 0.9rem;
  }

  button {
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>
