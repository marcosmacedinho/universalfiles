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
          <option value="" disabled selected>Selecione uma categoria</option>
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
      <button type="submit">Fazer Upload</button>
    </form>
    <p v-if="uploadMessage" class="upload-message">{{ uploadMessage }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import { storage, db } from "../firebase.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";

export default {
  name: "UploadView",
  setup() {
    const file = ref(null);
    const category = ref("");
    const description = ref(""); // Adicione esta linha
    const uploadMessage = ref("");
    const router = useRouter();

    const handleFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const uploadFile = async () => {
      if (!file.value) {
        uploadMessage.value = "Por favor, selecione um arquivo.";
        return;
      }
      if (!category.value) {
        uploadMessage.value = "Por favor, selecione uma categoria.";
        return;
      }
      if (!description.value) {
        uploadMessage.value = "Por favor, adicione uma descrição.";
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        uploadMessage.value =
          "Você precisa estar autenticado para fazer o upload.";
        return;
      }

      try {
        const fileRef = storageRef(
          storage,
          `files/${category.value}/${file.value.name}`
        );
        await uploadBytes(fileRef, file.value);
        const url = await getDownloadURL(fileRef);

        await addDoc(collection(db, "files"), {
          name: file.value.name,
          url,
          category: category.value,
          description: description.value,
        });

        uploadMessage.value = "Upload realizado com sucesso!";
      } catch (error) {
        uploadMessage.value = `Erro ao fazer upload: ${error.message}`;
      }
    };

    const goBack = () => {
      router.back();
    };

    return {
      handleFileChange,
      uploadFile,
      uploadMessage,
      goBack,
      category,
      description, // Adicione esta linha
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
