function request(tag, url, data) {
  let ss = ''
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    console.log(xhr.responseText)
    if ((xhr.readyState === 4 && xhr.status === 200) || xhr.status === 304) {
      ss = xhr.responseText
    }
  }
  xhr.open(tag, url, false)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send(data)
  return ss
}

function scheduleHtmlProvider(
  iframeContent = '',
  frameContent = '',
  dom = document
) {
  let html = ''
  let tag = true
  try {
    let ifs = document.getElementsByTagName('iframe')
    for (const element of ifs) {
      const doms = element
      if (doms.src && doms.src.search('/jsxsd/xskb/xskb_list.do?viweType=1&needData=1&pageNum=1&pageSize=20') !== -1) {
        const currDom = doms.contentDocument
        html = currDom.getElementById('kbtable')
          ? currDom.getElementById('kbtable').outerHTML
          : currDom.getElementsByClassName('content_box')[0].outerHTML
        tag = false
      }
    }
    // console.log(ifs.length)
    if (tag) {
      // console.log(ifs.length)
      html = dom.getElementById('kbtable').outerHTML
    }
    return html
  } catch (e) {
    console.error(e)

    let html = request('get', '/jsxsd/xskb/xskb_list.do?viweType=1&needData=1&pageNum=1&pageSize=20', null)
    return JSON.stringify(JSON.parse(html).data)
  }
}