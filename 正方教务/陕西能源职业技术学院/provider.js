async function request(tag, data, url) {
  return await fetch(url, {
    method: tag,
    body: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((rp) => rp.text())
    .then((v) => v)
}
function AIScheduleLoading({
  titleText = '加载中',
  contentText = 'loading...',
} = {}) {
  console.log('start......')
  AIScheduleComponents.addMeta()
  const title = AIScheduleComponents.createTitle(titleText)
  const content = AIScheduleComponents.createContent(contentText)
  const card = AIScheduleComponents.createCard([title, content])
  const mask = AIScheduleComponents.createMask(card)

  let dyn
  let count = 0
  function dynLoading() {
    let t = ['loading', 'loading.', 'loading..', 'loading...']
    if (count == 4) count = 0
    content.innerText = t[count++]
  }

  this.show = () => {
    console.log('show......')
    document.body.appendChild(mask)
    dyn = setInterval(dynLoading, 1000)
  }
  this.close = () => {
    document.body.removeChild(mask)
    clearInterval(dyn)
  }
}
async function scheduleHtmlProvider(
  iframeContent = '',
  frameContent = '',
  dom = document
) {
  //除函数名外都可编辑
  //以下为示例，您可以完全重写或在此基础上更改
  let ts = `导入失败，请联系Q：597576415`
  //     alert(ts)

  await loadTool('AIScheduleTools')
  let loadd = new AIScheduleLoading()
  loadd.show()
  let htt = null
  let xnm = ''
  let xqm = ''
  let forms = dom.getElementById('area_one')
  if (!forms) {
    await AIScheduleAlert(ts)
    loadd.close()
    return 'do not continue'
  }
  xnm = forms.querySelector("#xnm").value
  xqm = forms.querySelector("#xqm").value
  htt = JSON.parse(
    await request(
      'post',
      'xnm=' + xnm + '&xqm=' + xqm,
      '/jwglxt/kbcx/xskbcx_cxXsgrkb.html'
    )
  )
  console.log(htt);
  loadd.close()
  return JSON.stringify({ listArr: htt.kbList, xqm: xqm, xnm: xnm })
}