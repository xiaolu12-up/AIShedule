function getTimes() {
    return [
        {
            "section": 1,
            "startTime": "07:40",
            "endTime": "08:25"
        },
        {
            "section": 2,
            "startTime": "08:35",
            "endTime": "09:20"
        },
        {
            "section": 3,
            "startTime": "09:45",
            "endTime": "10:30"
        },
        {
            "section": 4,
            "startTime": "10:40",
            "endTime": "11:25"
        },
        {
            "section": 5,
            "startTime": "14:30",
            "endTime": "15:15"
        },
        {
            "section": 6,
            "startTime": "15:25",
            "endTime": "16:10"
        },
        {
            "section": 7,
            "startTime": "16:35",
            "endTime": "17:20"
        },
        {
            "section": 8,
            "startTime": "17:30",
            "endTime": "18:15"
        },
        {
            "section": 9,
            "startTime": "19:20",
            "endTime": "20:05"
        },
        {
            "section": 10,
            "startTime": "20:15",
            "endTime": "21:00"
        },
        {
            "section": 11,
            "startTime": "21:10",
            "endTime": "21:55"
        },
        {
            "section": 12,
            "startTime": "11:35",
            "endTime": "12:20"
        },
        {
            "section": 13,
            "startTime": "12:20",
            "endTime": "13:05"
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
        night: 3, // 晚间课程节数：[0, 10]之间的整数
        sections: [],
    }

    // timeJson.sections = getTimes() //分东夏零时
    timeJson.sections = getTimes()//不分

    if (timeJson.sections.length == 0) timeJson = {}
    console.log(timeJson);

    return timeJson
}