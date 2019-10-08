<template>
  <el-container class="layout-content">
    <!-- 左侧菜单 -->
    <el-aside width="250px">
      <slot name="left"></slot>
    </el-aside>

    <!-- 右侧页面 -->
    <el-main>
      <!-- 页面内容 -->
      <div class="content">
        <slot name="content"></slot>
      </div>
    </el-main>
  </el-container>
</template>
<script>
 export default {
    components: {
        
    },
    data() {
        return {

        }
    },
    created(){
        
    },
    mounted() {},
    computed:{},
    methods:{
        
    }
 }   
</script>
<style>
</style>