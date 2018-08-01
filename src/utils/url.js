const URL_EXP = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
const fields = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash']
export function parseUrl(url) {
  let arr = URL_EXP.exec(url)
  let param = {}
  arr.forEach((filed, i) => {
    param[fields[i]] = filed
  })
  return param
}
