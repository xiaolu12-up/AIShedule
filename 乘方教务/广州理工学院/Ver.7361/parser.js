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
  return resolveCourseConflicts(JSON.parse(html));
}