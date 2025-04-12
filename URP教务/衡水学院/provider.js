
async function req(method, url, data) {
  return await fetch(url, { method: method, body: data }).then(v => v.text()).then(v => v).catch(v => v)
}
async function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
  //除函数名外都可编辑
  //以下为示例，您可以完全重写或在此基础上更改
  //alert("请使用【本学期课表】导入")
  //let tag = confirm("选择导入模式，导入失败时请选择另外一种模式\n模式一（推荐）：确定\n模式二：取消")
  let html;
  let tag;
  let content = dom.getElementById("courseTable")
  if (!content) {
    html = await req("get", "/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback", null)

  }
  else { html = document.getElementById("courseTable").outerHTML; }

  return JSON.stringify({ data: html, tag: !!content })
}