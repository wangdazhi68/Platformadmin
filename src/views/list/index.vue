<template>
  <div class="home" :style="bodybg">
    <div class="home-body">
      <h4 class="title">欢迎来到联合信任后台管理系统</h4>
      <p class="des">让时间为你作证</p>
    </div>
  </div>
</template>
<script>
export default {
    components: {
        
    },
    data() {
        return {
            bodybg:{backgroundImage:'url(' + require('../../assets/images/loginbg.png') + ')'},
        };
    },
    created() {},
    mounted() {},
    computed: {},
    methods: {}
};
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}
.home-body {
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    text-align: center;
    padding: 100px;
    box-sizing: border-box;
    min-height: 600px;
  }
.title {
    font-size: 32px;
    font-weight: bold;
    line-height: 60px;
}
.des {
    font-size: 18px;
    margin: 40px 0;
}
</style>