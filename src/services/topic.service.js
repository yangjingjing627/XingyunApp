import { get } from 'http'
export default class TopicService {
  /**
   * 登录
   * @param {topicId} 专题id
   * @returns
   * @memberof UserService
   */
  getByTopicId(params) {
    return get('wechat/config/special/topic/detail', params, {isLoading: false})
  }
}
