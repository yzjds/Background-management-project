<template>
  <div>
    <el-card>
      <!-- 三级联动组件 -->
      <CategorySelector
        @handleCategoryList="handleCategoryList"
        :isShow="isShow"
      ></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="isShow">
        <!-- 如果三级分类没有，那么添加属性按钮是禁用的 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click.native="showAddDiv"
          :disabled="category3Id ? false : true"
          >添加属性</el-button
        >
        <!-- 属性的列表 -->
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column width="80" align="center" type="index" label="序号">
          </el-table-column>
          <el-table-column width="150" label="属性名称" prop="attrName">
          </el-table-column>
          <el-table-column label="属性值列表">
            <!-- 展示属性值列表的时候，我们需要遍历v-for，而且每个属性值外部都有结构，所以也得用作用域插槽 -->
            <template slot-scope="{ row }">
              <!-- row代表的是当前遍历的这个属性，row.attrValueList才是你要自己遍历展示的属性值列表 -->

              <el-tag
                effect="plain"
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column width="150" label="操作">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="primary"
                icon="el-icon-edit"
                size="mini"
                title="编辑"
                @click.native="showUpdateDiv(row)"
              ></HintButton>
              <el-popconfirm title="确定删除这个属性么？" @onConfirm="deleteAttr(row)">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改属性的页面 -->
      <div v-show="!isShow">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click.native="addAttrValue"
          :disabled="!attrForm.attrName"
          >添加属性值</el-button
        >
        <el-button @click.native="isShow = true">取消</el-button>

        <!-- table是为了展示收集属性值列表
        收集属性名称很好手机，上面用的是v-model用户输入就直接可以收集
        手机属性值列表不好收集，那么我们采用的是先使用table去展示要收集的属性值列表
        一开始属性值列表中是空的没有任何数据，所以表格当中不会显示任何东西
        
        当要手机属性值的时候，用了一个占位的思想，先往数组里添加一个空的对象,只不过属性值的名称此时是空的
        但是，一旦添加这个属性值对象，表格当中都会出现一行，我们可以输入框再去给刚才添加的属性值对象，收集名称 -->
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrForm.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                size="mini"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              ></el-input>
              <span v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 在element ui中 事件叫confirm 这个  官网写错了， 是叫onConfirm -->
              <el-popconfirm
                :title="`你确定删除${row.valueName}这个属性值么？`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除属性值"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save" :disabled="attrForm.attrValueList.length===0">保存</el-button>
        <el-button @click.native="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],

      isShow: true,

      // 收集的属性数据
      attrForm: {
        attrName: "",
        attrValueList: [
          /* {
            attrId: 0,
            id: 0,
            valueName: "string",
          }, */
        ],
        // categoryId: this.category3Id,
        // 以后要记住data当中不能使用this,获取data党总的另外一个数据，因为data数据是一个对象，初始化的时候，谁先谁后不一定
        categoryId: 0,
        categoryLevel: 3,
        // id: 0,//新添加属性是没有id的
      },
    };
  },
  methods: {
    handleCategoryList({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.attrList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.attrList = [];
      } else if (level === 3) {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    //
    async getAttrList() {
      // 解构赋值
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },

    // 点击添加按钮显示添加页面
    showAddDiv() {
      this.isShow = false;

      // 解决点击取消之后，再点击添加属性按钮，之前的数据还存在的bug,每次点击都得重置属性
      // 每次打开添加属性的页面得把收集的数据重置
      // 在这里我们可以顺便收集categoryId
      this.attrForm = {
        attrName: "",
        attrValueList: [
          /* {
            attrId: 0,
            id: 0,
            valueName: "string",
          }, */
        ],
        categoryId: this.category3Id,
        categoryLevel: 3,
        // id: 0,//新添加属性是没有id的
      };
    },

    // 添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, //这个id代表的事属性值所属属性的id，有id就是修改页面，没有就增加页面的undefined
        // id: 0,新添加属性值没有id
        valueName: "",
        // 一会需要用户输入的属性值名称,

        // 添加一个标识符区分input还是span
        isEdit: true,
      });

      // 让新添加的这个属性值input自动获取焦点
      // 新添加的永远是最后一个
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },

    // 点击修改按钮显示修改属性的页面
    showUpdateDiv(row) {
      this.showAddDiv();
      // 从loadash函数库中引入cloneDeep函数，然后进行深拷贝
      // this.attrForm={...row}//这次使用浅拷贝，没办法，因为内部数组是一个对象类型
      this.attrForm = cloneDeep(row);
      // 这里代表修改属性，修改属性的时候，属性当中已经存在了一些属性值，这些属性值我们也得添加模式
      // this.attrForm.attrValueList.forEach(item=>item.isEdit=false)、、这个写法不能让isEdit称为动态数据，因为forEach方法这样不会给isEdit添加监视

      // 这里用item.isEdit=false给每个属性值添加属性，不是响应式属性
      // vue当中对数据进行数据监视的时候，只是一开始对数据里面的所有属性做了响应式
      // Object.defineProperty对data当中的每个属性都做了getter和setter做了响应式
      // 但是如果不是一开始就有的属性，不会做监视，既然没做监视，后面添加的这个属性就不是响应式属性
      // 不是响应式属性，那么后期这个属性值改变，页面是不会改变的
      // this.$set或者Vue.set为响应式对象添加新书性才是响应式属性
      this.attrForm.attrValueList.forEach((item) =>
        this.$set(item, "isEdit", false)
      );
    },

    // 对input失去焦点或者回车，那么切换为查看模式
    toLook(row) {
      // row.isEdit = false
      // 失去焦点时需要判定数据中是否有属性值名称,如果没有值或者值不合法，不会变为span
      if (row.valueName.trim() === "") {
        row.valueName = "";
        this.$message.warning("属性值不能为空");
        return;
      }
      // 2.哦没问你还得判断当前输入的这个属性值名称，在除去自身以外，其余的属性值当中是否存在，如果存在不会变为span
      let isRepeat = this.attrForm.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      });
      if (isRepeat) {
        this.$message.warning("属性值不能重复");
        return;
      }

      row.isEdit = false;
    },

    // 对span进行点击的时候，切换为编辑模式
    toEdit(row, index) {
      row.isEdit = true;

      // 从span变为input我蛮需要自动获取焦点
      // 直接写这一行，input标签其实还没有创建成功，所以报错this.$refs[index]是undefined
      // this.$refs[index].focus();

      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },

    // 保存操作
    async save() {
      // 1.获取参数
      let attrForm = this.attrForm;
      // 2.整理参数
      // 1属性值名称如果为空串，从属性值列表当中去除
      // 2属性值当中去除isEdit属性，这个isEdit是我们后面自己添加用来标识查看模式和编辑模式的
      // 3属性值列表如果没有属性值，不发请求
      attrForm.attrValueList = attrForm.attrValueList.filter((item) => {
        if (item.valueName.trim() !== "") {
          delete item.isEdit;
          return true;
        }
      });
      if (attrForm.attrValueList.length === 0) {
        return;
      }
      // 3.发请求
      try {
        await this.$API.attr.addOrUpdate(attrForm);
        // 4.成功干嘛
        this.$message.success("保存成功");
        this.isShow = true;
        this.getAttrList();
      } catch (error) {
        // 5.失败干嘛
        this.$message.error("发送请求失败" + error.message);
      }
    },

    // 删除属性操作
    async deleteAttr(row){
      try{
        await this.$API.attr.deleteAttr(row.id)
        this.$message.success('删除属性成功！')
        this.getAttrList();
      }catch(error){
        this.$message.error('删除属性失败！')
      }
    }
  },
};
</script>

<style lang="scss">
</style>