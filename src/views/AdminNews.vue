<template>
  <div class="admin-news">
    <h1>Manage News</h1>

    <!-- Add/Edit News Form -->
    <form @submit.prevent="isEditing ? updateNews() : addNews()">
      <div class="form-group">
        <label for="title">Title</label>
        <input
            v-model="newsForm.title"
            type="text"
            id="title"
            placeholder="Enter news title"
            required
        />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea
            v-model="newsForm.description"
            id="description"
            placeholder="Enter news description"
            required
        ></textarea>
      </div>
      <button type="submit" class="save-button">
        {{ isEditing ? "Update News" : "Add News" }}
      </button>
    </form>

    <!-- News List -->
    <h2>News List</h2>
    <div v-if="newsItems.length === 0" class="no-news">No news available.</div>
    <ul class="news-list">
      <li v-for="news in newsItems" :key="news.id">
        <h3>{{ news.title }}</h3>
        <p>{{ news.description }}</p>
        <button class="edit-button" @click="editNews(news)">Edit</button>
        <button class="delete-button" @click="deleteNews(news.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      newsItems: [], // List of news items
      newsForm: {
        id: null,
        title: "",
        description: "",
      },
      isEditing: false, // Track whether editing or adding
    };
  },
  methods: {
    async fetchNews() {
      try {
        const newsCollection = collection(db, "news");
        const querySnapshot = await getDocs(newsCollection);
        this.newsItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },
    async addNews() {
      try {
        const newsCollection = collection(db, "news");
        await addDoc(newsCollection, {
          title: this.newsForm.title,
          description: this.newsForm.description,
        });
        alert("News added successfully!");
        this.resetForm();
        this.fetchNews(); // Refresh the news list
      } catch (error) {
        console.error("Error adding news:", error);
        alert("Failed to add news. Please try again.");
      }
    },
    async updateNews() {
      try {
        const newsRef = doc(db, "news", this.newsForm.id);
        await updateDoc(newsRef, {
          title: this.newsForm.title,
          description: this.newsForm.description,
        });
        alert("News updated successfully!");
        this.resetForm();
        this.fetchNews(); // Refresh the news list
      } catch (error) {
        console.error("Error updating news:", error);
        alert("Failed to update news. Please try again.");
      }
    },
    async deleteNews(newsId) {
      if (!confirm("Are you sure you want to delete this news item?")) return;

      try {
        const newsRef = doc(db, "news", newsId);
        await deleteDoc(newsRef);
        alert("News deleted successfully!");
        this.fetchNews(); // Refresh the news list
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("Failed to delete news. Please try again.");
      }
    },
    editNews(news) {
      this.newsForm = { ...news };
      this.isEditing = true;
    },
    resetForm() {
      this.newsForm = {
        id: null,
        title: "",
        description: "",
      };
      this.isEditing = false;
    },
  },
  mounted() {
    this.fetchNews(); // Fetch all news on mount
  },
};
</script>

<style scoped>
/* Page Container */
.admin-news {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Poppins, sans-serif;
}

h1 {
  color: #2e8b57;
  text-align: center;
  margin-bottom: 20px;
}

/* Form Styling */
form {
  background: #f8f9fa;
  padding: 70px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
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
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
  height: 100px;
}

.save-button {
  background-color: #2e8b57;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.save-button:hover {
  background-color: #276c48;
}

/* News List Styling */
.news-list {
  list-style: none;
  padding: 0;
}

.news-list li {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.news-list h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.news-list p {
  font-size: 0.9rem;
  color: #555;
}

.edit-button,
.delete-button {
  background: #2e8b57;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 0.9rem;
}

.delete-button {
  background: #d9534f;
}

.edit-button:hover {
  background: #276c48;
}

.delete-button:hover {
  background: #c9302c;
}

/* No News Message */
.no-news {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
}
</style>
