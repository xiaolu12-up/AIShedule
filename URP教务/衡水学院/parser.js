function resolveCourseConflicts(result) {
  //将课拆成单节，并去重
  let allResultSet = new Set()
  result.forEach(singleCourse => {
    singleCourse.weeks.forEach(week => {
      singleCourse.sections.forEach(value => {
        let course = { sections: [], weeks: [] }
        course.name = singleCourse.name;
        course.teacher = singleCourse.teacher;
        course.position = singleCourse.position;
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
          let index = firstCourse.name.split('|').indexOf(allResult[i].name);
          if (index === -1) {
            firstCourse.name += "|" + allResult[i].name;
            firstCourse.teacher += "|" + allResult[i].teacher;
            firstCourse.position += "|" + allResult[i].position;
            firstCourse.position = firstCourse.position.replace(/undefined/g, '')
            allResult.splice(i, 1);
            i--;
          } else {
            let teacher = firstCourse.teacher.split("|");
            let position = firstCourse.position.split("|");
            teacher[index] = teacher[index] === allResult[i].teacher ? teacher[index] : teacher[index] + "," + allResult[i].teacher;
            position[index] = position[index] === allResult[i].position ? position[index] : position[index] + "," + allResult[i].position;
            firstCourse.teacher = teacher.join("|");
            firstCourse.position = position.join("|");
            firstCourse.position = firstCourse.position.replace(/undefined/g, '');
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
  // contractResult = contractResult.sort(function (a, b) {
  //     return (a.day - b.day)||(a.sections[0]-b.sections[0]);
  // })
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
        // delete (contractResult[i])
      }
    }
    finallyResult.push(firstCourse);
  }
  //将课程的周次进行合并
  contractResult = JSON.parse(JSON.stringify(finallyResult));
  finallyResult.length = 0;
  // contractResult = contractResult.sort(function (a, b) {
  //     return a.day - b.day;
  // })
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

function getWeeks(Str) {
  function range(con, tag) {
    let retWeek = []
    con.slice(0, -1).split(',').forEach(w => {
      let tt = w.split('-')
      let start = parseInt(tt[0])
      let end = parseInt(tt[tt.length - 1])
      if (tag === 1 || tag === 2) retWeek.push(...Array(end + 1 - start).fill(start).map((x, y) => x + y).filter(f => { return f % tag === 0 }))
      else retWeek.push(...Array(end + 1 - start).fill(start).map((x, y) => x + y).filter(v => { return v % 2 !== 0 }))
    })
    return retWeek
  }
  Str = Str.replace(/[(){}|第\[\]]/g, "").replace(/到/g, "-")
  let reWeek = [];
  let week1 = []
  while (Str.search(/周|\s/) !== -1) {
    let index = Str.search(/周|\s/)
    if (Str[index + 1] === '单' || Str[index + 1] === '双') {
      week1.push(Str.slice(0, index + 2).replace(/周|\s/g, ""));
      index += 2
    } else {
      week1.push(Str.slice(0, index + 1).replace(/周|\s/g, ""));
      index += 1
    }

    Str = Str.slice(index)
    index = Str.search(/\d/)
    if (index !== -1) Str = Str.slice(index)
    else Str = ""

  }
  if (Str.length !== 0) week1.push(Str)
  console.log(week1)
  week1.forEach(v => {
    console.log(v)
    if (v.slice(-1) === "双") reWeek.push(...range(v, 2))
    else if (v.slice(-1) === "单") reWeek.push(...range(v, 3))
    else reWeek.push(...range(v + "全", 1))
  });
  return reWeek;
}

/**
 *
 * @param Str : String : 如: 1-4节 或 1-2-3-4节
 * @returns {Array[{section:Number}]}
 * @example
 * getSection("1-4节")=>[{section:1},{section:2},{section:3},{section:4}]
 */
function getSection(Str) {
  console.log(Str)
  let rejc = [];
  let strArr = Str.replace("节", "").replace(/\s/g, "").split("-");
  if (strArr.length <= 2) {
    for (let i = Number(strArr[0]); i <= strArr[strArr.length - 1]; i++) {
      console.log(strArr, i)
      rejc.push(Number(i));
    }
  } else {
    strArr.forEach(v => {
      rejc.push(Number(v));
    })
  }
  console.log(strArr, rejc)
  return rejc;
}

function scheduleHtmlParser(html) {
  //除函数名外都可编辑
  //传入的参数为上一步函数获取到的html
  //可使用正则匹配
  //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
  //以下为示例，您可以完全重写或在此基础上更改
  let result = []
  let message = ""
  let json = JSON.parse(html)


  try {
    if (!json.tag) {
      let courses = JSON.parse(json.data).dateList[0].selectCourseList
      courses.forEach(course => {
        //  let re = {weeks:[],sections:[]} ;
        let name = course.courseName;
        let teacher = course.attendClassTeacher.replace("*", "").trim().replace(/\s+/g, ",");
        if (!course.timeAndPlaceList) return;
        course.timeAndPlaceList.forEach(time => {
          let day = time.classDay;
          let position = time.classroomName;
          let weeks = new Array();
          let sections = new Array()
          time.classWeek.split("").forEach((em, index) => {
            if (em == 1) weeks.push(index + 1);
          })
          for (let i = 0; i < time.continuingSession; i++) {
            sections.push(time.classSessions + i)
          }
          result.push(JSON.parse(JSON.stringify({
            name: name,
            teacher: teacher,
            position: position,
            day: day,
            weeks: weeks,
            sections: sections
          })))
        })
      })

    } else {
      let $ = cheerio.load(json.data, { decodeEntities: false })
      let hang = $('#courseTableBody tr')
      for (let i = 0; i < hang.length; i++) {
        let lie = $('td', hang.eq(i));
        for (let j = 0; j < lie.length; j++) {
          let kc = lie.eq(j).children('div');
          if (kc.length == 0) {
            continue;
          }
          kc.each(function (i, elem) {
            console.log($(this).html())
            let re = { weeks: [], sections: [] };
            let pa = $(this).children('p');
            console.log(pa)
            re.name = pa.eq(0).text().split('_')[0]
            re.position = pa.eq(4).text().replace(/.*?[校区]/g, "");
            re.teacher = pa.eq(1).text().replace("*", "").trim().replace(/\s+/g, ",")
            re.day = j + 1;
            re.sections = getSection(pa.eq(3).text())
            re.weeks = getWeeks(pa.eq(2).text());
            console.log(re)
            result.push(re);
          });

        }
      }
    }



    if (result.length == 0) message = "课表获取失败"
    else result = resolveCourseConflicts(result)
  } catch (err) {
    message = err.message.slice(0, 50);
  }
  if (message.length !== 0) {
    result.length = 0;
    result.push({
      name: "遇到错误，请加qq群：496486285进行反馈",
      teacher: "开发者-xiao陆同学",
      position: message,
      day: 1,
      weeks: [1],
      sections: [{ section: 1 }, { section: 2 }, { section: 3 }]
    });
  }


  console.log(result)
  return result
}