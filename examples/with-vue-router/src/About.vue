<template>
  <div class="about-page">
    <h1>{{ title }}</h1>
    <router-link to="/">
      Home
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'About Page'
    };
  }
};
</script>

<style>

</style>
