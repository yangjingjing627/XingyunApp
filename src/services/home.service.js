import { get, post } from 'http'
export default class HomeService {
  /**
   *
   * 获取首页信心-------2.0版本废弃
   * @param {any} params.device 接口必传参数
   * @returns
   * @memberof HomeService
   */
  getHomeInfo(params = {}) {
    params.device = 'phone'
    return get('buyer/index', params, {isLoading: false})
  }

  /**
   *
   * 店铺注册发送验证码
   * @param {any} params.phone 注册电话 [必须]
   * @param {any} params.type 类型(1.手机,2.邮箱)
   * @returns
   * @memberof HomeService
   */
  sendCode(params = {}) {
    return post('wechat/user/register/before/send/code', params, {hasUid: false})
  }

  /**
   *
   * 店铺注册按钮
   * @param {any} params.phone 注册电话 [必须]
   * @param {any} params.code 验证码 [必须]
   * @param {any} params.invitationCode 注册码 [选须]
   * @returns
   * @memberof HomeService
   */
  volideCode(params = {}) {
    return post('wechat/user/register/submit', params, {hasUid: false})
  }

  /**
   *
   * 获取区域信息
   * @param {any} params.uid 注册电话 [必须]
   * @param {Number} params.regionId id如果是省传1,其他的传选中的id [必须]
   * @returns
   * @memberof HomeService
   */
  getCityInfo(params = {}) {
    return get('util/get/all/regionList', params, {isLoading: false})
  }

  /**
   *
   * 店铺注册上传信息
   * @param {any} params.authIphone 注册电话 [必须]
   * @param {any} params.registercode 验证码 [必须]
   * @param {any} params.selectcode 注册码 [选须]
   * @returns
   * @memberof HomeService
   */
  submitAuth(params = {}) {
    return post('wechat/user/store/info/submit', params, {isLoading: false})
  }

  /**
   *
   * 获取首页banner信息
   * @param {any} params.device 区分设备 接口必传参数
   * @returns
   * @memberof HomeService
   */
  bannerList(params = {}) {
    params.device = 'wechat'
    return get('wechat/config/banner/list', params, {isLoading: false})
  }

  /**
   *
   * 获取首页单栏专区信息
   * @returns
   * @memberof HomeService
   */
  singleList(params = {}) {
    return get('wechat/config/single/program/list', params, {isLoading: false})
  }
  /**
   *
   * 获取行业信息
   * @param {any} params
   * @returns
   * @memberof HomeService
   */
  getIndustry(params = {}) {
    return get('util/get/store/industry/list', params, {isLoading: false})
  }
}
