<template>
  <div class="dashboard-container">
    <button class="back-button" @click="goBack">
      <i class="fas fa-arrow-left"></i> Voltar
    </button>
    <h2>Gerenciamento de Arquivos</h2>

    <ul class="file-list">
      <li v-for="file in files" :key="file.id" class="file-item">
        <template v-if="editFileId === file.id">
          <input 
            v-model="editFileName" 
            class="edit-input" 
            type="text" 
          />
          <select v-model="editCategory">
            <option value="Documentos">Documentos</option>
            <option value="Imagens">Imagens</option>
            <option value="Vídeos">Vídeos</option>
            <option value="Áudio">Áudio</option>
            <option value="Outros">Outros</option>
          </select>
          <input 
            v-model="editDescription" 
            class="edit-input" 
            type="text" 
          />
          <button @click="updateFileDetails(file.id)">
            <i class="fas fa-check"></i>
          </button>
          <button @click="cancelEdit">
            <i class="fas fa-times"></i>
          </button>
        </template>
        <template v-else>
          <span>{{ file.name }} - {{ file.category }} - {{ file.description }}</span>
          <div class="file-actions">
            <button @click="startEdit(file)">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <a :href="file.url" download>
              <i class="fas fa-download"></i>
            </a>
            <button @click="deleteFile(file.id, file.url)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db, storage } from "../firebase.js";
import { ref as storageRef, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const files = ref([]);
    const filesCollection = collection(db, "files");
    const editFileId = ref(null);
    const editFileName = ref("");
    const editCategory = ref("");
    const editDescription = ref("");
    const router = useRouter();

    const fetchFiles = async () => {
      try {
        const querySnapshot = await getDocs(filesCollection);
        files.value = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    const deleteFile = async (id, fileUrl) => {
      try {
        const storagePath = decodeURIComponent(fileUrl.split("/o/")[1].split("?")[0]); 
        const fileRef = storageRef(storage, storagePath);
        await deleteObject(fileRef);
        const fileDoc = doc(db, "files", id);
        await deleteDoc(fileDoc);
        await fetchFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    };

    const startEdit = (file) => {
      editFileId.value = file.id;
      editFileName.value = file.name;
      editCategory.value = file.category;
      editDescription.value = file.description;
    };

    const cancelEdit = () => {
      editFileId.value = null;
      editFileName.value = "";
      editCategory.value = "";
      editDescription.value = "";
    };

    const updateFileDetails = async (id) => {
      try {
        const fileDoc = doc(db, "files", id);
        await updateDoc(fileDoc, { 
          name: editFileName.value,
          category: editCategory.value,
          description: editDescription.value 
        });
        cancelEdit();
        await fetchFiles();
      } catch (error) {
        console.error("Error updating file details:", error);
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(fetchFiles);

    return {
      files,
      deleteFile,
      startEdit,
      cancelEdit,
      updateFileDetails,
      goBack,
      editFileId,
      editFileName,
      editCategory,
      editDescription,
    };
  },
};
</script>

<style scoped>
.dashboard-container {
  max-width: 100%;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.back-button {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #1abc9c;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.back-button i {
  margin-right: 8px;
}

.back-button:hover {
  color: #16a085;
}

.file-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.file-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.file-actions a,
.file-actions button {
  background-color: transparent;
  border: none;
  color: #42b983;
  font-size: 1rem;
  cursor: pointer;
}

.file-actions button {
  color: #ff4d4d;
}

.file-actions button:hover {
  color: #d43d3d;
}

.file-actions i {
  font-size: 1.2rem;
}

.edit-input {
  font-size: 1rem;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
  width: auto;
}

.edit-input:focus {
  outline: none;
  border-color: #1abc9c;
}

@media (max-width: 600px) {
  .file-actions a,
  .file-actions button {
    font-size: 0.9rem;
  }

  .file-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
