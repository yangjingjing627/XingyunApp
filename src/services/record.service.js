import { post } from 'http'
export default class RecordService {
  /**
   *  打点
   * @param {topicId} 专题id
   * @returns
   * @memberof RecordService
   */
  recording(params = {}) {
    return post('third/transpond/click/count/statistics', params, {isLoading: false})
  }
}
