const usingChars = "0123456789" +
    "abcdefghijklmnopqrstuvwxyz" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "/+";

const Base = usingChars.length;
const BaseReciprocal = 1 / Base;
const MaxFraction = 9

/**
 * float number -> base64string
 * @param {number} float_num 
 */
function encode(float_num) {
    // 第一步，取符号位（1表示正数），把输入变为正数
    let sign = 1
    if (float_num < 0) {
        sign = 0;
        float_num = -float_num;
    }
    // 第二部，把第一步结果变成区间(1,1/64]内的数，记录64位小数点偏移量
    let exp = 0
    if (float_num > 0) {
        // 大于等于1，一直除下去
        while (float_num >= 1) {
            float_num *= BaseReciprocal;
            exp += 1;
        }
        // 小于1/64，一直乘下去
        while (float_num < BaseReciprocal) {
            float_num *= Base;
            exp -= 1;
        }
    }
    // 第三步，把第二部结果一直乘以64，得到每一位的值，最多取9位，尾数与过小的数舍去
    // 取出64进制每一位后，按大端序存储
    let result = ""
    for (let len = 0; float_num > Number.EPSILON && len < MaxFraction; ++len) {
        float_num *= Base;
        let digit = Math.floor(float_num);
        float_num -= digit
        result += usingChars.charAt(digit)
    }
    // 第四步，如果没取到9位，补全9位
    result = result.padEnd(MaxFraction, usingChars.charAt(0));
    // 第五步，将符号位与指数的符号位与指数值一起存储至最低两位
    // 指数符号位，1表示指数为正
    let expSign = 1;
    if (exp < 0) {
        expSign = 0;
        exp = -exp;
    }
    exp = (exp << 1) + sign;
    exp = (exp << 1) + expSign;
    // 第六步，将指数值与两个符号位合并的整数转为64进制，按小端序接到第四步的结果后面
    while (exp > 0) {
        let digit = exp % Base;
        exp = (exp - digit) / Base;
        result += usingChars.charAt(digit);
    }
    return result;
}

module.exports = {
    encode,
}
