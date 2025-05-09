<template>
  <div class="profile">
    <div class="navbar">
      <h1>Your Profile</h1>
    </div>

    <!-- User Email -->
    <div class="profile-card">
      <p><strong>Email:</strong> {{ email }}</p>
    </div>

    <!-- Display Profile -->
    <div class="profile-details">
      <div class="details-card">
        <p><strong>Name:</strong> {{ profile.name }}</p>
        <p><strong>Age:</strong> {{ profile.age }}</p>
        <p><strong>Experience:</strong> {{ profile.experience }}</p>
        <p><strong>Preferred Location:</strong> {{ profile.preferredLocation }}</p>
      </div>
    </div>

    <!-- Calendar for Picked Shifts -->
    <div class="calendar-section">
      <h2>Picked Shifts</h2>
      <vue-cal
          class="availability-calendar"
          :events="calendarEvents"
          default-view="month"
          time="24"
      ></vue-cal>
    </div>

    <!-- Shift Counter and Milestone -->
    <div class="milestones">
      <div class="milestone-card">
        <h2>Picked Shifts: {{ shiftCounter }}</h2>
        <p>Milestone: <strong>{{ milestone }}</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      email: "",
      profile: {
        name: "",
        age: "",
        experience: "",
        preferredLocation: "",
      },
      shiftCounter: 0,
      calendarEvents: [], // Events for the calendar
    };
  },
  computed: {
    milestone() {
      if (this.shiftCounter <= 5) {
        return "Newbie";
      } else if (this.shiftCounter <= 10) {
        return "Intermediate";
      } else if (this.shiftCounter <= 20) {
        return "Pro";
      } else {
        return "Master";
      }
    },
  },
  methods: {
    async fetchProfileAndShifts() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        this.$router.push("/login");
        return;
      }

      this.email = user.email;
      const userRef = doc(db, "users", user.uid);

      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.firstLogin) {
            this.$router.push("/setup");
          } else {
            this.profile = {
              name: data.name || "Not Provided",
              age: data.age || "Not Provided",
              experience: data.experience || "Not Provided",
              preferredLocation: data.preferredLocation || "Not Provided",
            };
            this.shiftCounter = data.shiftCounter || 0;
          }
        } else {
          console.error("User data not found in Firestore.");
        }

        // Fetch picked-up shifts
        await this.fetchPickedShifts(user.email);
      } catch (error) {
        console.error("Error fetching profile and shifts:", error);
      }
    },
    async fetchPickedShifts(userEmail) {
      try {
        const shiftsCollection = collection(db, "shifts");
        const q = query(shiftsCollection, where("assignedTo", "==", userEmail));
        const querySnapshot = await getDocs(q);

        this.calendarEvents = querySnapshot.docs
            .map((doc) => {
              const shift = doc.data();
              if (shift.date && shift.timeFrom && shift.timeTo) {
                const start = `${shift.date} ${shift.timeFrom}`;
                const end = `${shift.date} ${shift.timeTo}`;

                return {
                  title: shift.title,
                  start,
                  end,
                  class: "picked-shift-event",
                };
              } else {
                console.warn("Shift data is missing required fields:", shift);
                return null; // Skip invalid events
              }
            })
            .filter(Boolean); // Remove any null or invalid entries

        console.log("Final events for calendar:", this.calendarEvents);
      } catch (error) {
        console.error("Error fetching picked shifts:", error);
      }
    },
  },
  mounted() {
    this.fetchProfileAndShifts();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

/* General Styling */
.profile {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f4f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Poppins", sans-serif;
}

.navbar h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
}

.profile-card {
  background: #e6f7f1;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.details-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.calendar-section {
  margin-top: 20px;
}

.milestones {
  margin-top: 20px;
}

.milestone-card {
  background: #d1f7d6;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #8bc34a;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.milestone-card h2 {
  color: #2e8b57;
}

.availability-calendar {
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  font-size: 1rem;
}

::v-deep(.picked-shift-event) {
  background-color: #fdf6ec; /* Light orange background */
  color: #333; /* Text color */
  border: 2px solid #ffa500; /* Orange border */
  border-radius: 5px; /* Rounded corners */
  padding: 5px; /* Padding inside the event */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  font-weight: bold; /* Bold text */
  font-size: 0.9rem; /* Slightly smaller text */
}
</style>
