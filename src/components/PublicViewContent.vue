<template>
  <div class="public-view-content">
    <h2>Arquivos Disponíveis para Download</h2>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando arquivos...</p>
    </div>
    <div v-else>
      <div class="filter-container">
        <div class="filter-item">
          <label for="search">Pesquisar:</label>
          <input
            type="text"
            id="search"
            v-model="searchQuery"
            placeholder="Pesquisar por nome do arquivo ou descrição..."
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
          <div class="file-info">
            <span>{{ file.name }}</span>
            <div class="file-actions">
              <a :href="file.url" download>
                <i class="fas fa-download"></i>
              </a>
              <i
                :class="
                  file.isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
                "
                @click="toggleDescription(file.id)"
              ></i>
            </div>
          </div>
          <div v-if="file.isExpanded" class="file-description">
            <p>{{ file.description }}</p>
          </div>
        </li>
      </ul>
    </div>
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
    const loading = ref(true); // Estado de loading
    const selectedCategory = ref("");
    const searchQuery = ref("");
    const filesCollection = collection(db, "files");

    const fetchFiles = async () => {
      const querySnapshot = await getDocs(filesCollection);
      files.value = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        isExpanded: false, // Inicialmente, a descrição está contraída
      }));
      loading.value = false; // Desativar o loading após o carregamento
    };

    const toggleDescription = (fileId) => {
      const file = files.value.find((f) => f.id === fileId);
      if (file) {
        file.isExpanded = !file.isExpanded;
      }
    };

    const filteredFiles = computed(() => {
      let result = files.value;
      if (selectedCategory.value) {
        result = result.filter(
          (file) => file.category === selectedCategory.value
        );
      }
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(
          (file) =>
            file.name.toLowerCase().includes(query) ||
            file.description.toLowerCase().includes(query) // Filtrar também pela descrição
        );
      }
      return result;
    });

    onMounted(fetchFiles);

    return {
      files,
      loading,
      selectedCategory,
      searchQuery,
      filteredFiles,
      toggleDescription,
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
  background-color: #ccc;
  padding: 15px;
  border-radius: 10px;
}

.filter-item {
  margin-bottom: 15px;
}

.filter-item label {
  font-weight: bold;
  color: #000000;
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
  border-radius: 10px;
  outline: 0.5px #333 solid;
}

.file-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  flex-direction: column;
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

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.file-actions i,
.file-actions a {
  font-size: 1.3rem;
  cursor: pointer;
}

.file-description {
  padding: 10px 0;
  margin-top: 5px;
  border-top: 1px solid #ddd;
}

.file-description p {
  margin: 0 0 10px;
  color: #666;
}

/* Estilos para o loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top: 5px solid #1abc9c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
    text-align: left;
  }

  .file-info i {
    font-size: 1.2rem;
  }

  .file-item span {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180px; /* Ajuste o valor conforme necessário */
  }

  .file-description a {
    font-size: 1rem;
  }
}
</style>
