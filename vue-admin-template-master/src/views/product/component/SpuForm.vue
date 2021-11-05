<template>
  <div>
    <el-form :model="spuForm" ref="form" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuForm.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select :value="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="4"
          v-model="spuForm.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="spuImageList.imgUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="unSaleAttrId"
          :placeholder="
            unUseSaleAttrList.length > 0
              ? `还有${unUseSaleAttrList.length}未选择`
              : '没有啦'
          "
        >
          <el-option
            :label="saleAttr.name"
            :value="`${saleAttr.id}:${saleAttr.name}`"
            v-for="(saleAttr, index) in unUseSaleAttrList"
            :key="saleAttr.id"
          ></el-option>
        </el-select>
        <el-button icon="el-icon-plus" type="primary" @click.native="addSaleAttr">添加销售属性</el-button>
      </el-form-item>
      <el-form-item>
        <el-table border :data="spuForm.spuSaleAttrList">
          <el-table-column label="序号" align="center" width="80" type="index">
          </el-table-column>
          <el-table-column label="属性名" width="150" prop="saleAttrName">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                @close="handleClose(tag)"
                :disable-transitions="false"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                ref="saveTagInput"
                size="small"
                v-model="row.inputValue"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ New Tag</el-button
              >
              <el-dialog :visible.sync="dialogVisible">
                <img width="50%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template>
              <HintButton
                icon="el-icon-delete"
                size="mini"
                type="danger"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click.native="$emit('update:visiable', false)"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,

      spuForm: {}, //请求初始化的spu详情数据,这个spuForm也是后面添加要收集的对象，内部和修改请求回来的数据结构是一样的
      //   这个spuForm我们内部初始化属性都是空的，是为添加spu的时候手机数据用的
      // 修改spu的时候，这个spuForm就会被赋值为请求回来的有数据的对象
      spuImageList: [], //请求初始化spu图片列表
      trademarkList: [], //请求初始化所有的品牌列表
      saleAttrList: [], //请求初始化的所有销售属性列表

      unSaleAttrId: "", //自己认为的手机未选择使用的销售属性Id 不一定
    };
  },
  props: ["visiable"],
  methods: {
    // 和upload相关的回调函数，对应删除图片成功后的回调，对应的就是图片的垃圾筐
    /* file是删除的图片的信息，fileList是剩余图片的信息 */
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.spuImageList = fileList
    },
    // 这个方法是预览大图使用，已经写好了，不用动，对应的就是图片的放大镜
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url; //把需要放大的图片src赋值到对话框当中的图片
      this.dialogVisible = true; //弹出放大图片的对话框
    },
    handleAvatarSuccess(res, file,fileList) {
      // 上传成功后要把最后的图片列表收集起来
      this.spuImageList = fileList
    },

    // 请求获取修改的spu的初始化数据
    async getUpdateSpuFormInitData(spu) {
      let result = await this.$API.spu.getSpuInfo(spu.id);
      if (result.code === 200) {
        this.spuForm = result.data;
      }

      let imageReslt = await this.$API.sku.getSpuImageList(spu.id);
      if (imageReslt.code === 200) {
        let spuImageList = imageReslt.data;
        spuImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = spuImageList;
      }

      // 获取所有的品牌列表
      let trademarkResult = await this.$API.trademark.getBaseTrademark();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }

      // 获取所有的销售属性列表
      let saleAttrResult = await this.$API.spu.getBaseSaleAttrList();
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },

    // 请求获取添加spu的初始化结果
    async getAddSpuFormInitData() {
      // 获取所有的品牌列表
      let trademarkResult = await this.$API.trademark.getBaseTrademark();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }

      // 获取所有的销售属性列表
      let saleAttrResult = await this.$API.spu.getBaseSaleAttrList();
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },

    handleClose() {},

    showInput(row) {
      this.$set(row,'inputVisible',true);
      this.$nextTick((_) => {
        this.$refs.saveTagInput.focus();
      });
    },

    // 当用户输入销售属性值完成失去焦点或者回车的回调
    handleInputConfirm(row) {
      let baseSaleAttrId = row.baseSaleAttrId;
      let saleAttrValueName = row.inputValue;

      // 拿到属性值名称，判断是否是空串
      if(saleAttrValueName === ''){
        saleAttrValueName = "";
        return
      }
      const result = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === saleAttrValueName)
      if(result){
        saleAttrValueName=""
        this.$message.warning('不能重复')
        return
      }
      // 判断当前这个销售属性值名称是否已经在销售属性值列表当中存在，这里不需要出去自身
      // 因为我们现在还没有把这个销售属性值踢啊你就爱到指定的位置
      // 之前平台属性要去出自身，因为之前我们平台属性用的是占位思想，还没有输入平台属性值名称，就已经踢啊你就爱了这个平台属性值，因此要出去
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName
      })
      row.inputValue='';
      this.$set(row,'inputVisible',false);

    },

    // 添加销售属性
    addSaleAttr(){
      if(!this.unSaleAttrId){
        return
      }else{
        let [baseSaleAttrId,saleAttrName] = this.unSaleAttrId.split(':')
        this.spuForm.spuSaleAttrList.push({
          baseSaleAttrId,
          saleAttrName,
          spuSaleAttrValueList:[]
        })
      }
    }
  },

  computed: {
    // 根据请求获取的所有的销售属性列表saleAttrList和spu详情当中自己的销售属性列表spuForm.spuSaleAttrList计算得到去选择的销售属性列表
    unUseSaleAttrList() {
      return this.saleAttrList.filter((item1) => {
        return this.spuForm.spuSaleAttrList.every((item) => {
          return item.saleAttrName !== item1.name;
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
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
<style>
</style>