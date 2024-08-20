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
            @keyup.enter="updateFileName(file.id, file.url)" 
            @blur="cancelEdit" 
            class="edit-input" 
            type="text" 
          />
          <button @click="updateFileName(file.id, file.url)">
            <i class="fas fa-check"></i>
          </button>
          <button @click="cancelEdit">
            <i class="fas fa-times"></i>
          </button>
        </template>
        <template v-else>
          <span>{{ file.name }}</span>
          <div class="file-actions">
            <button @click="startEdit(file.id, file.name)">
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
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const files = ref([]);
    const filesCollection = collection(db, "files");
    const editFileId = ref(null);
    const editFileName = ref("");
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
        // Extract file path from URL and delete from Firebase Storage
        const storagePath = decodeURIComponent(fileUrl.split("/o/")[1].split("?")[0]); // Extract file path
        const fileRef = storageRef(storage, storagePath);
        await deleteObject(fileRef);

        // Remove file metadata from Firestore
        const fileDoc = doc(db, "files", id);
        await deleteDoc(fileDoc);

        // Refresh the file list
        await fetchFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    };

    const startEdit = (id, name) => {
      editFileId.value = id;
      editFileName.value = name;
    };

    const cancelEdit = () => {
      editFileId.value = null;
      editFileName.value = "";
    };

    const updateFileName = async (id, oldFileUrl) => {
      try {
        // Extract file path from URL and prepare new file path
        const oldStoragePath = decodeURIComponent(oldFileUrl.split("/o/")[1].split("?")[0]); // Extract old file path
        const newStoragePath = oldStoragePath.replace(/[^\/]*$/, `${editFileName.value}`); // Replace file name in path

        // Copy file to new path
        const oldFileRef = storageRef(storage, oldStoragePath);
        const newFileRef = storageRef(storage, newStoragePath);
        const oldFileSnapshot = await getDownloadURL(oldFileRef);
        const fileBlob = await fetch(oldFileSnapshot).then(res => res.blob());
        await uploadBytes(newFileRef, fileBlob);

        // Delete old file
        await deleteObject(oldFileRef);

        // Update Firestore document with new file name and URL
        const newFileUrl = await getDownloadURL(newFileRef);
        const fileDoc = doc(db, "files", id);
        await updateDoc(fileDoc, { name: editFileName.value, url: newFileUrl });

        // Refresh the file list
        cancelEdit();
        await fetchFiles();
      } catch (error) {
        console.error("Error updating file name:", error);
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
      updateFileName,
      goBack,
      editFileId,
      editFileName,
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
