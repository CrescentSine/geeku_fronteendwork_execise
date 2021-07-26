const usingChars = "0123456789" +
    "abcdefghijklmnopqrstuvwxyz" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "/+";

/**
 * @type {Record<string,number>}
 */
const charsValue = {}
for (let i = 0; i < usingChars.length; ++i) {
    charsValue[usingChars.charAt(i)] = i;
}

const Base = usingChars.length;
const BaseReciprocal = 1 / Base;
const MaxFraction = 10

const SpecialValues = new Map([
    [Number.NaN, "NaN"],
    [Number.POSITIVE_INFINITY, "+Infinity"],
    [Number.NEGATIVE_INFINITY, "-Infinity"],
]);

const SpecialResult = new Map(
    [...SpecialValues].map(([n, r]) => [r, n])
);

/**
 * float number -> base64string
 * @param {number} float_num 
 */
function encode(float_num) {
    if (SpecialValues.has(float_num)) {
        return SpecialValues.get(float_num);
    }
    // 第一步，取符号位（1表示正数），把输入变为正数
    let sign = 1
    if (float_num < 0) {
        sign = 0;
        float_num = -float_num;
    }
    // 第二部，把第一步结果变成区间(1,1/64]内的数，记录64位小数点偏移量
    let exp = -1 //区间(1,1/64]自带一位偏移量
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
    else {
        exp = 0;
    }
    // 第三步，把第二部结果一直乘以64，得到每一位的值，最多取9位，尾数与过小的数舍去
    // 取出64进制每一位后，按大端序存储
    let result = ""
    for (let len = 0; float_num > Number.EPSILON && len < MaxFraction; ++len) {
        float_num *= Base;
        let digit = Math.floor(float_num);
        float_num -= digit;
        result += usingChars.charAt(digit);
    }
    // 第四步，表示出科学计数法有效数字部分
    if (result.length == 0) {
        result = "0";
    }
    if (result.length > 1) {
        result = result.slice(0, 1) + "." + result.slice(1);
    }
    if (sign == 0) {
        result = "-" + result;
    }
    result += "(64)";
    if (exp != 0) {
        result += "*10(64)^"
        // 第五步，取指数符号位
        if (exp < 0) {
            exp = -exp;
            result += "-"
        }
        // 第六步，将指数值转为64进制，按小端序接到第四步的结果后面
        while (exp > 0) {
            let digit = exp % Base;
            exp = (exp - digit) / Base;
            result += usingChars.charAt(digit);
        }
        result += "(64)";
    }
    return result;
}

const match64NumStr = /^([\+\-]?)([0-9a-zA-Z\/\+]+)(?:\.([0-9a-zA-Z\/\+]+))?\(64\)(?:\*10\(64\)\^([\+\-]?)([0-9a-zA-Z\/\+]+)\(64\))?$/;

/**
 * base64string -> float number
 * @param {string} base64_value 
 */
function decode(base64_value) {
    if (SpecialResult.has(base64_value)) {
        return SpecialResult.get(base64_value);
    }

    let matched = base64_value.match(match64NumStr);
    if (!matched) {
        return Number.NaN;
    }

    let [, sign, integer, tail, expSign, expStr] = matched;

    let result = 0;
    for (let symbol of integer) {
        let digit = charsValue[symbol];
        if (digit === void 0) return Number.NaN;
        result = result * Base + digit;
    }
    if (tail) {
        let frac = BaseReciprocal;
        for (let symbol of tail) {
            let digit = charsValue[symbol];
            if (digit === void 0) return Number.NaN;
            result = result + digit * frac;
            frac *= BaseReciprocal;
        }
    }
    if (sign == "-") {
        result *= -1;
    }

    let exp = 0;
    if (expStr) {
        for (let symbol of expStr) {
            let digit = charsValue[symbol];
            if (digit === void 0) return Number.NaN;
            exp = exp * Base + digit;
        }
        if (expSign == "-") {
            exp *= -1;
        }
    }
    return result * (Base ** exp);
}

module.exports = {
    encode,
    decode,
}
