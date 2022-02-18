<template>
  <div>
    <div>
      <el-input
        size="small"
        v-model="jl.name"
        placeholder="添加职称等级..."
        prefix-icon="el-icon-plus"
        style="width: 300px"
      ></el-input>
      <el-select
        v-model="jl.titleLevel"
        size="small"
        placeholder="职称等级"
        style="margin-left: 6px; margin-right: 6px"
      >
        <el-option
          v-for="item in titleLevels"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addJobLevel"
        >添加</el-button
      >
    </div>
    <div style="margin-top: 10px">
      <el-table
        :data="jls"
        size="small"
        stripe
        border
        style="width: 80%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="编号" width="55"> </el-table-column>
        <el-table-column prop="name" label="职称名称" width="150">
        </el-table-column>
        <el-table-column prop="titleLevel" label="职称等级" width="150">
        </el-table-column>
        <el-table-column
          prop="createDate"
          :formatter="dateFormat"
          label="创建日期"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="enabled" label="是否启用" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
            <el-tag v-else type="danger">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditView(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteHandler(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button
      type="danger"
      size="small"
      style="margin-top: 10px"
      :disabled="this.multipleSelection.length == 0"
      @click="deleteMany"
      >批量删除</el-button
    >
    <el-dialog title="编辑职称" :visible.sync="dialogVisible" width="30%">
      <el-form :model="updateJl">
        <el-form-item label="职称名称" :label-width="formLabelWidth">
          <el-input v-model="updateJl.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职称等级" :label-width="formLabelWidth">
          <el-select
            v-model="updateJl.titleLevel"
            placeholder="请选择职称等级..."
          >
            <el-option
              v-for="item in titleLevels"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            v-model="updateJl.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="已启用"
            inactive-text="未启用"
            style="height: 40px"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "JoblebelMana",
  data() {
    return {
      jl: {
        name: "",
        titleLevel: "",
      },
      titleLevels: ["正高级", "副高级", "中级", "初级", "员级"],
      jls: [],
      dialogVisible: false,
      updateJl: {
        id: 0,
        name: "",
        titleLevel: "",
        enabled: true,
      },
      formLabelWidth: "120px",
      multipleSelection: [],
    };
  },
  methods: {
    deleteMany() {
      this.$confirm(
        "此操作将永久删除[" +
          this.multipleSelection.length +
          "]条职称, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let ids = "";
          this.multipleSelection.forEach((item) => {
            ids += item.id + ",";
          });
          ids = ids.substr(0, ids.length - 1);
          console.log(ids);
          this.deleteRequest("/api/JobLevel/DeleteMany?ids=" + ids).then(
            (resp) => {
              if (resp) {
                this.initJls();
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log();
    },
    doUpdate() {
      this.putRequest("/api/JobLevel/Edit", this.updateJl).then((resp) => {
        if (resp) {
          this.initJls();
          this.dialogVisible = false;
        }
      });
    },
    showEditView(data) {
      this.dialogVisible = true;
      Object.assign(this.updateJl, data);
    },
    deleteHandler(data) {
      this.$confirm(
        "此操作将永久删除[" + data.name + "]职称, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest("/api/JobLevel/Delete?id=" + data.id).then(
            (resp) => {
              if (resp) {
                this.initJls();
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
    addJobLevel() {
      if (this.jl.name && this.jl.titleLevel) {
        this.postRequest("/api/JobLevel/Create", this.jl).then((resp) => {
          if (resp) {
            this.initJls();
          }
        });
      } else {
        this.$message.error("字段不能为空！");
      }
    },
    //格式化日期
    dateFormat(row, column) {
      const date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    initJls() {
      this.getRequest("/api/JobLevel/JobLevels").then((resp) => {
        if (resp) {
          this.jls = resp.data;
          this.jl.name = "";
          this.jl.titleLevel = "";
        }
      });
    },
  },
  mounted() {
    this.initJls();
  },
};
</script>

<style scoped>
</style>