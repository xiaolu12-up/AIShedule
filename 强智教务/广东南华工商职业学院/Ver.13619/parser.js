function getTimes(xJConf, dJConf) {
  dJConf = dJConf === undefined ? xJConf : dJConf;

  function getTime(conf) {
    let courseSum = conf.courseSum;  //课程节数 : 12
    let startTime = conf.startTime; //上课时间 :800
    let oneCourseTime = conf.oneCourseTime;  //一节课的时间
    let shortRestingTime = conf.shortRestingTime;  //小班空

    let longRestingTimeBegin = conf.longRestingTimeBegin; //大班空开始位置
    let longRestingTime = conf.longRestingTime;   //大班空
    let lunchTime = conf.lunchTime;     //午休时间
    let dinnerTime = conf.dinnerTime;    //下午休息
    let abnormalClassTime = conf.abnormalClassTime;      //其他课程时间长度
    let abnormalRestingTime = conf.abnormalRestingTime;    //其他休息时间

    let result = [];
    let studyOrRestTag = true;
    let timeSum = startTime.slice(-2) * 1 + startTime.slice(0, -2) * 60;

    let classTimeMap = new Map();
    let RestingTimeMap = new Map();
    if (abnormalClassTime !== undefined) abnormalClassTime.forEach(time => {
      classTimeMap.set(time.begin, time.time)
    });
    if (longRestingTimeBegin !== undefined) longRestingTimeBegin.forEach(time => RestingTimeMap.set(time, longRestingTime));
    if (lunchTime !== undefined) RestingTimeMap.set(lunchTime.begin, lunchTime.time);
    if (dinnerTime !== undefined) RestingTimeMap.set(dinnerTime.begin, dinnerTime.time);
    if (abnormalRestingTime !== undefined) abnormalRestingTime.forEach(time => {
      RestingTimeMap.set(time.begin, time.time)
    });

    for (let i = 1, j = 1; i <= courseSum * 2; i++) {
      if (studyOrRestTag) {
        let startTime = ("0" + Math.floor(timeSum / 60)).slice(-2) + ':' + ('0' + timeSum % 60).slice(-2);
        timeSum += classTimeMap.get(j) === undefined ? oneCourseTime : classTimeMap.get(j);
        let endTime = ("0" + Math.floor(timeSum / 60)).slice(-2) + ':' + ('0' + timeSum % 60).slice(-2);
        studyOrRestTag = false;
        result.push({
          section: j++,
          startTime: startTime,
          endTime: endTime
        })
      } else {
        timeSum += RestingTimeMap.get(j - 1) === undefined ? shortRestingTime : RestingTimeMap.get(j - 1);
        studyOrRestTag = true;
      }
    }
    return result;
  }

  let nowDate = new Date();
  let year = nowDate.getFullYear();                       //2020
  let wuYi = new Date(year + "/" + '05/01');           //2020/05/01
  let jiuSanLing = new Date(year + "/" + '09/30');     //2020/09/30
  let shiYi = new Date(year + "/" + '10/01');          //2020/10/01
  let nextSiSanLing = new Date((year + 1) + "/" + '04/30');    //2021/04/30
  let previousShiYi = new Date((year - 1) + "/" + '10/01');     //2019/10/01
  let siSanLing = new Date(year + "/" + '04/30');         //2020/04/30
  let xJTimes = getTime(xJConf);
  let dJTimes = getTime(dJConf);
  console.log("夏季时间:\n", xJTimes)
  console.log("冬季时间:\n", dJTimes)
  if (nowDate >= wuYi && nowDate <= jiuSanLing) {
    return xJTimes;
  } else if (nowDate >= shiYi && nowDate <= nextSiSanLing || nowDate >= previousShiYi && nowDate <= siSanLing) {
    return dJTimes;
  }
}

function getWeeks(weekStr) {
  //6-8周双,9-14周
  //6-8双,9-14
  //第6周
  //   weekss =  weekStr.replace(/第|周/g,"").split(',').filter(function (s) {return s && s.trim();});;
  weekss = weekStr.replace(/第|\(|\)/g, "")
  let week1 = []
  while (weekss.search(/周/) != -1) {
    zindex = weekss.search(/周/)
    week1.push(weekss.slice(0, zindex + 1).replace("周", ""));
    if (weekss[zindex + 1] == undefined) {
      weekss = "";
    } else if (weekss[zindex + 1].search(/\d/) != -1) {
      weekss = weekss.slice(zindex + 1)
    } else {
      weekss = weekss.slice(zindex + 2)
    }
  }
  week1.push(weekss)
  let reweek = [];
  week1.filter(function (s) {
    return s && s.trim();
  }).forEach(v => {

    if (v.substring(v.length - 1) == "双") {

      v.substring(0, v.length - 1).split(',').forEach(w => {
        let tt = w.split('-').filter(function (s) {
          return s && s.trim();
        });
        for (let z = Number(tt[0]); z <= tt[tt.length - 1]; z++) {
          if (z % 2 == 0) {
            reweek.push(z)
          }
          ;
        }
      })
    } else if (v.substring(v.length - 1) == "单") {
      v.substring(0, v.length - 1).split(',').forEach(w => {
        let tt = w.split('-').filter(function (s) {
          return s && s.trim();
        });
        for (let z = Number(tt[0]); z <= tt[tt.length - 1]; z++) {
          if (z % 2 != 0) {
            reweek.push(z)
          }
          ;
        }
      })
    } else {
      v.split(',').forEach(w => {
        let tt = w.split('-').filter(function (s) {
          return s && s.trim();
        });
        for (let z = Number(tt[0]); z <= tt[tt.length - 1]; z++) {
          reweek.push(z);
        }
      })
    }
  });
  return reweek;
}

function getSection(Str) {
  let rejc = [];
  Str = Str.replace("节", "").trim().split("-")
  Str.forEach(v => {
    rejc.push({ section: Number(v) });
  })
  return rejc;

}

function scheduleHtmlParser(html) {
  let $ = cheerio.load(html, { decodeEntities: false });
  let result = []
  console.log("html")
  let hang = $('tbody tr')
  console.log(hang)
  for (let i = 1; i < hang.length - 1; i++) {
    let lie = $('td', hang.eq(i));
    for (let j = 0; j < lie.length; j++) {
      let kc = lie.eq(j).children('div[class="kbcontent"]');
      if (kc.text().length <= 6) {
        continue;
      }
      let kcco = kc.html().split(/-{3,}/);
      kcco.forEach(con => {
        let conarr = con.split("<br>").filter(function (s) {
          return s && s.trim();
        })
        let re = { weeks: [], sections: [] };
        re.day = j + 1;
        conarr.forEach(function (em, index) {
          console.log(em)
          if (index == 0) {
            re.name = em;
          } else {
            if (em.match(/(?<=title\="老师"\>).*?(?=\<)|(?<=title\="教师"\>).*?(?=\<)/) != null) {
              re.teacher = em.match(/(?<=title\="老师"\>).*?(?=\<)|(?<=title\="教师"\>).*?(?=\<)/)[0].replace(/无职称|（高校）/, "");
            }
            if (em.match(/(?<=title\="教室"\>).*?(?=\<)/) != null) {
              re.position = em.match(/(?<=title\="教室"\>).*?(?=\<)/)[0].replace("(主校区)", "");
            }
            if (em.match(/(?<=title\="周次\(节次\)"\>).*?(?=\<)/) != null) {
              re.weeks = getWeeks(em.match(/(?<=title\="周次\(节次\)"\>).*?(?=\<)/)[0].split("[")[0]);
              if (em.match(/(?<=title\="周次\(节次\)"\>).*?(?=\<)/)[0].match(/(?<=\[).*?(?=\])/) != null) {
                re.sections = getSection(em.match(/(?<=title\="周次\(节次\)"\>).*?(?=\<)/)[0].match(/(?<=\[).*?(?=\])/)[0])
              } else {
                for (jie = i * 2 - 1; jie <= i * 2; jie++) {
                  let sec = {};
                  sec.section = jie;
                  re.sections.push(sec);
                }
              }

            }
          }
        })
        // if(re.weeks.length == 0) return;
        result.push(re);
      })

    }

  }
  let Conf = {           //夏季配置
    courseSum: 13,     //课程节数 : int :必选
    startTime: '830', //第一节上课时间 : String : 必选 : 例："8:00"=>'800',"10:30"=>'1030'
    oneCourseTime: 40, //一节课时间,单位：min : int : 必选
    shortRestingTime: 5, //小班空, 单位：min : int : 必选
    //longRestingTime : 20, //大班空， 单位：min : int : 可选
    /// longRestingTimeBegin : [2],//大班空的开始节数 : Array[int] : 可选
    lunchTime: { begin: 6, time: 118 }, //午休时间:{begin:Number//开始的节数,time:number//时长}:单位：min:可选
    dinnerTime: { begin: 11, time: 110 },   //晚餐时间 :{begin:Number//开始的节数,time:number//时长}:单位：min:可选
    //abnormalClassTime : [{begin:11,time:120}],    //其他的课程时间 : Array[{},{}] : {begin:Number//开始的节数,time:number//时长} : 单位：min : 可选
    //  abnormalRestingTime : [{begin:6,time:15},{begin:10,time:0}]   //其他休息时间时间 : Array[{},{}] : {begin:Number//开始的节数,time:number//时长} : 单位：min : 可选
  };
  return { courseInfos: result, sectionTimes: getTimes(Conf) }

}