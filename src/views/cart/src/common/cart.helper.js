/**
 * 购物车处理通用方法 item 是活动list
 */
export function getTotalPrice(item) {
  let total = 0
  let totalPrice = 0
  // 满减优惠价格
  let manjianPrice = 0
  // 促销价格
  let chuxiaoPrice = 0
  // 满件(阶梯价) 优惠金额
  let jietiePrice = 0
  // 组合 优惠金额
  let combinPrice = 0
  // 直降 优惠金额
  let zhijiangPrice = 0
  // 计算优惠金额
  item.activityList.forEach(activity => {
    let activityType = activity.activityType
    // 计算满减
    if (activityType === 10) {
      // 计算当前活动的价格
      let activityPrice = activity.goodsList.reduce((pre, cur) => {
        cur.totalPrice = (cur.count * 1) * (cur.price * 1)
        if (cur.isChecked && !cur.noChecked) {
          pre += cur.totalPrice
          // 计算商品总数
          total += cur.count
          return pre
        }
        return pre
      }, 0)

      let rules = this.$bqUtils.jsonParse(activity.activityRule)
      // 计算出是否满足下一个满减规则
      let manPrice = 0
      for (let ruleIndex in rules) {
        let rule = rules[ruleIndex]
        let full = rule.full * 1
        let discount = rule.discount * 1
        if (activityPrice < full) {
          let arrDesc = []
          if (manPrice > 0) {
            arrDesc.push(`已优惠${manPrice}元, `)
          }
          arrDesc.push(`再买${(full - activityPrice).toFixed(2) * 1}元减${discount}元`)
          // 四舍五入取整
          activity.manjianDesc = arrDesc.join('')
          break
        } else {
          // manjianPrice += discount
          // 金额不累加 只计算最后一个满足的优惠金额
          manPrice = discount
          // 符合条件减去优惠
          activity.manjianDesc = `已优惠${discount}元`
        }
      }
      manjianPrice += manPrice
      // 当前活动的价格计入总价
      totalPrice += activityPrice
    }

    // 计算出折扣价格
    if (activityType === 20) {

      // 当前活动促销总价
      let chuxiaoTotalPrice = 0
      /**
       * 折扣
       * 算出当前是否超出限购数量 如果超出 计算出 超出的价格 按原价计算
       * limitedNum 限购次数 limitedNum * orderUnit
       * promotionsCount 促销商品数量
       * originalCount 原价商品数量 = count - promotionsCount
       * originalPrice 原价
       * 优惠等于 原价-优惠价 * count
       */
      activity.goodsList.forEach(good => {
        if (good.isChecked && !good.noChecked) {
          let limited = good.limitedNum * good.orderUnit
          let totalCount = good.count
          let count = good.count
          // 如果超出限购数量
          if (totalCount > limited) {
            // 原价商品数量
            this.$set(good, 'originalCount', totalCount - limited)
            count = limited
          } else {
            // 如果没有超出限购 设为0
            this.$set(good, 'originalCount', 0)
          }

          // 优惠金额等于 原价 - 促销价 等于优惠价
          let youhuiPrice = (good.originalPrice - good.price) * count
          // 赋值优惠价格
          chuxiaoPrice += youhuiPrice
           // 计算优惠价格 如果是限购 等于 good.count - good.originalCount 是优惠商品
          good.totalPrice = count * good.price
          if (good.originalCount > 0) {
            good.totalPrice = good.totalPrice + (good.originalCount * good.originalPrice)
          }
          // 计算商品总价
          chuxiaoTotalPrice += good.totalPrice
          // 计算商品总数
          total += good.count
        } else {
          let limited = good.limitedNum * good.orderUnit
          let totalCount = good.count
          // 如果超出限购数量
          if (totalCount > limited) {
            // 原价商品数量
            this.$set(good, 'originalCount', totalCount - limited)
          } else {
            // 如果没有超出限购 设为0
            this.$set(good, 'originalCount', 0)
          }
        }

      })
      totalPrice += chuxiaoTotalPrice
    }

    // 计算满件 优惠
    if (activityType === 30) {
      activity.goodsList.forEach(good => {
        if (good.isChecked && !good.noChecked) {
          good.totalPrice = (good.count * 1) * (good.price * 1)
          // 计算满件优惠
          good.tipsAmount = good.tipsAmount ? good.tipsAmount : (good.originalPrice - good.price) * good.count * 1
           // 计算总价
          totalPrice += good.totalPrice
          // 计算商品总数
          total += good.count
          // 计算阶梯价优惠
          jietiePrice += good.tipsAmount
        }
      })
    }

    // 计算组合
    if (activityType === 50) {
      let combinLength = activity.combinLength
      let goodsLength = 0
      // 组合里面每个商品是否符合最小购买数量
      let isMinCount = true
      activity.goodsList.forEach(good => {
        if (good.isChecked && !good.noChecked) {
          // 计算 购物车选中的数量
          let crule = this.$bqUtils.jsonParse(good.activityRule)
          let minCount = crule.minCount * good.orderUnit
          let count = good.count
          goodsLength += 1
          if (count < minCount) {
            isMinCount = false
          }
        }
      })
      // isCombin是否符合组合优惠条件
      if (combinLength <= goodsLength && isMinCount) {
        activity.isCombin = true
      } else {
        activity.isCombin = false
      }
      // isCombin 组合商品是否添加完毕
      if (combinLength <= goodsLength) {
        activity.isCombinLength = true
      } else {
        activity.isCombinLength = false
      }
      activity.goodsList.forEach(good => {
        if (good.isChecked && !good.noChecked) {
          let crule = this.$bqUtils.jsonParse(good.activityRule)
          // 降价时 并且符合组合条件
          if (crule.changeType === 1 && activity.isCombin && isMinCount) {
            let limited = crule.maxCount * good.orderUnit
            let minCount = crule.minCount * good.orderUnit
            let totalCount = good.count
            let count = good.count
            let price = good.price
            // 如果超出限购数量
            price = good.price - crule.changePrice > 0 ? price - crule.changePrice : 0
            if ((totalCount <= limited || !limited) && minCount <= totalCount) {
              // 刚好在最少与限购之间
              this.$set(good, 'comPrice', price)
              this.$set(good, 'originalCount', 0)
            } else {
              // 超出限购
              this.$set(good, 'originalCount', totalCount - limited)
              this.$set(good, 'comPrice', price)
              count = limited
            }
            // 优惠金额等于 原价 - 促销价 等于优惠价
            let youhuiPrice = (good.originalPrice - price) * count
            // 赋值优惠价格
            combinPrice += youhuiPrice
             // 计算优惠价格 如果是限购 等于 good.count - good.originalCount 是优惠商品
            good.totalPrice = count * price
            if (good.originalCount > 0) {
              good.totalPrice = good.totalPrice + (good.originalCount * good.originalPrice)
            }
            // 符合组合 升价
          } else if (crule.changeType !== 1 && activity.isCombin && isMinCount) {
            let price = good.price
            if (crule.changeType === 2) {
              price = good.price + crule.changePrice
            }
            good.totalPrice = good.count * price
            this.$set(good, 'comPrice', price)
          } else {
            good.totalPrice = good.count * good.price
            this.$set(good, 'originalCount', 0)
            this.$set(good, 'comPrice', good.price)
          }
          // 计算组合 优惠
          // good.tipsAmount = good.tipsAmount ? good.tipsAmount : (good.originalPrice - good.price) * good.count * 1
           // 计算总价
          totalPrice += good.totalPrice
          // 计算商品总数
          total += good.count
        } else {
          // 不勾选时，还原价格
          this.$set(good, 'originalCount', 0)
          this.$set(good, 'comPrice', good.price)
        }
      })
    }
    // 计算直降 优惠
    if (activityType === 60) {
      activity.goodsList.forEach(good => {
        if (good.isChecked && !good.noChecked) {
          let crule = this.$bqUtils.jsonParse(good.activityRule)
          let minCount = crule.minCount * good.orderUnit
          let maxCount = crule.maxCount * good.orderUnit
          let count = good.count
          let totalCount = good.count
          let price = good.price
          if (count >= minCount && crule.changeType === 1) {
            price = good.price - crule.changePrice > 0 ? price - crule.changePrice : 0
            // 满足最小优惠
            this.$set(good, 'originalCount', 0)
            this.$set(good, 'comPrice', price)
            // 超出限购
            if (maxCount && maxCount < count) {
              this.$set(good, 'originalCount', totalCount - maxCount)
              count = maxCount
            }
            let youhuiPrice = (good.originalPrice - price) * count
            zhijiangPrice += youhuiPrice
            // 赋值优惠价格
            // 计算优惠价格 如果是限购 等于 good.count - good.originalCount 是优惠商品
            good.totalPrice = count * price
            if (good.originalCount > 0) {
              good.totalPrice = good.totalPrice + (good.originalCount * good.originalPrice)
            }
          } else {
            this.$set(good, 'originalCount', 0)
            this.$set(good, 'comPrice', good.price)
            good.totalPrice = good.price * totalCount
          }
           // 计算总价
          totalPrice += good.totalPrice
          // 计算商品总数
          total += good.count
        }
      })
    }
    // 计算普通商品
    if (!activityType || activityType === 40) {
      activity.goodsList.forEach(good => {
        if (good.isChecked && !good.noChecked) {
          good.totalPrice = (good.count * 1) * (good.price * 1)
           // 计算总价
          totalPrice += good.totalPrice
          // 计算商品总数
          total += good.count
        }

      })

    }

  })
  item.total = total
  // 总价 减去优惠券 等于 合计价格
  item.totalPrice = totalPrice - manjianPrice
  item.discountedTotalPrice = manjianPrice + chuxiaoPrice + jietiePrice + combinPrice + zhijiangPrice
}
