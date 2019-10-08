<template>
  <div class="login-page" :style="bodybg">
    <div class="page-center">
      <div class="info">
        <div class="title">
          <img src="@/assets/images/logo2.png" alt />
          <span></span>
        </div>
        <div class="detail">
          <span>欢迎来到联合信任后台管理系统</span>
        </div>
      </div>
      <!-- 插槽 -->
      <div class="container">
        <slot name="container"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    components: {
        
    },
    data() {
        return {
            bodybg:{backgroundImage:'url(' + require('../../assets/images/login-back.svg') + ')'},
        };
    },
    created() {},
    mounted() {},
    computed: {},
    methods: {}
};
</script>
<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
  position: absolute;
  background-image: url(../../assets/images/login-back.svg);
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  .page-center {
    position: absolute;
    width: 400px;
    height: 540px;
    margin: auto;
    top: 60px;
    right: 0;
    left: 0;
    .info {
      text-align: center;
      height: 150px;
      .title {
        display: flex;
        justify-content: center;
        align-items: Center;
        font-size: 32px;
        color: rgba(0, 0, 0, 0.85);
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        img {
          width: 200px;
          padding-bottom: 3px;
        }
      }
      .detail {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 40px;
        line-height: 1.5;
        margin-top:30px;
      }
    }
    .container {
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      padding: 35px 35px 15px 35px;
      background: #fff;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 25px #cac6c6;
    }
  }
}
</style>