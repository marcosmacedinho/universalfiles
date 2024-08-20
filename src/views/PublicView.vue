<!-- src/views/PublicView.vue -->
<template>
    <div class="public-view-container">
      <Sidebar />
      <PublicViewContent />
    </div>
  </template>
  
  <script>
  import Sidebar from '../components/Sidebar.vue';
  import PublicViewContent from '../components/PublicViewContent.vue';
  
  export default {
    name: "PublicView",
    components: {
      Sidebar,
      PublicViewContent,
    },
  };
  </script>
  
  <style scoped>
  .public-view-container {
    display: flex;
    height: 100dvh;
  }
  </style>
  