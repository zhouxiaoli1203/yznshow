npm run build 打包  正式环境
npm run build:test 打包 测试环境


地址例子
微信端   https://test.yizhiniao.com/show_h5/#/index?id=48
admin端  
  使用当日admin token， id为模板id
  新增  https://test.yizhiniao.com/show/#/?id=48&token=28cac5bd515446eb875ae501457252eb&systemType=1&mode=2
  修改  https://test.yizhiniao.com/show/#/?id=48&token=28cac5bd515446eb875ae501457252eb&systemType=1&mode=2

oa端 
  使用当日oa token，    id为活动id
  新增  https://test.yizhiniao.com/show/#/?id=48&token=28cac5bd515446eb875ae501457252eb&systemType=2&mode=1
  修改  https://test.yizhiniao.com/show/#/?id=48&token=28cac5bd515446eb875ae501457252eb&systemType=2&mode=2

打包后文件
/admin.html      pc端
/app.html        移动端
/weChat.html     微信端




