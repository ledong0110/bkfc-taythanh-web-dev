
function displayTime(className, blogTime){
    var time_class = document.getElementsByClassName(className);
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log("Time zone:", tz);

    for (let i = 0; i < time_class.length; i++) {
        if (i >= blogTime.length) {
            var newTime_js = new Date(blogTime[i - blogTime.length]);
        }
        else {
            var newTime_js = new Date(blogTime[i]);
        }
        // console.log("Time before format:", newTime_js);
        const newTime = moment(newTime_js.toString()).tz(tz).format();
        // console.log("Time to disp:", newTime);
        let timeStr = moment(newTime).format("L");
        // console.log(timeStr);
        time_class[i].innerHTML = timeStr;
    }
}