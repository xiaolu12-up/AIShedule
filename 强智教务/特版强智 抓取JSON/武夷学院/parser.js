/**
 * 
 * @param {*} z {第13-14周}
 * @param {*} q (全部)
 * @returns [1,2,3,4...]
 */
function parseWeeks(z, q = '全周') {
    const weekStr = z.replace(/[^\d,\-]/g, '') // 去除非数字/逗号/短横线字符
    const parts = weekStr.split(',')           // 按逗号分段
    let tempWeeks = []

    for (const part of parts) {
        const range = part.split('-').map(Number)

        if (range.length === 2) {
            // 是范围，如 12-14
            for (let i = range[0]; i <= range[1]; i++) {
                if (!q.includes('全')) {
                    if ((q.includes('单') && i % 2 === 0) || (q.includes('双') && i % 2 === 1)) continue
                }
                tempWeeks.push(i)
            }
        } else if (range.length === 1) {
            // 是单个周
            let i = range[0]
            if (!q.includes('全')) {
                if ((q.includes('单') && i % 2 === 0) || (q.includes('双') && i % 2 === 1)) continue
            }
            tempWeeks.push(i)
        }
    }

    return tempWeeks
}
function scheduleHtmlParser(html) {
    let con = JSON.parse(html)
    let list = []
    con.forEach(element => {
        // 分割上课地点
        let tempPosition = element.skddmc.split(';')
        let timeList = element.sktime.split(';')
        timeList.forEach((time, index) => {
            let [d, j, z, q] = time.split(/(?<=^.{2})(.*节)(.*})/);
            //["周一","第6、7节","{第13-14周}","(全部)"]
            let sections = j.match(/\d+/g).map(Number)
            console.log([j, z, q, j.includes('-')]);
            // 解析星期
            let day = "一二三四五六日".indexOf(d.charAt(1)) + 1
            //解析节次
            let tempSections = []
            if (j.includes('-') && sections.length > 1) {

                for (let i = sections[0]; i <= sections[1]; i++) {
                    tempSections.push(i)
                }
            } else
                tempSections = [...sections]
            // 解析周次
            let tempWeeks = parseWeeks(z, q)
            console.log('原始数据', element);
            console.log(`解析数据：\n课程名称:${element.kc_mc}\n上课地点:${tempPosition[index]}\n教师名称:${element.jg0101mc}\n周数:${tempWeeks}\n星期${day}\n节次:${tempSections}`);
            list.push({
                name: element.kc_mc, // 课程名称
                position: tempPosition[index], // 上课地点
                teacher: element.jg0101mc, // 教师名称
                weeks: tempWeeks, // 周数
                day: day, // 星期
                sections: tempSections, // 节次
            })
        })
    });
    return list
}
