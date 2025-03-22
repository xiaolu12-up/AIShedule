function getTimes() {
    return [
        {
            "section": 1,
            "startTime": "08:00",
            "endTime": "08:45"
        },
        {
            "section": 2,
            "startTime": "08:55",
            "endTime": "09:40"
        },
        {
            "section": 3,
            "startTime": "10:10",
            "endTime": "10:55"
        },
        {
            "section": 4,
            "startTime": "11:05",
            "endTime": "11:50"
        },
        {
            "section": 5,
            "startTime": "12:40",
            "endTime": "13:25"
        },
        {
            "section": 6,
            "startTime": "13:25",
            "endTime": "14:10"
        },
        {
            "section": 7,
            "startTime": "14:30",
            "endTime": "15:15"
        },
        {
            "section": 8,
            "startTime": "15:25",
            "endTime": "16:10"
        },
        {
            "section": 9,
            "startTime": "16:30",
            "endTime": "17:15"
        },
        {
            "section": 10,
            "startTime": "17:25",
            "endTime": "18:10"
        },
        {
            "section": 11,
            "startTime": "19:00",
            "endTime": "19:45"
        },
        {
            "section": 12,
            "startTime": "19:45",
            "endTime": "20:30"
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
        forenoon: 6, // 上午课程节数：[1, 10]之间的整数
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