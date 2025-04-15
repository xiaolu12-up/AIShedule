function getTimes(
    xJConf,
    dJConf,
    timeRangeConf = {
        summerBegin: '04/30',
        summerEnd: '10/01',
    }
) {
    //xJConf : 夏季时间配置文件
    //dJConf : 冬季时间配置文件
    //return : Array[{},{}]
    let summerBegin = timeRangeConf.summerBegin //夏令时开始时间 :'04/30'
    let summerEnd = timeRangeConf.summerEnd //夏令时结束时间:'10/01'

    dJConf = dJConf === undefined ? xJConf : dJConf
    function getTime(conf) {
        let courseSum = conf.courseSum //课程节数 : 12
        let startTime = conf.startTime //上课时间 :800
        let oneCourseTime = conf.oneCourseTime //一节课的时间
        let shortRestingTime = conf.shortRestingTime //小班空

        let longRestingTimeBegin = conf.longRestingTimeBegin //大班空开始位置
        let longRestingTime = conf.longRestingTime //大班空
        let lunchTime = conf.lunchTime //午休时间
        let dinnerTime = conf.dinnerTime //下午休息
        let abnormalClassTime = conf.abnormalClassTime //其他课程时间长度
        let abnormalRestingTime = conf.abnormalRestingTime //其他休息时间

        let result = []
        let studyOrRestTag = true
        let timeSum = startTime.slice(-2) * 1 + startTime.slice(0, -2) * 60

        let classTimeMap = new Map()
        let RestingTimeMap = new Map()
        if (abnormalClassTime !== undefined)
            abnormalClassTime.forEach((time) => {
                classTimeMap.set(time.begin, time.time)
            })
        if (longRestingTimeBegin !== undefined)
            longRestingTimeBegin.forEach((time) =>
                RestingTimeMap.set(time, longRestingTime)
            )
        if (lunchTime !== undefined)
            RestingTimeMap.set(lunchTime.begin, lunchTime.time)
        if (dinnerTime !== undefined)
            RestingTimeMap.set(dinnerTime.begin, dinnerTime.time)
        if (abnormalRestingTime !== undefined)
            abnormalRestingTime.forEach((time) => {
                RestingTimeMap.set(time.begin, time.time)
            })

        for (let i = 1, j = 1; i <= courseSum * 2; i++) {
            if (studyOrRestTag) {
                let startTime =
                    ('0' + Math.floor(timeSum / 60)).slice(-2) +
                    ':' +
                    ('0' + (timeSum % 60)).slice(-2)
                timeSum +=
                    classTimeMap.get(j) === undefined
                        ? oneCourseTime
                        : classTimeMap.get(j)
                let endTime =
                    ('0' + Math.floor(timeSum / 60)).slice(-2) +
                    ':' +
                    ('0' + (timeSum % 60)).slice(-2)
                studyOrRestTag = false
                result.push({
                    section: j++,
                    startTime: startTime,
                    endTime: endTime,
                })
            } else {
                timeSum +=
                    RestingTimeMap.get(j - 1) === undefined
                        ? shortRestingTime
                        : RestingTimeMap.get(j - 1)
                studyOrRestTag = true
            }
        }
        return result
    }

    let nowDate = new Date()
    let year = nowDate.getFullYear() //2020
    let wuYi = new Date(year + '/' + summerBegin) //2020/05/01
    let jiuSanLing = new Date(year + '/' + summerEnd) //2020/09/30
    let xJTimes = getTime(xJConf)
    let dJTimes = getTime(dJConf)
    console.log('夏季时间:\n', xJTimes)
    console.log('冬季时间:\n', dJTimes)
    if (nowDate >= wuYi && nowDate <= jiuSanLing) {
        return xJTimes
    } else {
        return dJTimes
    }
}

/**
 * 时间配置函数，此为入口函数
 */
async function scheduleTimer() {
    // 这一步为必须，引入代码块
    await loadTool('AIScheduleTools')
    const userSelect = await AIScheduleSelect({
        titleText: '校区', // 标题内容，字体比较大，超过10个字不给显示的喔，也可以不传就不显示
        contentText: '选择校区导入对应时间列表', // 提示信息，字体稍小，支持使用``达到换行效果，具体使用效果建议真机测试，为必传，不传显示版本号
        selectList: [
            '龙泉路校区',
            '安宁校区',
        ], // 选项列表，数组，为必传
    })
    console.log(userSelect);
    let timeJson
    //夏令时配置
    let xJConf
    switch (userSelect) {
        case '龙泉路校区': {
            timeJson = {
                totalWeek: 20, // 总周数：[1, 30]之间的整数
                startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
                startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
                showWeekend: false, // 是否显示周末
                forenoon: 5, // 上午课程节数：[1, 10]之间的整数
                afternoon: 5, // 下午课程节数：[0, 10]之间的整数
                night: 4, // 晚间课程节数：[0, 10]之间的整数
                sections: [],
            }
            xJConf = {
                courseSum: 14,
                startTime: '800',
                oneCourseTime: 40,
                longRestingTime: 30,
                shortRestingTime: 10,
                longRestingTimeBegin: [2, 7],
                lunchTime: { begin: 5, time: 2 * 60 + 10 },
                // dinnerTime: { begin: 9, time: 60 },
                abnormalClassTime: [{ begin: 10, time: 10 }],
                abnormalRestingTime: [{ begin: 10, time: 40 }, { begin: 12, time: 20 }]
            }
            break;
        }
        case '安宁校区': {
            timeJson = {
                totalWeek: 20, // 总周数：[1, 30]之间的整数
                startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
                startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
                showWeekend: false, // 是否显示周末
                forenoon: 5, // 上午课程节数：[1, 10]之间的整数
                afternoon: 5, // 下午课程节数：[0, 10]之间的整数
                night: 3, // 晚间课程节数：[0, 10]之间的整数
                sections: [],
            }
            xJConf = {
                courseSum: 13,
                startTime: '820',
                oneCourseTime: 40,
                longRestingTime: 20,
                shortRestingTime: 10,
                longRestingTimeBegin: [2, 8],
                lunchTime: { begin: 5, time: 2 * 60 - 30 },
                dinnerTime: { begin: 10, time: 50 },
                // abnormalClassTime: [{ begin: 10, time: 50 }],
                // abnormalRestingTime: [{ begin: 7, time: 10 }]
            }
            break;
        }
        default:
            break;
    }




    //冬季时间配置
    let dJConf = {
        courseSum: 12,
        startTime: '830',
        oneCourseTime: 45,
        longRestingTime: 20,
        shortRestingTime: 5,
        longRestingTimeBegin: [2, 6],
        lunchTime: { begin: 4, time: 2 * 60 },
        dinnerTime: { begin: 8, time: 60 + 30 },
        // abnormalClassTime: [{ begin: 10, time: 40 }],
        // abnormalRestingTime: [{begin: 11, time: 5}, {begin: 12, time: 5}]
    }

    //夏令时时间区间
    let timeRangeConf = {
        summerBegin: '03/01',
        summerEnd: '10/30',
    }

    // timeJson.sections = getTimes(xJConf, dJConf, timeRangeConf) //分东夏零时
    timeJson.sections = getTimes(xJConf)//不分

    if (timeJson.sections.length == 0) timeJson = {}
    return timeJson
}