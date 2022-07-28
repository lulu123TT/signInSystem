import http from "@/utils/http";
// 用户签退
export function postUserOut(data) {
    return http.post(`/user/userSignOutByFace`, data)
}