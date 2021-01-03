// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"teachingaid-2gpsfh0199bedb2f",
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  db.createCollection(event.od)
}