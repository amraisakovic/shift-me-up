<template>
  <div>
    <h1>Nanny Overview</h1>
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
        <td>{{ nanny.pickedShifts }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      nannies: [], // List of nannies
    };
  },
  async mounted() {
    const nanniesCollection = collection(db, "users");
    const querySnapshot = await getDocs(nanniesCollection);
    this.nannies = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};
</script>
