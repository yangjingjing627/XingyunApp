import { post, get } from 'http'
export default class UserService {
  /**
   * 登录
   * @param {name} 云彩用户名 可以是 手机 邮箱 用户名
   * @param {password} 云彩密码
   * @param {openId} 微信openId
   * @param {uid} 买家ID false 表示不需要uid
   * @returns
   * @memberof UserService
   */
  doLogin(params) {
    return post('buyer/login', params, {hasUid: false})
  }
  /**
   * 买家忘记密码发送验证码接口
   * @param {uid} 买家ID [必须]
   * @param {salt} 签名 [必须]
   * @param {any} params.type 需要验证的类型 1:手机号 2邮箱号 [必须]
   * @param {any} params.phone 手机号 [非必须]
   * @param {any} params.email 邮箱 [非必须]
   * @returns
   * @memberof UserService
   */
  sendCode(params) {
    return post('buyer/password/forget/sendCode', params, {hasUid: false})
  }
  /**
   * 买家忘记密码校验验证码接口
   * @param {uid} 买家ID [必须]
   * @param {salt} 签名 [必须]
   * @param {any} params.phone 手机号 [非必须]
   * @param {any} params.email 邮箱号 [非必须]
   * @param {any} params.type 需要验证的类型 1:手机号 2邮箱号 [必须]
   * @param {any} params.code 输入验证码 [必须]
   * @returns
   * @memberof UserService
   */
  verifyCode(params) {
    return post('buyer/password/forget/verify/code', params)
  }
  /**
   * 买家忘记密码重置密码接口 登录前
   * @param {uid} 买家ID [必须]
   * @param {salt} 签名 [必须]
   * @param {any} params.phone 手机号 [非必须]
   * @param {any} params.email 邮箱号 [非必须]
   * @param {any} params.type 需要验证的类型 1:手机号 2邮箱号 [必须]
   * @param {any} params.password 密码 [必须]
   * @param {any} params.passwordConfirm 确认密码 [必须]
   * @returns
   * @memberof UserService
   */
  resetPassword(params) {
    return post('buyer/password/forget/reset', params)
  }
  /**
   * 买家忘记密码重置密码接口 登录后
   * @param {uid} 买家ID [必须]
   * @param {salt} 签名 [必须]
   * @param {any} params.password 密码 [必须]
   * @param {any} params.confirmPassword 确认密码 [必须]
   * @returns
   * @memberof UserService
   */
  resetPasswordLogin(params) {
    return post('buyer/reset/save/password', params)
  }

  /**
   * 退出登录
   * @param {uid} 买家ID false 表示不需要uid
   * @returns
   * @memberof UserService
   */
  loginOut(params) {
    return get('user/logout', params)
  }
}
