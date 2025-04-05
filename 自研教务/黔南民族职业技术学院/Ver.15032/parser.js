async function request(tag, url, data) {
  // 等待 fetch 的结果
  const response = await fetch(url, {
    method: tag,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  const result = await response.json();
  return result.data;
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
// 获取学号
async function waitForStudentId(maxWaitTime = 20000) {
  let student;
  const startTime = Date.now(); // 记录开始时间

  // 定义一个等待函数，用于每隔一段时间检查 student 的值
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  while (true) {
    student = document.querySelector('.ant-col-14 .ant-row .ant-col-20');

    if (student && student.textContent.trim()) {  // 如果 student 有值，跳出循环
      return student.textContent.trim();
    }

    // 检查是否超过最大等待时间（20秒）
    if (Date.now() - startTime >= maxWaitTime) {
      console.error("等待超时，未能获取到学生ID");
      return false; // 超时返回 null 或其他适当的值
    }

    await delay(500);  // 每隔 500ms 检查一次
  }
}

async function scheduleHtmlProvider(
  iframeContent = '',
  frameContent = '',
  dom = document
) {
  let html = ''
  // await loadTool('AIScheduleTools')
  // let loadd = new AIScheduleLoading()
  // loadd.show()
  console.log(123);

  let studentId = await waitForStudentId()
  if (!studentId) {
    // loadd.close()
    return 'do not continue'
  }
  let semester = ''
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  if (currentMonth > 7) {
    let a = currentYear + 1
    semester = currentYear + "-" + a + "-1"
  }
  else {
    let a = currentYear - 1
    semester = a + "-" + currentYear + "-2"
  }
  html = await request('post', '/api/arrange/CourseScheduleAllQuery/studentCourseSchedule', { 'studentId': studentId, 'semester': semester })
  // loadd.close()
  return JSON.stringify(html)
}