import { post, get } from 'http'
export default class AuthService {
  /**
   *
   * 登录好升意授权 老版本
   * @param {any} params.authIphone 手机号 [必须]
   * @param {any} params.registercode 验证码 [必须]
   * @param {any} params.hsyStoreId 好升益店铺id | 是
   * @returns
   * @memberof AuthService
   */
  getAuthLogin(params = {}) {
    return post('third/hsy/auth/login', params, {hasUid: false})
  }
  /**
   *
   * 获取好升意授权
   * @param {any} params.authIphone 手机号 [必须]
   * @returns
   * @memberof AuthCodeService
   */
  authCode(params = {}) {
    return post('sms/hsy/bind/send/code', params, {hasUid: false})
  }
  /**
   * 获取绑定店铺手机号
   * @param {any} params.hsyStoreId 店铺id
   * @returns
   * @memberof AuthCodeService
   */
  gethsyStorePhone (params) {
    return get('third/auth/user/phone', params, {isLoading: false, hasUid: false})
  }
  /**
   *
   * 登录好生意授权 新版
   * @param {any} params.authIphone 手机号 [必须]
   * @param {any} params.password 密码 [必须]
   * @param {any} params.hsyStoreId 好升益店铺id | 是
   * @returns
   * @memberof AuthService
   */
  getAuthNewLogin(params = {}) {
    return post('third/auth/user/login', params, {hasUid: false})
  }
}
