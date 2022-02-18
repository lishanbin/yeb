<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">云E办</div>
        <el-dropdown class="userInfo" @command="commandHandler">
          <span class="el-dropdown-link">
            {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
            <!-- v-for="(item, index) in this.$router.options.routes" -->
            <template v-for="(item, index) in routes">
              <el-submenu v-if="!item.hidden" :index="index + ''" :key="index">
                <template slot="title">
                  <i
                    :class="item.iconCls"
                    style="color: #1accff; margin-right: 5px"
                  ></i>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item
                  :index="childrenItem.path"
                  v-for="(childrenItem, childrenIndex) in item.children"
                  :key="childrenIndex"
                >
                  {{ childrenItem.name }}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎来到云E办系统！
          </div>
          <router-view class="homeRouter" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem("user")),
    };
  },
  methods: {
    commandHandler(command) {
      // this.$message("click on item " + command);
      if (command == "logout") {
        this.$confirm("此操作将注销登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.getRequest("/api/Login/Logout");
            window.sessionStorage.removeItem("tokenStr");
            window.sessionStorage.removeItem("stuId");
            window.sessionStorage.removeItem("user");
            // 清空菜单信息
            this.$store.commit("initRoutes", []);

            this.$router.replace("/");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
      }
    },
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
  },
};
</script>

<style scoped>
.homeHeader {
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}
.title {
  font-size: 30px;
  font-family: "微软雅黑";
  color: white;
}
.homeHeader .userInfo {
  color: white;
  font-size: 16px;
  cursor: pointer;
}
.homeWelcome{
  text-align: center;
  font-size: 30px;
  font-family: 华文行楷;
  color: #409eff;
  padding-top: 50px;
}
.homeRouter{
  margin-top: 10px;
}
</style>