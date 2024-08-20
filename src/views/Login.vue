<template>
  <div class="login-container">
    <button class="back-button" @click="goBack">
      <i class="fas fa-arrow-left"></i> Voltar
    </button>
    <h2>Acesso do Administrador</h2>
    <form @submit.prevent="login">
      <div class="input-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="input-group">
        <label for="password">Senha:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Entrar</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  name: "LoginView",
  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const router = useRouter();

    const login = async () => {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        const redirectTo =
          router.currentRoute.value.query.redirect || "/public";
        router.push(redirectTo);
      } catch (error) {
        errorMessage.value = "Erro ao fazer login: " + error.message;
      }
    };

    const goBack = () => {
      router.back();
    };

    return {
      email,
      password,
      errorMessage,
      login,
      goBack,
    };
  },
};
</script>

<style scoped>
.login-container {
  max-width: 100%;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #1abc9c;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}


.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

@media (max-width: 600px) {
  .login-container {
    padding: 15px;
    max-width: 85%;
  }

  .input-group {
    margin-bottom: 10px;
  }

  button {
    padding: 8px;
  }
}
</style>
