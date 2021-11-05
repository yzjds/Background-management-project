<template>
  <div>
    <el-card>
      <CategorySelector
        @handleCategoryList="handleCategoryList"
        :isShow="isShow"
      ></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- spu的列表页 -->
      <div v-show="!isShowSpuList && !isShowSkuList">
        <el-button icon="el-icon-plus" type="primary" :disabled="!category3Id"
        @click="showAddspuList"
          >添加SPU</el-button
        >
        <el-table border :data="spuList">
          <el-table-column label="序号" width="180" type="index">
          </el-table-column>
          <el-table-column label="SPU名称" prop="spuName"> </el-table-column>
          <el-table-column label="SPU描述" prop="description">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSkuList(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuList(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SPU的SKU列表"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[2, 3, 4]"
          :page-size="limit"
          style="text-align: center"
          layout=" prev, pager, next, jumper, -> ,total, sizes"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- spu的添加和修改页面 -->
      <!-- <div>
      </div> -->
      <div v-show="isShowSpuList">
        <!-- <SpuForm :visiable="isShowSpuList"  @update:visiable="isShowSpuList= $event"></SpuForm> -->
        <SpuForm ref="spu" :visiable.sync="isShowSpuList"></SpuForm>
      </div>
      

      <!-- sku的添加页面 -->
      <!-- <div>
      </div> -->
      <div v-show="isShowSkuList">
        <SkuForm ref="sku"></SkuForm>
      </div>
      
    </el-card>
  </div>
</template>

<script>
import SpuForm from "@/views/product/component/SpuForm.vue";
import SkuForm from "@/views/product/component/SkuForm.vue";
export default {
  name: "Spu",
  components:{SpuForm,SkuForm},
  data() {
    return {
      isShow: true, //传递给三级分类的组件，控制三级分类的可操作性
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],

      total: 0,

      page: 1,
      limit: 2,

      // 用来控制sku,spu还有显示表格的切换
      isShowSpuList:false,
      isShowSkuList:false,
    };
  },
  methods: {
    handleCategoryList({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category2Id = categoryId;
      } else if (level === 3) {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },

    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      const result = await this.$API.spu.getSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },

    // 修改每页数量的回调
    handleSizeChange(val) {
      this.limit = val;
      this.getSpuList();
    },
    // 点击添加按钮显示spuform页面
    showAddspuList(){
      this.isShowSpuList = true;
      this.$refs.spu.getAddSpuFormInitData()
    },
    // 添加更新spuform按钮显示页面
    showUpdateSpuList(row){
      this.isShowSpuList = true;
      this.$refs.spu.getUpdateSpuFormInitData(row)

    },
    showAddskuList(){
      this.isShowSkuList = true;
    }

    
  },
};
</script>

<style lang="scss">
</style>