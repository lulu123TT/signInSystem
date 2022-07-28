import http from "@/utils/http";
// get可签到访客
export function getInVisitor() {
    return http.get(`/user/queryAllSignVisitor`)
}

// 访客签到
export function postVisitorIn(data) {
    return http.post(`/user/visitorSignIn`, data)
}

// 访客签到
export function getVisitorThing() {
    return http.get(`/userType/getVisitorType`)
}