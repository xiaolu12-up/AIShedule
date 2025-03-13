function getWeeks(Str) {
  function range(con, tag) {
    let retWeek = [];
    con.slice(0, -1).split(',').forEach(w => {
      let tt = w.split('-');
      let start = parseInt(tt[0]);
      let end = parseInt(tt[tt.length - 1]);
      if (tag === 1 || tag === 2) retWeek.push(...Array(end + 1 - start).fill(start).map((x, y) => x + y).filter(f => {
        return f % tag === 0;
      }))
      else retWeek.push(...Array(end + 1 - start).fill(start).map((x, y) => x + y).filter(v => {
        return v % 2 !== 0;
      }))
    })
    return retWeek;
  }

  Str = Str.replace(/[(){}|第\[\]]/g, "").replace(/到/g, "-");
  let reWeek = [];
  let week1 = [];
  while (Str.search(/周|\s/) !== -1) {
    let index = Str.search(/周|\s/);
    if (Str[index + 1] === '单' || Str[index + 1] === '双') {
      week1.push(Str.slice(0, index + 2).replace(/周|\s/g, ""));
      index += 2;
    } else {
      week1.push(Str.slice(0, index + 1).replace(/周|\s/g, ""));
      index += 1;
    }

    Str = Str.slice(index);
    index = Str.search(/\d/);
    if (index !== -1) Str = Str.slice(index);
    else Str = "";

  }
  if (Str.length !== 0) week1.push(Str);
  console.log(week1);
  week1.forEach(v => {
    console.log(v);
    if (v.slice(-1) === "双") reWeek.push(...range(v, 2));
    else if (v.slice(-1) === "单") reWeek.push(...range(v, 3));
    else reWeek.push(...range(v + "全", 1));
  });
  return reWeek;
}

function getSection(Str) {
  let reJc = [];
  let strArr = Str.replace("节", "").trim().split("-");
  if (strArr.length <= 2) {
    for (let i = Number(strArr[0]); i <= Number(strArr[strArr.length - 1]); i++) {
      reJc.push(Number(i));
    }
  } else {
    strArr.forEach(v => {
      reJc.push(Number(v));
    })
  }
  return reJc;
}

function resolveCourseConflicts(result) {
  let splitTag = "&" //重复课程之间的分割标识
  //将课拆成单节，并去重
  let allResultSet = new Set()
  result.forEach(singleCourse => {
    singleCourse.weeks.forEach(week => {
      singleCourse.sections.forEach(value => {
        let course = { sections: [], weeks: [] }
        course.name = singleCourse.name;
        course.teacher = singleCourse.teacher == undefined ? "" : singleCourse.teacher;
        course.position = singleCourse.position == undefined ? "" : singleCourse.position;
        course.day = singleCourse.day;
        course.weeks.push(week);
        course.sections.push(value);
        allResultSet.add(JSON.stringify(course));
      })
    })
  })
  let allResult = JSON.parse("[" + Array.from(allResultSet).toString() + "]").sort(function (a, b) {
    //return b.day - e.day;
    return (a.day - b.day) || (a.sections[0] - b.sections[0]);
  })

  //将冲突的课程进行合并
  let contractResult = [];
  while (allResult.length !== 0) {
    let firstCourse = allResult.shift();
    if (firstCourse == undefined) continue;
    let weekTag = firstCourse.day;
    for (let i = 0; allResult[i] !== undefined && weekTag === allResult[i].day; i++) {
      if (firstCourse.weeks[0] === allResult[i].weeks[0]) {
        if (firstCourse.sections[0] === allResult[i].sections[0]) {
          let index = firstCourse.name.split(splitTag).indexOf(allResult[i].name);
          if (index === -1) {
            firstCourse.name += splitTag + allResult[i].name;
            firstCourse.teacher += splitTag + allResult[i].teacher;
            firstCourse.position += splitTag + allResult[i].position;
            allResult.splice(i, 1);
            i--;
          } else {
            let teacher = firstCourse.teacher.split(splitTag);
            let position = firstCourse.position.split(splitTag);
            teacher[index] = teacher[index] === allResult[i].teacher ? teacher[index] : teacher[index] + "," + allResult[i].teacher;
            position[index] = position[index] === allResult[i].position ? position[index] : position[index] + "," + allResult[i].position;
            firstCourse.teacher = teacher.join(splitTag);
            firstCourse.position = position.join(splitTag);
            allResult.splice(i, 1);
            i--;
          }

        }
      }
    }
    contractResult.push(firstCourse);
  }
  //将每一天内的课程进行合并
  let finallyResult = []
  while (contractResult.length != 0) {
    let firstCourse = contractResult.shift();
    if (firstCourse == undefined) continue;
    let weekTag = firstCourse.day;
    for (let i = 0; contractResult[i] !== undefined && weekTag === contractResult[i].day; i++) {
      if (firstCourse.weeks[0] === contractResult[i].weeks[0] && firstCourse.name === contractResult[i].name && firstCourse.position === contractResult[i].position && firstCourse.teacher === contractResult[i].teacher) {
        if (firstCourse.sections[firstCourse.sections.length - 1] + 1 === contractResult[i].sections[0]) {
          firstCourse.sections.push(contractResult[i].sections[0]);
          contractResult.splice(i, 1);
          i--;
        } else break
      }
    }
    finallyResult.push(firstCourse);
  }
  //将课程的周次进行合并
  contractResult = JSON.parse(JSON.stringify(finallyResult));
  finallyResult.length = 0;
  while (contractResult.length != 0) {
    let firstCourse = contractResult.shift();
    if (firstCourse == undefined) continue;
    let weekTag = firstCourse.day;
    for (let i = 0; contractResult[i] !== undefined && weekTag === contractResult[i].day; i++) {
      if (firstCourse.sections.sort((a, b) => a - b).toString() === contractResult[i].sections.sort((a, b) => a - b).toString() && firstCourse.name === contractResult[i].name && firstCourse.position === contractResult[i].position && firstCourse.teacher === contractResult[i].teacher) {
        firstCourse.weeks.push(contractResult[i].weeks[0]);
        contractResult.splice(i, 1);
        i--;
      }
    }
    finallyResult.push(firstCourse);
  }
  console.log(finallyResult);
  return finallyResult;
}

function scheduleHtmlParser(html) {
  let $ = cheerio.load(html, { decodeEntities: false });
  let result = []
  let message = "";
  try {
    $('tbody tr').each(function (jcIndex, _) {
      $(this).children("td").each(function (day, _) {
        let kc = $(this).children('div[class="kbcontent"]');
        if (kc.text().length <= 6) {
          return
        }
        let re = { weeks: [], sections: [] };
        let kcco = kc.html().split(/<br>/)
        let nameTag = true; //判断课程名是否使用
        let nameAfter = 1;    //判断课程名后面是否为干扰项
        kcco.forEach(con => {
          $ = cheerio.load(con, { decodeEntities: false })
          console.log('%c %s', 'color:pink;', $.html());
          re.day = day + 1;

          let font = $("body").children("font");
          if (font.length > 1) {
            //处理教室名中教学楼名重复
            if (font.eq(0).attr("title") == "教学楼") {
              let jxlName = font.eq(0).text().replace(/【|】/g, "")
              //   console.log(jxlName)
              //   console.log(font.eq(1).text().slice(jxlName.length))
              if (font.eq(1).text().slice(jxlName.length).search(jxlName) !== -1) {
                font.eq(1).text(font.eq(1).text().slice(jxlName.length))
              }
            }

            font = $("font").filter('[style!="display:none;"]');
          } else if (font.length === 1 && font.attr("style") !== undefined) {

            return;
          }
          console.log('%c %s : %s', 'color:#0f0;', !font.attr("title") ? "课程" : font.attr("title"), $("body").text());
          nameAfter += 1
          switch (!font.attr("title") && nameAfter > 1 ? "课程" : font.attr("title")) {

            case "课程":
              if (nameTag) {
                re.name = $("body").text();
                re.name = re.name.replace(/\([a-z]+\d+.*?\)/, "")//去除课程名中括号部分内容,例 JAVA(ASD1231)=>JAVA
                nameTag = false;
                nameAfter = 0;
              } else {
                result.push(JSON.parse(JSON.stringify(re)))
                re = { weeks: [], sections: [] };
                nameTag = true;
              }

              break;
            case "老师":
              re.teacher = font.text();
              break;
            case "教师":
              re.teacher = font.text();
              break;
            case "教室":
              re.position = font.text();
              re.position = re.position.replace(/\(.*?\)/, "");//去除教室名中括号部分内容,例 教学楼(21321)=>教学楼
              break;
            case "教学楼":
              re.position = font.text();
              break;
            case "周次(节次)":
              re.weeks = getWeeks(font.text().split("[")[0]);
              let jcStr = font.text().match(/(?<=\[).*?(?=\])/g);
              //console.log(jcStr)
              if (jcStr) re.sections = getSection(jcStr[0]);
              else {
                for (let jie = jcIndex * 2 - 1; jie <= jcIndex * 2; jie++) {
                  re.sections.push(jie);
                }
              }
              break;
          }
        })
      })
    })
    console.log(result);
    if (result.length === 0) message = "未获取到课表";
    else result = resolveCourseConflicts(result);
  } catch (err) {
    console.error(err)
    message = err.message.slice(0, 50);
  }
  console.log(result)
  return result;
}