<template>
  <div class="public-view-content">
    <h2>Arquivos Disponíveis para Download</h2>
    <div class="filter-container">
      <div class="filter-item">
        <label for="search">Pesquisar:</label>
        <input
          type="text"
          id="search"
          v-model="searchQuery"
          placeholder="Pesquisar por nome do arquivo..."
        />
      </div>
      <div class="filter-item">
        <label for="categoryFilter">Filtrar:</label>
        <select v-model="selectedCategory" id="categoryFilter">
          <option value="">Todas</option>
          <option value="Documentos">Documentos</option>
          <option value="Imagens">Imagens</option>
          <option value="Vídeos">Vídeos</option>
          <option value="Áudio">Áudio</option>
          <option value="Outros">Outros</option>
        </select>
      </div>
    </div>
    <ul class="file-list">
      <li v-for="file in filteredFiles" :key="file.id" class="file-item">
        <span>{{ file.name }}</span>
        <a :href="file.url" download>
          <i class="fas fa-download"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

export default {
  name: "PublicViewContent",
  setup() {
    const files = ref([]);
    const selectedCategory = ref("");
    const searchQuery = ref("");
    const filesCollection = collection(db, "files");

    const fetchFiles = async () => {
      const querySnapshot = await getDocs(filesCollection);
      files.value = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    };

    const filteredFiles = computed(() => {
      let result = files.value;
      if (selectedCategory.value) {
        result = result.filter(
          (file) => file.category === selectedCategory.value
        );
      }
      if (searchQuery.value) {
        result = result.filter((file) =>
          file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      return result;
    });

    onMounted(fetchFiles);

    return {
      files,
      selectedCategory,
      searchQuery,
      filteredFiles,
    };
  },
};
</script>

<style scoped>
.public-view-content {
  padding: 0 5px;
  background-color: white;
  border-radius: 10px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  margin-left: 310px;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.6rem;
  text-align: center;
  background: linear-gradient(90deg, #1abc9c, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.filter-container {
  margin-bottom: 20px;
  padding: 10px;
}

.filter-item {
  margin-bottom: 15px;
}

.filter-item label {
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.filter-item input,
.filter-item select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.file-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.file-item:hover {
  background-color: #e6e6e6;
}

.file-item span {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-item a {
  text-decoration: none;
  color: #42b983;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.file-item a:hover {
  color: #336699;
}

@media (max-width: 768px) {
  .public-view-content {
    margin: 0;
  }

  h2 {
    font-size: 1.2rem;
  }

  .filter-container {
    display: flex;
    flex-direction: column;
  }

  .filter-item input,
  .filter-item select {
    width: 100%;
  }

  .file-item {
    font-size: 0.9rem;
    align-items: flex-start;
    text-align: left;
  }

  .file-item span {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180px; /* Ajuste o valor conforme necessário */
  }

  .file-item a {
    font-size: 1rem;
  }
}
</style>
