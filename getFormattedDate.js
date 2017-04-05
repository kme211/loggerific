function leftPad (num) {
    num = num.toString();
    if(num.length === 1) {
        return '0' + num;
    } else {
        return num;
    }
}

function getFormattedDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = `${leftPad(date.getMonth() + 1)}/${leftPad(date.getDate())}/${date.getFullYear()} ${leftPad(date.getHours() + 1)}:${leftPad(date.getMinutes())}`
    return formattedDate;
}

module.exports = getFormattedDate;