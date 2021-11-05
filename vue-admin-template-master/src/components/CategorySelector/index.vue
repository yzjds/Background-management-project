<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm" :disabled="!isShow"> 
      <el-form-item label="一级分类" >
        <!-- select必须有value属性，不然会报错 -->
        <el-select v-model="cForm.category1id"  placeholder="请选择" @change="handleCategory1List(cForm.category1id)"><!-- 一开始我用的是，在option上加click事件，但是对比下来还是change事件比较效率高 -->
          <el-option v-for="c1 in category1List" :key="c1.id" :label="c1.name" :value="c1.id" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2id" placeholder="请选择" @change="handleCategory2List(cForm.category2id)">
          <el-option v-for="c2 in category2List" :key="c2.id" :label="c2.name" :value="c2.id" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3id" placeholder="请选择" @change="handleCategory3List(cForm.category3id)">
          <el-option v-for="c3 in category3List" :key="c3.id" :label="c3.name" :value="c3.id" ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  props:['isShow'],
  data(){
    return{
      category1List:[],
      category2List:[],
      category3List:[],
      cForm:{
        category1id:"",
        category2id:"",
        category3id:"",
      }
    }
  },
  mounted(){
    this.getCategory1List();
  },
  methods:{
    async getCategory1List(){
      const result = await this.$API.category.getCategory1();
      if(result.code === 200){
        this.category1List = result.data;
      }else{
        this.$message.warning('获取一级分类失败')
      }
    },

    // 选中了一级分类的回调
    async handleCategory1List(category1id){
      // 要处理一个小bug，当重新选择一级分类的时候，二级分类和三级分类要清空
      this.category2List=[];
      this.category3List=[];
      this.cForm.category2id="";
      this.cForm.category3id="";
      const result = await this.$API.category.getCategory2(category1id);
      if(result.code === 200){
        this.category2List = result.data;
      }else{
        this.$message.warning('获取二级分类失败')
      }
      // 父子间通讯，自定义事件将信息传给父级
      this.$emit('handleCategoryList',{categoryId:category1id,level:1})
    },

    // 选中了二级分类的回调
    async handleCategory2List(category2id){
      // 重新选择二级分类之后，三级的相关信息要先清空
      this.category3List=[];
      this.cForm.category3id=''
      const result = await this.$API.category.getCategory3(category2id);
      if(result.code === 200){
        this.category3List = result.data;
      }else{
        this.$message.warning('获取三级分类失败')
      }
      // 父子间通讯，自定义事件将信息传给父级
      this.$emit('handleCategoryList',{categoryId:category2id,level:2})
    },

    handleCategory3List(category3id){
      // 父子间通讯，自定义事件将信息传给父级
      this.$emit('handleCategoryList',{categoryId:category3id,level:3})
    }


  }
};
</script>

<style>
</style>