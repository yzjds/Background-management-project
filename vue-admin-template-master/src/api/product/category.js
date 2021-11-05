import request from "@/utils/request"

export default{
    
    
        // /admin/product/getCategory1
        // 获取一级分类
        getCategory1(){
            return request.get('/admin/product/getCategory1')
        },

        
        // /admin/product/getCategory2/{category1Id}
        // 获取二级分类
        getCategory2(category1Id){
            return request.get(`/admin/product/getCategory2/${category1Id}`)
        },
        // /admin/product/getCategory3/{category2Id}
        // 获取三级分类
        getCategory3(category2Id){
            return request.get(`/admin/product/getCategory3/${category2Id}`)
        }
   
}