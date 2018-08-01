import baseGetTag from './.internal/baseGetTag'
import isObjectLike from './.core/isObjectLike'
import getTag from './.internal/getTag'

/**
 * 判断姓名规则
 * @export
 * @param {any} name  手机号码
 * @returns Boolean 如果是正确 返回true 否则返回false
 */
// 6-20位数字和字母组合
export function enAndZn(val) {
  return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(val)
}
// 钱类型 最大 99999999.99 云采统一金钱校验规则
export function posMoney (val) {
  return /^(0|[1-9][0-9]{0,7})(\.[0-9]{1,2})?$/.test(val)
}
// 只能是汉字 不能超过10个汉字
export function vChineseTen(val) {
  return /^[\u4E00-\u9FA5]{0,10}$/.test(val)
}
// 只允许输入汉字，数字，和英文字母，其他字符不允许输入
export function vRegister(val) {
  return /^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(val)
}
// 是否是 int类型 包括 0
export function isInteger(val) {
  return /^0$|^\+?[1-9]\d*$/.test(val)
}
// 只能是中文、数字、英文、特殊字符（，）
export function isNorString (val) {
  return /^[\u4E00-\u9FA5\w\d/\\,]+$/.test(val)
}
// int型大于0
export function posinteger (val) {
  return /^[0-9]*[1-9][0-9]*$/.test(val)
}
/**
 * 判断是否是手机号码
 * @export
 * @param {any} phone  手机号码
 * @returns Boolean 如果是正确的手机号码 返回true 否则返回false
 */
export function isPhoneNumber(phone) {
  if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
    return false
  }
  return true
}
/**
 * 判断是否是身份证号
 * @export
 * @param {any} cardid  手机号码
 * @returns Boolean 如果是正确的身份证号码 返回true 否则返回false
 */
export function enIdentityCard (val) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)
}

export function isUndefined(value) {
  return value === undefined
}

/**
 * 数组是否存在
 * @export
 * @returns Boolean false不存在 存在返回index 位置
 */
export function containsArr(arr, obj) {
  let i = arr.length
  while (i--) {
    if (arr[i] === obj) {
      return i
    }
  }
  return false
}

/**
 * 数组 对象 是否存在
 * @export  k 是 对相比较的key
 * @returns Boolean false不存在 存在返回index 位置
 */
export function containsArrObj(arr, obj, key) {
  let i = arr.length
  while (i--) {
    if (arr[i][key] === obj[key]) {
      return i
    }
  }
  return false
}

/**
 * JSON.parse
 * @export
 * @returns Boolean false不存在 存在返回index 位置
 */
export function jsonParse(str) {
  try {
    if (str && str !== '' && typeof (str) === 'string') {
      return JSON.parse(str)
    } else {
      return {}
    }
  } catch (e) {
    return {}
  }
}

/**
 * 深度拷贝
 * @export
 ＊ @param {object} parent 父对象
 ＊ @param {object} child 子对象
 * @returns 新对象 子对象更改父对象中的属性
 */
export function extendDeep(parent, child) {
  let toStr = Object.prototype.toString
  let astr = '[object Array]'
  child = child || {}
  for (let i in parent) {
    if (parent.hasOwnProperty(i)) {
      if (typeof parent[i] === 'object') {
        child[i] = (toStr.call(parent[i]) === astr) ? [] : {}
        extendDeep(parent[i], child[i])
      } else {
        child[i] = parent[i]
      }
    }
  }
  return child
}

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `Number.isFinite` method.
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @see isInteger, toInteger, toNumber
 * @example
 *
 * isNumber(3)
 * // => true
 *
 * isNumber(Number.MIN_VALUE)
 * // => true
 *
 * isNumber(Infinity)
 * // => true
 *
 * isNumber('3')
 * // => false
 */
export function isNumber(value) {
  return typeof value === 'number' ||
    (isObjectLike(value) && baseGetTag(value) === '[object Number]')

}

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * isString('abc')
 * // => true
 *
 * isString(1)
 * // => false
 */
export function isString(value) {
  const type = typeof value
  return type === 'string' ||
   (type === 'object' && value != null && !Array.isArray(value) && getTag(value) === '[object String]')
}

/**
 * Checks if `value` is `null`.
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * isNull(null)
 * // => true
 *
 * isNull(void 0)
 * // => false
 */
export function isNull(value) {
  return value === null
}

/**
 *
 * 解决 vuex 因为引用传递引起的问题
 * @export
 * @param {any} value 需要 copy 的数据
 * @returns 返回复制后的数据
 */
export function copy(value) {
  return JSON.parse(JSON.stringify(value))
}

/**
 *
 * 金钱格式化
 * @export
 * @param {any} money 需要 格式化 的数据
 * @returns 格式化后的数据
 */
export function fixed(money) {
  if (money === undefined) {
    return 0
  }
  let m = parseFloat(money)
  let value = m.toFixed(2)
  let last = value.substr(value.length - 1, 1)
  let second = value.substr(value.length - 2, 2)
  if (second === '00') {
    value = value.substr(0, value.length - 3)
  } else if (last === '0') {
    value = value.substr(0, value.length - 1)
  }
  return parseFloat(value)
}

/**
 *
 * 另一个金钱格式化方法
 * @export
 * @param {Number} money 需要格式化的数据
 * @param {Number} places 需要保留的小数位数
 * @param {String} symobl 货币符号
 * @param {String} thousand 三位的分隔符
 * @param {String} decimal 小数位符号
 */
export function moneyFixed(money, places = 2, symobl = '', thousand = ',', decimal = '.') {
  let negative = money < 0 ? '-' : ''
  let i = parseInt(money = Math.abs(+money || 0).toFixed(places), 10) + ''
  let j = i.length
  j = j > 3 ? j % 3 : 0
  return symobl + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(money - i).toFixed(places).slice(2) : '')
}
// 计算支付剩余时间
export function getPayRemain(addtime) {
  let period = new Date().getTime() - addtime * 1000
  let remain = (0.5 * 3600 * 1000) - period
  if (remain > 0) {
    let tmp1 = remain % (24 * 3600 * 1000)
    let hours = parseInt(tmp1 / (3600 * 1000))
    let tmp2 = tmp1 % (3600 * 1000)
    let minutes = parseInt(tmp2 / (60 * 1000))
    let tmp3 = tmp2 % (60 * 1000)
    let seconds = parseInt(tmp3 / 1000)
    if (hours === 0) {
      return minutes + '分' + seconds + '秒'
    } else {
      return hours + '小时' + minutes + '分' + seconds + '秒'
    }
  } else {
    return false
  }
}

export function date2str(date, format) {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  if (format && typeof format === 'function') {
    return format(y, m, d)
  } else {
    return y + '-' + m + '-' + d
  }
}

export function time2str(date, format) {
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  if (h < 10) {
    h = '0' + h
  }
  if (m < 10) {
    m = '0' + m
  }
  if (s < 10) {
    s = '0' + s
  }
  if (format && typeof format === 'function') {
    return format(h, m, s)
  }
  return h + ':' + m + ':' + s
}

// 判断是否是表情，是则返回true
export function isEmojiCharacter(substring) {
  for (let i = 0; i < substring.length; i++) {
    let hs = substring.charCodeAt(i)
    if (hs >= 0xd800 && hs <= 0xdbff) {
      if (substring.length > 1) {
        let ls = substring.charCodeAt(i + 1)
        let uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000
        if (uc >= 0x1d000 && uc <= 0x1f77f) {
          return true
        }
      }
    } else if (substring.length > 1) {
      let ls = substring.charCodeAt(i + 1)
      if (ls === 0x20e3) {
        return true
      }
    } else {
      if (hs >= 0x2100 && hs <= 0x27ff) {
        return true
      } else if (hs >= 0x2B05 && hs <= 0x2b07) {
        return true
      } else if (hs >= 0x2934 && hs <= 0x2935) {
        return true
      } else if (hs >= 0x3297 && hs <= 0x3299) {
        return true
      } else if (hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030 || hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b || hs === 0x2b50) {
        return true
      }
    }
  }
}
export { isLength } from './.core/isLength'
export { isBoolean } from './.core/isBoolean'
export { isObject } from './.core/isObject'
export { isFunction } from './.core/isFunction'
export { dateFormat } from './.core/format'
export { throttle } from './.core/throttle'
export { parseUrl } from './url'
