<template>
  <div>
    <div style="display: flex; justify-content: center">
      <el-input
        v-model="keywords"
        placeholder="通过用户名搜索用户..."
        prefix-icon="el-icon-search"
        style="width: 400px; margin-right: 10px"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="doSearch"
        >搜索</el-button
      >
    </div>
    <div class="admin-container">
      <el-card class="admin-card" v-for="(admin, index) in admins" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ admin.stuName }}</span>
          <el-button
            style="float: right; padding: 3px 0; color: red"
            icon="el-icon-delete"
            type="text"
            @click="deleteAdmin(admin)"
          ></el-button>
        </div>
        <div class="userInfo">
          <div>身份证号：{{ admin.idCard }}</div>
          <div>性别：{{ admin.sex }}</div>
          <div>
            角色名：
            <el-tag
              style="margin-right: 4px"
              type="success"
              v-for="(role, index) in admin.perNameZh"
              :key="index"
              >{{ role }}</el-tag
            >
            <el-popover
              placement="right"
              title="角色列表"
              width="200"
              @show="showPop(admin)"
              @hide="hidePop(admin)"
              trigger="click"
            ><el-select v-model="selectedRoles" multiple placeholder="请选择">
                <el-option
                  v-for="(r,index) in allRoles"
                  :key="index"
                  :label="r.nameZh"
                  :value="r.id">
                </el-option>
              </el-select>
              <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
            </el-popover>            
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysAdmin",
  data() {
    return {
      admins: [],
      keywords: "",
      allRoles:[],
      selectedRoles:[]
    };
  },
  mounted() {
    this.initAdmins();
  },
  methods: {
    hidePop(admin){
      let roles=[];
      Object.assign(roles,admin.permissId);
      let flag=false;
      if (roles.length!=this.selectedRoles.length) {
        flag=true;
      }else{
        for (let i = 0; i < roles.length; i++) {
          const role = roles[i];
          for (let j = 0; j < this.selectedRoles.length; j++) {
            const sr = this.selectedRoles[j];
            if (role==sr) {
              roles.splice(i,1);
              i--;
              break;
            }
            
          }
          
        }
        if (roles.length!=0) {
          flag=true;
        }
      }

      if (flag) {        
        let pers={};
        pers.stuId=admin.stuId;
        pers.permissId=this.selectedRoles;      
        console.log(pers);
        this.putRequest('/api/YebStuPer/Update',pers).then(resp=>{
          if (resp) {
            this.initAdmins();
          }
        });
      }


    },
    showPop(admin){
      this.initRoles();
      this.selectedRoles=admin.permissId;
    },
    initRoles(){
      this.getRequest('/api/Permiss/Permisses').then(resp=>{
        if (resp) {
          this.allRoles=resp.data;
        }
      })
    },
    deleteAdmin(admin) {
      this.$confirm(
        "此操作将永久删除【"+admin.stuName+"】操作员, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest("/api/YebStuPer/Delete?stuId=" + admin.stuId).then(
            (resp) => {
              if (resp) {
                this.initAdmins();
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    initAdmins() {
      this.getRequest(
        "/api/YebStuPer/YebStuPers?keywords=" + this.keywords
      ).then((resp) => {
        if (resp) {
          this.admins = resp.data;
        }
      });
    },
    doSearch() {
      this.initAdmins();
    },
  },
};
</script>

<style scoped>
.admin-container {
  display: flex;
  margin-top: 10px;
  justify-content: space-around;
  flex-wrap: wrap;
}
.admin-card {
  width: 350px;
  margin-bottom: 20px;
}
.userInfo {
  font-size: 14px;
  color: turquoise;
}
</style>