import http from "@/utils/http";
// get可签退访客
export function getOutVisitor() {
    return http.get(`/user/queryAllSignOutVisitor`)
}

// 访客签退
export function postVisitorOut(data) {
    return http.post(`/user/visitorSignOut`, data)
}