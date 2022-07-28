import http from "@/utils/http";
// export function getTableData(params) {
//     // return http.get(`${resquest}/user/queryAllUser`, params)
//     // return http.get(`/user/queryAllUser?pageNum=0?pageSize=0`)
//     return http.get(`/user/queryAllUser/${params.pageNum}/${params.pageSize}`)
// }
// export function getUnitInfo() {
//     return http.get(`/unit/getAllUnit`)
// }
// export function getUserType() {
//     return http.get(`/userType/getAllUserType`)
// }

// export function getClassInfo(params) {
//     return http.get(`/classGroup/getAllClassGroupById/${params}`)
// }
//获取人数
export function getSignNum() {
    return http.get(`/signLog/getTodayAllPerson`)
}
export function getSignOutNum() {
    return http.get(`/signLog/getTodayAllSignOutPerson`)
}
export function getStayNum() {
    return http.get(`/signLog/getTodayAllSigningPerson`)
}
//get person info
export function getSignPerson(params) {
    return http.post(`/signLog/queryTodaySignLog`, params)
}
export function getSignOutPerson(params) {
    return http.post(`/signLog/getSignOutPerson`, params)
}
export function getStayPerson(params) {
    return http.post(`/signLog/getSigningPerson`, params)
}
//判别是指纹还是人脸
export function getRecoWay() {
    return http.get(`/systemParams/getAllSystemParams`)
}