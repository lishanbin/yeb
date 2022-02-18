<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div>
        <el-input
          style="width: 300px; margin-right: 10px"
          prefix-icon="el-icon-search"
          placeholder="请输入员工名进行搜索..."
        ></el-input>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary">
          <i class="fa fa-angle-double-down" aria-hidden="true"></i>
          高级搜索</el-button
        >
      </div>
      <div>
        <el-upload
          style="display:inline-flex;margin-right:8px;"
          :headers="headers"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
          :disabled="importDataDisabled"
          >
          <el-button type="success" :disabled="importDataDisabled" :icon="importDataBtnIcon">
            {{importDataBtnText}}
          </el-button>
        </el-upload>
        
        <el-button type="success" @click="exportData" icon="el-icon-download">
          导出数据
        </el-button>
        <el-button type="primary" icon="el-icon-plus">添加员工</el-button>
      </div>
    </div>
    <div style="margin-top:10px;">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="emps"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="name"
          fixed
          label="姓名"
          align="left"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="workID"
          label="工号"
          align="left"
          width="85"
        ></el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          align="left"
          width="85"
        ></el-table-column>
        <el-table-column
          prop="birthday"
          label="出生日期"
          align="left"
          width="95"
        ></el-table-column>
        <el-table-column
          prop="idCard"
          label="身份证号"
          align="left"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="wedlock"
          label="婚姻状况"
          align="left"
          width="70"
        ></el-table-column>
        <el-table-column
          prop="nation.name"
          label="民族"
          align="left"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="nativePlace"
          label="籍贯"
          align="left"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="politicsStatus.name"
          label="政治面貌"
          align="left"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="电子邮件"
          align="left"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="电话号码"
          align="left"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="联系地址"
          align="left"
          width="220"
        ></el-table-column>
        <el-table-column
          prop="department.name"
          label="所属部门"
          align="left"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="joblevel.name"
          label="职称"
          align="left"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="position.name"
          label="职位"
          align="left"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="engageForm"
          label="聘用形式"
          align="left"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="tiptopDegree"
          label="最高学历"
          align="left"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="school"
          label="学校"
          align="left"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="specialty"
          label="专业"
          align="left"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="workState"
          label="在职状态"
          align="left"
          width="70"
        ></el-table-column>
        <el-table-column
          prop="beginDate"
          label="入职日期"
          align="left"
          width="95"
        ></el-table-column>
        <el-table-column
          prop="conversionTime"
          label="转正日期"
          align="left"
          width="95"
        ></el-table-column>
        <el-table-column
          prop="beginContract"
          label="合同起始日期"
          align="left"
          width="95"
        ></el-table-column>
        <el-table-column
          prop="endContract"
          label="合同截止日期"
          align="left"
          width="95"
        ></el-table-column>
        <el-table-column
          prop="contractTerm"
          label="合同期限"
          align="left"
          width="95"
        >
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag
            >年
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button style="padding: 2px">编辑</el-button>
            <el-button style="padding: 2px" type="primary"
              >查看高级资料</el-button
            >
            <el-button style="padding: 2px" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      headers:{
        Authorization:window.sessionStorage.getItem('tokenStr')
      },
      importDataBtnText:'导入数据',
      importDataBtnIcon:'el-icon-upload2',
      importDataDisabled:false,
      emps: [],
      loading:false,
    };
  },
  mounted() {
    this.initEmps();
  },
  methods: {
    onSuccess(){
      this.importDataBtnIcon='el-icon-upload2';
      this.importDataBtnText='导入数据';
      this.importDataDisabled=false;
      this.initEmps();
    },
    onError(){
      this.importDataBtnIcon='el-icon-upload2';
      this.importDataBtnText='导入数据';
      this.importDataDisabled=false;
    },
    beforeUpload(){
      this.importDataBtnIcon='el-icon-loading';
      this.importDataBtnText='正在导入';
      this.importDataDisabled=true;
    },
    exportData(){
      this.downloadRequest('');
    },
    initEmps() {
      this.loading=true;
      this.getRequest("").then((resp) => {
        this.loading=false;
        if (resp) {
          this.emps = resp.data;
        }
      });
    },
  },
};
</script>

<style scoped>
</style>