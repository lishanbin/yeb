<template>
  <div style="width: 500px">
    <el-input
      placeholder="请输入部门名称进行搜索..."
      prefix-icon="el-icon-search"
      v-model="filterText"
    >
    </el-input>

    <el-tree
      class="filter-tree"
      :data="deps"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree"
    >
      <span
        class="custom-tree-node"
        slot-scope="{ node, data }"
        style="display: flex; justify-content: space-between; width: 100%"
      >
        <span>{{ data.name }}</span>
        <span>
          <el-button
            type="primary"
            class="depBtn"
            size="mini"
            @click="() => showAddDep(data)"
          >
            添加部门
          </el-button>
          <el-button
            type="danger"
            size="mini"
            class="depBtn"
            @click="() => deleteDep(data)"
          >
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog title="添加部门" :visible.sync="dialogVisible" width="30%">
      <div>
        <table>
          <tr>
            <td>
              <el-tag>上级部门</el-tag>
            </td>
            <td>
              <p>{{ pname }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>部门名称</el-tag>
            </td>
            <td>
              <el-input
                v-model="dep.name"
                placeholder="请输入部门名称"
              ></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddDep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      filterText: "",
      deps: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      dialogVisible: false,
      dep: {
        name: "",
        parentId: -1,
      },
      pname: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.initDeps();
  },
  methods: {
    addDep2Deps(deps, dep) {
      if (deps && deps.length > 0) {
        for (let i = 0; i < deps.length; i++) {
          let d = deps[i];
          if (d.id == dep.parentId) {
            if (d.children==null) {
              d.children=[];
            }
            d.children = d.children.concat(dep);
            return;
          } else {
            this.addDep2Deps(d.children, dep); //递归
          }
        }
      }
    },
    doAddDep() {
      this.postRequest("/api/Department/Create", this.dep).then((resp) => {
        if (resp) {
          this.initDep();
          // this.initDeps();
          this.dialogVisible = false;
          console.log(resp.data);
          console.log(this.deps);
          this.addDep2Deps(this.deps, resp.data);
        }
      });
    },
    deleteDep(data) {
      if (data.children && data.children.length > 0) {
        this.$message.error("父部门删除失败！");
      } else {
        this.$confirm(
          "此操作将永久删除该[" + data.name + "]部门, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.deleteRequest("/api/Department/Delete?id="+data.id).then((resp) => {
              if (resp) {
                this.removeDepFromDeps(null,this.deps, data.id);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    removeDepFromDeps(p,deps, id) {
      if (deps && deps.length > 0) {
        for (let i = 0; i < deps.length; i++) {
          let d = deps[i];
          if (d.id == id) {
            deps.splice(i, 1);
            if(deps.length==0){
              p.children=null;
            }
            return;
          } else {
            this.removeDepFromDeps(d,d.children, id);
          }
        }
      }
    },
    showAddDep(data) {
      this.pname = data.name;
      this.dep.parentId = data.id;
      this.dialogVisible = true;
    },
    initDep() {
      this.dep = {
        name: "",
        parentId: -1,
      };
      this.pname = "";
    },
    initDeps() {
      this.getRequest("/api/Department/Departments").then((resp) => {
        if (resp) {
          this.deps = resp.data;
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
  },
};
</script>

<style scoped>
.depBtn {
  padding: 2px;
}
</style>