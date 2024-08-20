<template>
  <div>
    <button class="menu-button" @click="toggleSidebar" v-if="isMobile">
      <i class="fas fa-bars"></i>
    </button>
    <div :class="['sidebar', { 'sidebar-open': isSidebarOpen }]">
      <div class="sidebar-header">
        <h2>Universal Files 3.0</h2>
        <button class="close-button" @click="toggleSidebar" v-if="isMobile">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <ul>
        <li
          v-for="link in links"
          :key="link.name"
          :class="{ active: isActive(link.path) }"
        >
          <router-link :to="link.path" class="sidebar-link">
            <i :class="link.icon"></i>
            <span>{{ link.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      links: [
        {
          name: "Arquivos Disponíveis",
          path: "/public",
          icon: "fas fa-folder-open",
        },
        { name: "Upload de Arquivos", path: "/upload", icon: "fas fa-upload" },
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: "fas fa-tachometer-alt",
        },
      ],
      isSidebarOpen: false,
      isMobile: window.innerWidth <= 768,
    };
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    updateSidebarState() {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.isSidebarOpen = true;
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.updateSidebarState);
    this.updateSidebarState();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateSidebarState);
  },
};
</script>

<style scoped>
.sidebar {
  width: 270px;
  background-color: #2c3e50;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 2rem;
  background: linear-gradient(90deg, #1abc9c, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-header .close-button {
  display: none;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  margin-bottom: 40px;
}

.sidebar ul li:last-child {
  margin-bottom: 0;
}

.sidebar-link {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.sidebar-link i {
  margin-right: 10px;
  font-size: 1.5rem;
}

.sidebar-link:hover {
  color: #1abc9c;
}

.sidebar-link.active {
  color: #1abc9c;
  font-weight: bold;
}

.menu-button {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #1abc9c; /* Fallback color */
  cursor: pointer;
  z-index: 1001;

  /* Aplicar o gradiente ao texto */
  background: linear-gradient(90deg, #1abc9c, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.7rem;
  color: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .sidebar {
    width: 55%;
    transform: translateX(-100%);
  }
  .sidebar-header h2 {
    font-size: 1.3rem;
  }
  .sidebar-open {
    transform: translateX(0);
  }

  .menu-button {
    display: block;
  }

  .sidebar-header .close-button {
    display: block;
  }
}
</style>
