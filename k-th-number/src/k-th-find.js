/** 
 * @param {number[]} list 
 * @param {number} a 
 * @param {number} b 
 */
function _swap(list, a, b) {
    let t = list[a];
    list[a] = list[b];
    list[b] = t;
}

/**
 * @param {number} start 
 * @param {number} end 
 * @returns int number in [start, end)
 */
function _rand(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

/**
 * @param {number[]} list 
 * @param {number} start 
 * @param {number} end 
 * @param {number} k_th 
 * @returns {number}
 */
function _k_th_find(list, start, end, k_th) {
    let sign_pos = _rand(start, end);
    let sign_val = list[sign_pos];
    _swap(list, end - 1, sign_pos);
    let left = start;
    for (let i = start; i < end; ++i) {
        if (list[i] >= sign_val) {
            _swap(list, i, left++);
        }
    }
    if (left == k_th) {
        return list[left - 1];
    }
    if (left > k_th) {
        return _k_th_find(list, start, left - 1, k_th);
    }
    return _k_th_find(list, left, end, k_th);
}

/**
 * @param {number[]} list 
 * @param {number} k_th 
 */
function KthFind(list, k_th) {
    return _k_th_find(list, 0, list.length, k_th);
}

module.exports = {
    KthFind,
}