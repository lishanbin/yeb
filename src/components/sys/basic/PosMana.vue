<template>
  <div>
    <div>
      <el-input
        size="small"
        class="addPosInput"
        placeholder="添加职位..."
        suffix-icon="el-icon-plus"
        v-model="pos.name"
        @keydown.enter.native="addPosition"
      >
      </el-input>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="addPosition"
        >添加</el-button
      >      
    </div>
    <div class="posManaMain">
        <el-table :data="positions" style="width: 70%" stripe border  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号" width="55"> </el-table-column>
          <el-table-column prop="name" label="职位" width="120"></el-table-column>
          <el-table-column prop="createDate" label="创建时间" width="200"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="showEditView(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <el-button @click="deleteMany" type="danger" size="small" style="margin-top:8px;" :disabled="this.multipleSelection.length==0">批量删除</el-button>
    <el-dialog title="编辑职位" :visible.sync="dialogFormVisible">
        <el-form :model="pos">
          <el-form-item label="职位名称" :label-width="formLabelWidth">
            <el-input v-model="pos.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" :label-width="formLabelWidth">
            <el-select v-model="pos.enabled" placeholder="请选择启用状态">
              <el-option label="启用" :value="true"></el-option>
              <el-option label="不启用" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancalEdit">取 消</el-button>
          <el-button type="primary" @click="editPosition">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data() {
    return {
      pos: {
        id:0,
        name: "",
        enabled:true
      },
      positions: [],
      dialogFormVisible:false,
      formLabelWidth:'120px',
      multipleSelection:[]
    };
  },
  methods:{
    deleteMany(){
          this.$confirm('此操作将永久删除['+this.multipleSelection.length+']条职位, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids=''
            this.multipleSelection.forEach(item=>{
              ids+=item.id+',';
            })
            ids=ids.substr(0,ids.length-1);
            console.log(ids);
            this.deleteRequest('/api/Position/DeleteMany?ids='+ids).then(resp=>{
              console.log(resp);
              if(resp){
                this.initPositions();
              }
            }) 
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    addPosition(){
      if(this.pos.name.length>0){
        this.postRequest('/api/Position/Create',this.pos).then(resp=>{
          console.log(resp)
          if(resp.data){
            this.initPositions();
            this.pos.name='';
          }
        })
      }else{
        this.$message.error('职位名称不能为空！');
      }
    },
    editPosition(){
      this.dialogFormVisible=false;
      this.putRequest('/api/Position/Edit',this.pos).then(resp=>{
        if(resp){
            this.initPositions();
            this.pos.name='';
            this.pos.enabled=true;
        }
      })
    },
    cancalEdit(){
      this.dialogFormVisible=false;
      this.pos.name='';
    },
    showEditView(index,data){
      this.dialogFormVisible=true;
      this.pos.name=data.name;
      this.pos.enabled=data.enabled;
      this.pos.id=data.id;
    },
    handleDelete(index,data){
        this.$confirm('此操作将永久删除['+data.name+']职位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/api/Position/Delete?id='+data.id).then(resp=>{
            if(resp){
              this.initPositions();
            }
          }) 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    initPositions(){
      this.getRequest('/api/Position/Positions').then(resp=>{
        if(resp.data){
          this.positions=resp.data;
        }
      })
    }
  },
  mounted(){
    this.initPositions();
  }
};
</script>

<style scoped>
.addPosInput {
  width: 300px;
  margin-right: 8px;
}
.posManaMain{
    margin-top: 10px;
}
</style>