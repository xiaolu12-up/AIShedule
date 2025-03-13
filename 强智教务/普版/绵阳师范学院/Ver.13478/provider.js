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

function getUrl(dom) {

  var kbjcmss = dom.getElementsByName("kbjcmsid");
  var kbjcmsid = "";
  for (var i = 0; i < kbjcmss.length; i++) {
    if (kbjcmss[i].className == "layui-this") {
      kbjcmsid = kbjcmss[i].getAttribute("data-value");
    }
  }
  console.log(dom.getElementsByClassName('search'))
  let selects = dom.getElementsByClassName('search')[0].getElementsByTagName('select')[0]
  console.log(selects)
  let index = selects.selectedIndex
  let text = selects[index].outerText

  return "/jsxsd/framework/mainV_index_loadkb.htmlx?rq=all&sjmsValue=" + kbjcmsid + "&xnxqid=" + text + "&xswk=false"

}

async function scheduleHtmlProvider(
  iframeContent = '',
  frameContent = '',
  dom = document
) {
  //除函数名外都可编辑
  //以下为示例，您可以完全重写或在此基础上更改
  await loadTool('AIScheduleTools')

  let tagType = document.getElementsByClassName("tabs-selected")[0].getAttribute("data-yjcode")
  if (tagType !== 'NEW_XSD_PYGL') {
      await AIScheduleAlert("请位于学期理论课表");
      return "do not continue"
  }


    let html = ''
    let tag = true
    try {
      let ifs = document.getElementsByTagName('iframe')
      for (let index = 0; index < ifs.length; index++) {
        const doms = ifs[index]
        if (doms.src && doms.src.search('/jsxsd/xskb/xskb_list.do') != -1) {
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
  
    } catch (e) {
      console.error(e)
      let htmlt = request('get', '/jsxsd/xskb/xskb_list.do', null)
      dom = new DOMParser().parseFromString(htmlt, 'text/html')
      html = dom.getElementById('kbtable')
        ? dom.getElementById('kbtable').outerHTML
        : dom.getElementsByClassName('content_box')[0].outerHTML
    }
  return html
}
