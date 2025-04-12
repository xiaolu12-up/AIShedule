/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer() {

  try {
    let fr = new FormData()
    fr.append("ff", "f")
    let times = await fetch("/ajax/student/getSectionAndTime", { method: "post", body: fr }).then(t => t.json()).then(v => v).catch((err) => { console.log(err) })
    let section = []
    console.log(times)
    let secs = times.data.sectionTime
    secs.forEach(v => {
      section.push({
        "section": v.id.session,
        "startTime": v.startTime.slice(0, 2) + ":" + v.startTime.slice(2),
        "endTime": v.endTime.slice(0, 2) + ":" + v.endTime.slice(2)
      })
    })
    return {
      totalWeek: times.data.section.xqzs, // 总周数：[1, 30]之间的整数
      startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
      startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
      showWeekend: false, // 是否显示周末
      forenoon: times.data.section.swjc, // 上午课程节数：[1, 10]之间的整数
      afternoon: times.data.section.xwjc, // 下午课程节数：[0, 10]之间的整数
      night: times.data.section.wsjc, // 晚间课程节数：[0, 10]之间的整数
      sections: section // 课程时间表，注意：总长度要和上边配置的节数加和对齐
    }
  } catch (e) {
    console.error(e)
    return {}
  }

}