import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const userIdKey = 'userId'
const userTypeKey = 'userType'
const userNameKey = 'username'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 存储用户id
export function setUserId(userId) {
  return sessionStorage.setItem(userIdKey, userId)
}
// 获取用户id
export function getUserId() {
  return sessionStorage.getItem(userIdKey)
}
// 存储用户名
export function setUserName(username) {
  return sessionStorage.setItem(userNameKey, username)
}
// 获取用户名
export function getUserName() {
  return sessionStorage.getItem(userNameKey)
}
export function removeUserId() {
  return sessionStorage.remove(userIdKey)
}
// 清空sesison
export function clearSession() {
  return sessionStorage.clear()
}
// 存储用户类型
export function setUserType(userType) {
  return sessionStorage.setItem(userTypeKey, userType)
}
// 获取用户类型
export function getUserType() {
  return sessionStorage.getItem(userTypeKey)
}
