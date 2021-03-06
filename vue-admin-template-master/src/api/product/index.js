// 这个文件目的就是把所有的接口整合到一起，然后一起暴露

// import trademark from "./trademark"

// 引入 暴露（对象）之前学的
// 引入并暴露
// 可以理解为先引入，引入后再暴露

// 使用引入并暴露的方法，default引入的时候不能简写
export {default as trademark} from "./trademark"
export {default as attr} from "./attr"
export {default as category} from "./category"
export {default as spu} from "./spu"
export {default as sku} from "./sku"

// 相当于分别暴露了 trademark和attr对象

// 最终暴露的是
/* {
    trademark,
    attr
} */