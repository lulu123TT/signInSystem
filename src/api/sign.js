import http from "@/utils/http";
// 获取全部事由
export function getThingList() {
    return http.get(`/todoList/getTodoList`)
}

// 用户人脸签到
export function postUserInByFace(data) {
    return http.post(`/user/userSignInByFace`, data)
}
// /user/userSearchByFaceBase64
// 用户扫脸对比
export function postImgData(data) {
    return http.post(`/user/userSearchByFaceBase64`, data)
}


export function getTodo() {
    return http.get(`/userType/queryUserType`)
}

//根据类型获取事由
export function getTodoByUserType(data) {
  return http.post(`/todoList/getUserTypeTodo`, data)
}

// 用户指纹搜索
export function searchFinger() {
  return http.get(`/finger/searchFinger`)
}