function getTimes() {
    return [
        {
            "section": 1,
            "startTime": "08:30",
            "endTime": "09:15"
        },
        {
            "section": 2,
            "startTime": "09:15",
            "endTime": "10:00"
        },
        {
            "section": 3,
            "startTime": "10:20",
            "endTime": "11:05"
        },
        {
            "section": 4,
            "startTime": "11:05",
            "endTime": "11:50"
        },
        {
            "section": 5,
            "startTime": "13:30",
            "endTime": "14:15"
        },
        {
            "section": 6,
            "startTime": "14:15",
            "endTime": "15:00"
        },
        {
            "section": 7,
            "startTime": "15:15",
            "endTime": "16:00"
        },
        {
            "section": 8,
            "startTime": "16:00",
            "endTime": "16:45"
        },
        {
            "section": 9,
            "startTime": "18:00",
            "endTime": "18:45"
        },
        {
            "section": 10,
            "startTime": "18:45",
            "endTime": "19:30"
        },
        {
            "section": 11,
            "startTime": "19:45",
            "endTime": "20:30"
        },
        {
            "section": 12,
            "startTime": "20:30",
            "endTime": "21:15"
        }
    ]
}

/**
 * 时间配置函数，此为入口函数
 */
async function scheduleTimer() {
    let timeJson = {
        totalWeek: 20, // 总周数：[1, 30]之间的整数
        startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
        startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
        showWeekend: true, // 是否显示周末
        forenoon: 4, // 上午课程节数：[1, 10]之间的整数
        afternoon: 4, // 下午课程节数：[0, 10]之间的整数
        night: 2, // 晚间课程节数：[0, 10]之间的整数
        sections: [],
    }

    // timeJson.sections = getTimes() //分东夏零时
    timeJson.sections = getTimes()//不分

    if (timeJson.sections.length == 0) timeJson = {}
    console.log(timeJson);

    return timeJson
}