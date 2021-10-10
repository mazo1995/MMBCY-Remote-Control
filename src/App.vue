<template>
  <Navbar />
  <Header />
  <router-view />
</template>

<script>
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';

export default {
  components: {
    Navbar,
    Header
  }
};
</script>

<style lang="scss">
@import 'assets/scss/custom.scss';
.bg-primary{
background-color: #CCAFA5 !important;
}
.btn-success{
  border:none;
  background-color: #CCAFA5;
}
.btn-success:hover{
  background-color: #EDE7DC;
}
.btn-danger:hover {
  border: none;
  background-color:#BDC3CB !important;
}
.btn-danger{
  border: none;
  background-color: rgb(209, 94, 94) !important;
}
</style>
