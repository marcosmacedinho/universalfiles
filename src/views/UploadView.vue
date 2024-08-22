<template>
    <div class="upload-container">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i> Voltar
      </button>
      <h2>Upload de Arquivo</h2>
      <form @submit.prevent="uploadFile">
        <div class="input-group">
          <label for="file">Escolha um arquivo:</label>
          <input type="file" id="file" @change="handleFileChange" required />
        </div>
        <div class="input-group">
          <label for="category">Categoria:</label>
          <select v-model="category" id="category" required>
            <option value="" disabled>Selecione uma categoria</option>
            <option value="Documentos">Documentos</option>
            <option value="Imagens">Imagens</option>
            <option value="Vídeos">Vídeos</option>
            <option value="Áudio">Áudio</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div class="input-group">
          <label for="description">Descrição:</label>
          <input type="text" id="description" v-model="description" required />
        </div>
  
        <div v-if="uploadProgress > 0" class="progress-container">
          <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
          <p>{{ uploadProgress.toFixed(0) }}%</p>
        </div>
  
        <button type="submit">Fazer Upload</button>
      </form>
      <p v-if="uploadMessage" class="upload-message">{{ uploadMessage }}</p>
    </div>
  </template>

<script>
import { ref } from "vue";
import { storage, db } from "../firebase";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  name: "UploadView",
  setup() {
    const file = ref(null);
    const category = ref("");
    const description = ref("");
    const uploadMessage = ref("");
    const uploadProgress = ref(0);
    const router = useRouter();

    const handleFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const uploadFile = async () => {
      if (!file.value) {
        uploadMessage.value = "Por favor, selecione um arquivo.";
        hideMessage();
        return;
      }
      if (!category.value) {
        uploadMessage.value = "Por favor, selecione uma categoria.";
        hideMessage();
        return;
      }
      if (!description.value) {
        uploadMessage.value = "Por favor, adicione uma descrição.";
        hideMessage();
        return;
      }

      try {
        const fileRef = storageRef(
          storage,
          `files/${category.value}/${file.value.name}`
        );

        const uploadTask = uploadBytesResumable(fileRef, file.value);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            uploadProgress.value =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.error("Erro ao fazer upload: ", error);
            uploadMessage.value = `Erro ao fazer upload: ${error.message}`;
            hideMessage();
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);

            await addDoc(collection(db, "files"), {
              name: file.value.name,
              url,
              category: category.value,
              description: description.value,
              createdAt: new Date(),
            });

            uploadMessage.value = "Upload realizado com sucesso!";
            hideMessage();
            uploadProgress.value = 0; // Resetar a barra de progresso após o upload
          }
        );
      } catch (error) {
        console.error("Erro ao fazer upload: ", error);
        uploadMessage.value = `Erro ao fazer upload: ${error.message}`;
        hideMessage();
      }
    };

    const hideMessage = () => {
      setTimeout(() => {
        uploadMessage.value = "";
      }, 3000);
    };

    const goBack = () => {
      router.back();
    };

    return {
      handleFileChange,
      uploadFile,
      uploadMessage,
      uploadProgress,
      goBack,
      category,
      description,
    };
  },
};
</script>


<style scoped>
.upload-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-button {
  background-color: transparent;
  border: none;
  font-size: 1rem;
  color: #42b983;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.back-button i {
  margin-right: 8px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="file"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-message {
  color: green;
  margin-top: 10px;
  text-align: center;
}

.progress-container {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  height: 15px;
  background-color: #42b983;
  border-radius: 5px;
  transition: width 0.3s ease;
  flex-grow: 1;
  margin-bottom: 10px
}

.progress-container p {
  margin: 0;
  font-weight: bold;
}

@media (max-width: 768px) {
  .upload-container {
    padding: 15px;
    margin: 20px;
  }

  h2 {
    font-size: 1.2rem;
  }

  .input-group {
    margin-bottom: 10px;
  }

  input[type="file"],
  select {
    padding: 8px;
  }

  button {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}
</style>
