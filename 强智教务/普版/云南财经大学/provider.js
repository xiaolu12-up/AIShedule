function request(tag, url, data) {
  let ss = ''
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    console.log(xhr.readyState + ' ' + xhr.status)
    if ((xhr.readyState === 4 && xhr.status === 200) || xhr.status === 304) {
      ss = xhr.responseText
    }
  }
  xhr.open(tag, url, false)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send(data)
  return ss
}

async function scheduleHtmlProvider(
  iframeContent = '',
  frameContent = '',
  dom = document
) {
  let html = ''
  let ts = `进入教务系统（主页）点击导入
  如导入失败，请联系Q：597576415`
  await loadTool('AIScheduleTools')
  html = request('get', '/jsxsd/xskb/xskb_list.do', null)
  dom = new DOMParser().parseFromString(html, 'text/html')
  if (!dom.getElementById('kbtable')) {
    await AIScheduleAlert(ts)
    return "do not continue"
  }
  return dom.getElementById('kbtable')
    ? dom.getElementById('kbtable').outerHTML
    : dom.getElementsByClassName('content_box')[0].outerHTML
}
