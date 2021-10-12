<template>
  <div id="app">
    <el-container>
      <el-container>
        <el-aside width="200px" style="background-color: rgb(84, 92, 100)">
          <el-menu
            default-active="/home"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
          >
            <el-menu-item index="/">
              <i class="el-icon-menu"></i>
              <span slot="title">HOME</span>
            </el-menu-item>
            <el-menu-item index="/hot/test">
              <i class="el-icon-document"></i>
              <span slot="title">HOT</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
