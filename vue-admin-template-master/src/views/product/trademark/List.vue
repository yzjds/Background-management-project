<template>
  <div>
    <el-button
      icon="el-icon-circle-plus-outline"
      type="primary"
      @click.native="showAddDialog"
      >添加</el-button
    >

    <!-- el-table代表的是表格
    表格当中是一列一列的el-table-column
    el-table的：data="data"这个属性是用来展示数据的，但是现在我们还没数据
    el-table-column：
      prop="prop"目前不用，后期需要数据当中的某个属性使用
      label="label"代表这一列的名字
      width="width"代表这一列的宽度，直接写数字，不需要px，如果不写，那么4个列评分天下，写了哪一个列，哪一个就变成自己的宽度 
      algin="center"可以让某个列中的数据居中显示-->

    <!-- 
        table当中:data="trademarkList 代表的事表格要展示的数组
        当我们写上这个的时候，table会把这个数组给每个列传递一份
        每个列内部都是在展示我们的这个数组数据 v-for
        每个列在展示数据的时候，结构是由自己说的算
        其实我们大家要明白，table列内部是由有作用域插槽的

        table的列在展示数据的时候，如果我们的数据就是要展示的数据，那么直接写prop就行，
        如果我们的数据不是直接展示的数据，而是需要其他的结构，那么必须使用作用域插槽
       -->
    <el-table :data="trademarkList" style="width: 100%; margin: 20px 0" border>
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80"
        :key="index"
      >
      </el-table-column>
      <el-table-column label="品牌名称" align="center" width="" prop="tmName">
      </el-table-column>

      <el-table-column label="品牌LOGO" align="center" width="" prop="logoUrl">
        <template slot-scope="{ row, $index }">
          <!-- row就代表当前遍历对象
        $index代表遍历对象的下标 -->
          <img style="width: 80px; height: 60px" :src="row.logoUrl" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器
    之前我们用的分页器是自己封装的分页器组件
    这次我们用是element-ui给我们封装的分页器组件
    :current-page="currentPage4" 传递当前页码
    :page-sizes="[10, 20, 30, 40]" 传递的每页数量
    :total="400"  传递的总数
    :pager-count  传递的连续页数,如果写的是5，连续数是3 5是包含了首页和尾页
    @current-change="handleCurrentChange" 切换页码的事件
    @size-change="handleSizeChange" 改变当前页数量的事件
    :page-sizes="[10, 20, 30, 40]"在页面可以改变当前页的数量
    layout="total, sizes, prev, pager, next, jumper"可以改变分页器前后顺序（布局顺序）-->
    <el-pagination
      :current-page="page"
      :pager-count="5"
      :page-sizes="[1, 2, 3]"
      :page-size="limit"
      :total="total"
      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
      style="text-align: center"
      layout=" prev, pager, next, jumper, ->,sizes, total"
    >
    </el-pagination>

    <!-- 点击添加或者点击修改弹出的对话框页面
写静态页面的时候把东西复制过来，先把内部所有的动态数据删除掉 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- 看见了。sync就是往内部传递了一个参数，实现父子同步 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="tmForm">
        <!-- el-form代表的是表单
        表单里面是表单项
            每个表单项都可以通过label-width设置表单项名称的宽度
            每个表单项都可以通过label设置表单项名称 -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>

        <!-- 品牌LOGO -->
        <el-form-item label="品牌LOGO" label-width="100px">
          <!-- 在拷贝upload组件的时候，把html，css,js相关的东西拷贝 -->
          <!-- action控制的是上传的接口地址 -->
          <!-- 上传图片分为两步：
            我们在上传的时候需要调用接口，把本地的图片上传到后端服务器
            接下来，后端服务器会给我们返回这个图片在后端服务器上的地址（线上路径）
            我们要收集的东西就是返回来的这个路径 -->
          <!-- 
            上传的接口地址，前面必须加/dev-api
            如果不添加在默认是往这发请求：http://loaclhost:9528/admin/product/fileUpload    404
            如果添加了往这发
            action="/dev-api/admin/product/fileUpload"
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    var validatePass=function(rule, value, callback){
      // value 就是后期要验证的用户输入的数据
      // callback 是一个回调函数，如果callback调用的时候传递了参数，代表验证失败，如果没有传递参数，代表验证成功
      if(value.length<2||value.length>10){
        callback(new Error('长度在2到10个字符'))
      }else{
        callback()
      }
    }
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,

      // imageUrl: '',//upload组件内部的数据，有可能不用

      dialogFormVisible: false, //用来判定dialog是否显示

      // tmFrom就是我们收集成功的那个品牌对象
      tmForm: {
        tmName: "", //收集我们的品牌名称
        logoUrl: "",
      }, //品牌数据，必须和接口请求函数当中请求体data数据类型要一样

      // From表单验证rules
      rules: {
        // 规则
        // 每个要验证的字段规则都是一个数组
        // 数组里面是对象，么一个对象就代表是验证的一个规则
        // 每个规则独享里面包含三个东西：1.规则2.错误的提示信息3.触发时机（验证时机）
        // 触发时机：一共有三个  失去焦点的时候blur  内容改变的时候change  整体验证的时候
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // { min: 2, max: 10, message: "长度在2到10个字符", trigger: "change" },
          // 这里可以添加一个自定义验证规则
          {validator:validatePass,trigger:'change'}
        ],
        logoUrl: [
          { required: true, message: "请上传图片" }, //这个触发是在整体验证的时候触发
        ],
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },
    /* handleCurrentChange(page) {
      // 切换分页器页码的回调
      this.page = page;
      this.getTrademarkList();
    }, */

    async getTrademarkList(page = 1) {
      const result = await this.$API.trademark.getPageList(
        (this.page = page),
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },

    // upload组件当中写的两个函数
    // 图片上传成功的回调
    handleAvatarSuccess(res, file) {
      // res代表上传成功后返回的响应数据
      // file代表上成功后返回的图片文件本身
      // console.log(res,file)
      // 本身写的东西，这个是错的，它也是在收集上传成功的图片路径，但是这样的写法指示模拟
      // 它最终收集的是本地的路径
      // console.log(file.raw);
      // this.imageUrl = URL.createObjectURL(file.raw);

      this.tmForm.logoUrl = res.data;
    },
    // 图片上传前的回调
    beforeAvatarUpload(file) {
      // 代表的是你上传的那个图片
      const isJPG = file.type === "image/jpeg"; //判断上传的图片是否是jpg格式
      const isLt2M = file.size / 1024 / 1024 < 2; //判断上传的图片大小是不是小于2M

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 点击添加按钮显示dialog窗口
    showAddDialog() {
      this.dialogFormVisible = true;
      // 把tmForm内的数据清空，如果不清空，添加数据点取消，再点添加，数据还存在
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      // this.tmForm = row;//row代表的就是要修改的那一行，就是要修改的品牌对象
      // row是列表页当中展示的数据
      // tmForm是dialog对话框展示的数据
      // this.tmForm=row是把列表页的数据地址给了tmForm 让tmForm和row就是同一个数据
      // 深浅拷贝
      // 什么是拷贝？
      // var a=[1,2,3]  var b=a 是不是拷贝？
      // 不是拷贝
      // 什么是拷贝？必须出现另外一个内存空间  叫拷贝
      // 深浅拷贝 说的是拷贝过程中数据的类型格式
      // 深浅拷贝面向的数据必然是对象格式，基本数据类型，不存在深浅拷贝

      // 浅拷贝：对象当中所有的对象数据在拷贝给另外一个内存的时候，拷贝地址
      // 深拷贝：对象当中所有的对象数据在拷贝给另外一个内存的时候，拷贝数据而不是地址

      // 举例子
      // tmFrom={
      // tmName:"aa",
      // logoUrl:"hh",
      // data:[1,2,3]//0x100
      // }
      // 如果是浅拷贝
      // formCopy = {
      // tmName:"aa",
      // logoUrl:"hh",
      // data:[1,2,3]//0x100
      // }
      // 如果是深拷贝
      // formCopy = {
      // tmName:"aa",
      // logoUrl:"hh",
      // data:[1,2,3]//0x200
      // }

      // 我们这里row当中只有基本数据类型，所以说拷贝一下就行了，没必要
      this.tmForm = { ...row };
    },

    addOrUpdateTrademark() {
      // 整体表单验证
      this.$refs.tmForm.validate(async (valid) => {
        // 表单验证通过
        if (valid) {
          // 获取参数
          let tmForm = this.tmForm;
          // 整理参数  一般是我们的参数数据不符合咱们请求的参数格式，那么就需要整理
          // 发请求
          try {
            await this.$API.trademark.addOrUpdate(tmForm);
            // 成功干啥

            // 1.提示
            this.$message.success(tmForm.id ? "修改品牌成功" : "添加品牌成功");
            // 2.关闭dialog，回到列表页面
            this.dialogFormVisible = false;
            // 3.重新发送请求获取列表数据
            this.getTrademarkList(tmForm.id ? this.page : 1);
          } catch (error) {
            // 失败干啥
            this.$message.error(tmForm.id ? "修改品牌失败" : "添加品牌失败");
          }
        } else {
          alert("表单有的验证没通过，请检查填写是否规范");
          return false;
        }
      });
    },

    // 删除品牌
    deleteTrademark(row) {
      this.$confirm(
        `此操作将永久删除${row.tmName}该品牌？, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          //这是按下确定按钮之后的回调函数
          try {
            await this.$API.trademark.delete(row.id);
            // 2、重新发送请求获取列表数据
            // 正常删除哪个数据会到的还是哪个数据所在的页面
            // 假设删除数据的那一页只有一条数据，我们需要回到前一页，而不是数据当前页
            this.getTrademarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
            // 1.删除成功后提示
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } catch (error) {
            this.$message.error("删除品牌失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style lang="scss">
</style>