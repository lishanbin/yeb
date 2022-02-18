<template>
  <div>
    <el-form
      :rules="LoginFormRules"
      v-loading="loading"
      element-loading-text="正在登陆..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      ref="loginFormRef"
      :model="loginForm"
      class="loginContainer"
    >
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input
          auto-complete
          type="text"
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          auto-complete="false"
          type="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          auto-complete="false"
          type="text"
          v-model="loginForm.code"
          placeholder="点击图片更换验证码"
          style="width: 250px; margin-right: 5px"
        ></el-input>
        <img :src="captchaUrl" @click="updateCaptcha" style="cursor: pointer" />
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      captchaUrl: "/api/Captcha?time=" + new Date(),
      checked: true,
      loginForm: {
        username: "admin",
        password: "123",
        code: "",
      },
      LoginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitLogin() {
      this.$refs["loginFormRef"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest("/api/Login/Login", this.loginForm)
            .then((resp) => {
              this.loading = false;
              if (resp) {                
                //存储用户token
                const tokenStr = resp.data.jwtToken;
                const stuId = resp.data.id;
                window.sessionStorage.setItem("tokenStr", tokenStr);
                window.sessionStorage.setItem("stuId", stuId);
                //页面跳转
                let path = this.$route.query.redirect;
                this.$router.replace(
                  path == "/" || path == undefined ? "/home" : path
                );
              }
            })
            .catch(function (error) {
              // 处理前一个回调函数运行时发生的错误
              console.log("发生错误！", error);
               this.loading = false;
               this.$router.replace('/');
            });
        } else {
          this.$message.error("请输入所有的字段！");
          return false;
        }
      });
    },
    updateCaptcha() {
      this.captchaUrl = "/api/Captcha?time=" + new Date();
    },
  },
};
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}
.loginRemember {
  text-align: left;
  margin: 0 0 15px 0;
}
.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>