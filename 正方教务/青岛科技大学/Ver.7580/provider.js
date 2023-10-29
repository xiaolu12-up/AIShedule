let req = async (method, url, data) => {
  return await fetch(url, {
    method: method, body: data, mheaders: {
      'Content-Type': 'text/html;charset=UTF-8'
    }
  }).then(v => v.json()).then(v => v).catch(v => v)
}
let reqText = async (method, url, data) => {
  return await fetch(url, {
    method: method, body: data, mheaders: {
      'Content-Type': 'text/html;charset=UTF-8'
    }
  }).then(v => v.text()).then(v => v).catch(v => v)
}
async function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {//函数名不要动
  // 以下可编辑
  if (!dom.querySelector('[src="xsgrkbcx!xsgrkbMain.action"]')) {
    let htm = await reqText("get", '/xsgrkbcx!getXsgrbkList.action', null)
    dom = new DOMParser().parseFromString(htm, "text/html")
  } else {
    dom = dom.querySelector('[src="xsgrkbcx!xsgrkbMain.action"]').contentDocument.querySelector('[src="xsgrkbcx!getXsgrbkList.action"]').contentDocument
  }
  let xnxqdmValue = dom.getElementById("xnxqdm").value
  let re = (await req("get", "http://jwgl.gzist.edu.cn/xsgrkbcx!getKbRq.action?xnxqdm=" + xnxqdmValue, null))[0]
  let kcMap = new Map()
  let result = []
  for (key in re) {
    let res = {
      name: re[key].kcmc,
      teacher: re[key].teaxms,
      position: re[key].jxcdmc,
      day: re[key].xq,
      weeks: [Number(re[key].zc)],
      sections: re[key].jcdm2.split(",").map(v => Number(v))
    }
    let keys = res.name + res.teacher + res.position + res.day + res.sections.join(",");
    if (!kcMap.get(keys)) kcMap.set(keys, res)
    else kcMap.get(keys).weeks.push(res.weeks[0])

  }
  for ([key, value] of kcMap) {
    result.push(value)
  }
  return JSON.stringify(result)
}