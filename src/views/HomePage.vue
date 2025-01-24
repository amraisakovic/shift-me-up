<template>
  <div class="homepage">
    <!-- Background Section -->
    <div class="background">
      <div class="overlay">
        <h1 class="hero-title">Welcome to Shift Me Up</h1>
        <p class="hero-subtitle">Your platform for childcare news and tips</p>
      </div>
    </div>

    <!-- News Section -->
    <section class="news-section">
      <h2>Latest News</h2>
      <div class="news-container">
        <div class="news-card" v-for="news in newsItems" :key="news.id">
          <h3>{{ news.title }}</h3>
          <p>{{ news.description }}</p>
          <router-link :to="`/news/${news.id}`" class="read-more">Read More</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  data() {
    return {
      newsItems: [], // Array to store news
    };
  },
  methods: {
    async fetchNews() {
      try {
        const newsCollection = collection(db, "news");
        const querySnapshot = await getDocs(newsCollection);

        // Map through the database documents to extract news data
        this.newsItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },
  },
  mounted() {
    this.fetchNews(); // Fetch news on component mount
  },
};
</script>

<style scoped>

@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

/* Background Section */
.background {
  background: url("../assets/Playful Pastel Abstract Geometric Shapes Art.png") no-repeat center center/cover;
  height: 60vh; /* Adjust height as needed */
  position: relative;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.5); /* Add a dark overlay */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 20px;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  font-family: Poppins, serif;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-top: 10px;
  font-family: Poppins, serif;
}

/* News Section */
.news-section {
  padding: 40px 20px;
  text-align: center;
  background: #f8f9fa;
}

.news-section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #2e8b57;
  font-family: Poppins, serif;
}

.news-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  justify-content: center;
}

.news-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-card h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
  font-family: Poppins, serif;
}

.news-card p {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 15px;
  font-family: Poppins, serif;
}

.read-more {
  display: inline-block;
  background-color: #2e8b57;
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  font-family: Poppins, serif;
}

.read-more:hover {
  background-color: #276c48;
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .news-section h2 {
    font-size: 1.8rem;
  }

  .news-card {
    padding: 15px;
  }
}

@media screen and (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .news-section h2 {
    font-size: 1.5rem;
  }

  .news-card {
    padding: 10px;
  }

  .read-more {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}
</style>
