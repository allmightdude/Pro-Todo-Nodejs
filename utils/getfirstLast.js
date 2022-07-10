module.exports = function getFirstLast(){
    let wDate = new Date();
    let dDay = wDate.getDay() > 0 ? wDate.getDay() : 7;
    let first = wDate.getDate() - dDay + 1 ;
    let firstDayWeek = new Date(wDate.setDate(first));
    let lastDayWeek = new Date(wDate.setDate(firstDayWeek.getDate() + 6 ));

    firstDayWeek = firstDayWeek.toISOString().replace(/T.*/,'').split('-').join('-');
    lastDayWeek = lastDayWeek.toISOString().replace(/T.*/,'').split('-').join('-');

    const dates = [];
    const currentDate = startDate;
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return{ 
        firstDayWeek,
        lastDayWeek
    }
}
