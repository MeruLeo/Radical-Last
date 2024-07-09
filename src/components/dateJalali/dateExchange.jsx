import moment from 'moment';
import jMoment from 'moment-jalaali';

const convertToJalali = (gregorianDate) => {
    // پارس کردن تاریخ با استفاده از moment
    const momentDate = moment(gregorianDate, 'ddd, DD MMM YYYY HH:mm:ss [GMT]');
    // تبدیل تاریخ میلادی به شمسی با استفاده از moment-jalaali
    const jalaliDate = jMoment(momentDate).format('jYYYY/jMM/jDD');
    return jalaliDate;
};

export default convertToJalali;