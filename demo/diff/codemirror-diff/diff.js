"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presentableDiff = exports.diffIsPrecise = exports.diff = exports.Change = void 0;
class Change {
    constructor(fromA, toA, fromB, toB) {
        this.fromA = fromA;
        this.toA = toA;
        this.fromB = fromB;
        this.toB = toB;
    }
    offset(offA, offB = offA) {
        return new Change(this.fromA + offA, this.toA + offA, this.fromB + offB, this.toB + offB);
    }
}
exports.Change = Change;
function findDiff(a, fromA, toA, b, fromB, toB) {
    if (a == b)
        return [];
    let prefix = commonPrefix(a, fromA, toA, b, fromB, toB);
    let suffix = commonSuffix(a, fromA + prefix, toA, b, fromB + prefix, toB);
    fromA += prefix;
    toA -= suffix;
    fromB += prefix;
    toB -= suffix;
    let lenA = toA - fromA, lenB = toB - fromB;
    if (!lenA || !lenB)
        return [new Change(fromA, toA, fromB, toB)];
    if (lenA > lenB) {
        let found = a.slice(fromA, toA).indexOf(b.slice(fromB, toB));
        if (found > -1)
            return [
                new Change(fromA, fromA + found, fromB, fromB),
                new Change(fromA + found + lenB, toA, toB, toB)
            ];
    }
    else if (lenB > lenA) {
        let found = b.slice(fromB, toB).indexOf(a.slice(fromA, toA));
        if (found > -1)
            return [
                new Change(fromA, fromA, fromB, fromB + found),
                new Change(toA, toA, fromB + found + lenA, toB)
            ];
    }
    if (lenA == 1 || lenB == 1)
        return [new Change(fromA, toA, fromB, toB)];
    let half = halfMatch(a, fromA, toA, b, fromB, toB);
    if (half) {
        let [sharedA, sharedB, sharedLen] = half;
        return findDiff(a, fromA, sharedA, b, fromB, sharedB)
            .concat(findDiff(a, sharedA + sharedLen, toA, b, sharedB + sharedLen, toB));
    }
    return findSnake(a, fromA, toA, b, fromB, toB);
}
let scanLimit = 1e9;
let timeout = 0;
let crude = false;
function findSnake(a, fromA, toA, b, fromB, toB) {
    let lenA = toA - fromA, lenB = toB - fromB;
    if (scanLimit < 1e9 && Math.min(lenA, lenB) > scanLimit * 16 ||
        timeout > 0 && Date.now() > timeout) {
        if (Math.min(lenA, lenB) > scanLimit * 64)
            return [new Change(fromA, toA, fromB, toB)];
        return crudeMatch(a, fromA, toA, b, fromB, toB);
    }
    let off = Math.ceil((lenA + lenB) / 2);
    frontier1.reset(off);
    frontier2.reset(off);
    let match1 = (x, y) => a.charCodeAt(fromA + x) == b.charCodeAt(fromB + y);
    let match2 = (x, y) => a.charCodeAt(toA - x - 1) == b.charCodeAt(toB - y - 1);
    let test1 = (lenA - lenB) % 2 != 0 ? frontier2 : null, test2 = test1 ? null : frontier1;
    for (let depth = 0; depth < off; depth++) {
        if (depth > scanLimit || timeout > 0 && !(depth & 63) && Date.now() > timeout)
            return crudeMatch(a, fromA, toA, b, fromB, toB);
        let done = frontier1.advance(depth, lenA, lenB, off, test1, false, match1) ||
            frontier2.advance(depth, lenA, lenB, off, test2, true, match2);
        if (done)
            return bisect(a, fromA, toA, fromA + done[0], b, fromB, toB, fromB + done[1]);
    }
    return [new Change(fromA, toA, fromB, toB)];
}
class Frontier {
    constructor() {
        this.vec = [];
    }
    reset(off) {
        this.len = off << 1;
        for (let i = 0; i < this.len; i++)
            this.vec[i] = -1;
        this.vec[off + 1] = 0;
        this.start = this.end = 0;
    }
    advance(depth, lenX, lenY, vOff, other, fromBack, match) {
        for (let k = -depth + this.start; k <= depth - this.end; k += 2) {
            let off = vOff + k;
            let x = k == -depth || (k != depth && this.vec[off - 1] < this.vec[off + 1])
                ? this.vec[off + 1] : this.vec[off - 1] + 1;
            let y = x - k;
            while (x < lenX && y < lenY && match(x, y)) {
                x++;
                y++;
            }
            this.vec[off] = x;
            if (x > lenX) {
                this.end += 2;
            }
            else if (y > lenY) {
                this.start += 2;
            }
            else if (other) {
                let offOther = vOff + (lenX - lenY) - k;
                if (offOther >= 0 && offOther < this.len && other.vec[offOther] != -1) {
                    if (!fromBack) {
                        let xOther = lenX - other.vec[offOther];
                        if (x >= xOther)
                            return [x, y];
                    }
                    else {
                        let xOther = other.vec[offOther];
                        if (xOther >= lenX - x)
                            return [xOther, vOff + xOther - offOther];
                    }
                }
            }
        }
        return null;
    }
}
const frontier1 = new Frontier, frontier2 = new Frontier;
function bisect(a, fromA, toA, splitA, b, fromB, toB, splitB) {
    let stop = false;
    if (!validIndex(a, splitA) && ++splitA == toA)
        stop = true;
    if (!validIndex(b, splitB) && ++splitB == toB)
        stop = true;
    if (stop)
        return [new Change(fromA, toA, fromB, toB)];
    return findDiff(a, fromA, splitA, b, fromB, splitB).concat(findDiff(a, splitA, toA, b, splitB, toB));
}
function chunkSize(lenA, lenB) {
    let size = 1, max = Math.min(lenA, lenB);
    while (size < max)
        size = size << 1;
    return size;
}
function commonPrefix(a, fromA, toA, b, fromB, toB) {
    if (fromA == toA || fromA == toB || a.charCodeAt(fromA) != b.charCodeAt(fromB))
        return 0;
    let chunk = chunkSize(toA - fromA, toB - fromB);
    for (let pA = fromA, pB = fromB;;) {
        let endA = pA + chunk, endB = pB + chunk;
        if (endA > toA || endB > toB || a.slice(pA, endA) != b.slice(pB, endB)) {
            if (chunk == 1)
                return pA - fromA - (validIndex(a, pA) ? 0 : 1);
            chunk = chunk >> 1;
        }
        else if (endA == toA || endB == toB) {
            return endA - fromA;
        }
        else {
            pA = endA;
            pB = endB;
        }
    }
}
function commonSuffix(a, fromA, toA, b, fromB, toB) {
    if (fromA == toA || fromB == toB || a.charCodeAt(toA - 1) != b.charCodeAt(toB - 1))
        return 0;
    let chunk = chunkSize(toA - fromA, toB - fromB);
    for (let pA = toA, pB = toB;;) {
        let sA = pA - chunk, sB = pB - chunk;
        if (sA < fromA || sB < fromB || a.slice(sA, pA) != b.slice(sB, pB)) {
            if (chunk == 1)
                return toA - pA - (validIndex(a, pA) ? 0 : 1);
            chunk = chunk >> 1;
        }
        else if (sA == fromA || sB == fromB) {
            return toA - sA;
        }
        else {
            pA = sA;
            pB = sB;
        }
    }
}
function findMatch(a, fromA, toA, b, fromB, toB, size, divideTo) {
    let rangeB = b.slice(fromB, toB);
    let best = null;
    for (;;) {
        if (best || size < divideTo)
            return best;
        for (let start = fromA + size;;) {
            if (!validIndex(a, start))
                start++;
            let end = start + size;
            if (!validIndex(a, end))
                end += end == start + 1 ? 1 : -1;
            if (end >= toA)
                break;
            let seed = a.slice(start, end);
            let found = -1;
            while ((found = rangeB.indexOf(seed, found + 1)) != -1) {
                let prefixAfter = commonPrefix(a, end, toA, b, fromB + found + seed.length, toB);
                let suffixBefore = commonSuffix(a, fromA, start, b, fromB, fromB + found);
                let length = seed.length + prefixAfter + suffixBefore;
                if (!best || best[2] < length)
                    best = [start - suffixBefore, fromB + found - suffixBefore, length];
            }
            start = end;
        }
        if (divideTo < 0)
            return best;
        size = size >> 1;
    }
}
function halfMatch(a, fromA, toA, b, fromB, toB) {
    let lenA = toA - fromA, lenB = toB - fromB;
    if (lenA < lenB) {
        let result = halfMatch(b, fromB, toB, a, fromA, toA);
        return result && [result[1], result[0], result[2]];
    }
    if (lenA < 4 || lenB * 2 < lenA)
        return null;
    return findMatch(a, fromA, toA, b, fromB, toB, Math.floor(lenA / 4), -1);
}
function crudeMatch(a, fromA, toA, b, fromB, toB) {
    crude = true;
    let lenA = toA - fromA, lenB = toB - fromB;
    let result;
    if (lenA < lenB) {
        let inv = findMatch(b, fromB, toB, a, fromA, toA, Math.floor(lenA / 6), 50);
        result = inv && [inv[1], inv[0], inv[2]];
    }
    else {
        result = findMatch(a, fromA, toA, b, fromB, toB, Math.floor(lenB / 6), 50);
    }
    if (!result)
        return [new Change(fromA, toA, fromB, toB)];
    let [sharedA, sharedB, sharedLen] = result;
    return findDiff(a, fromA, sharedA, b, fromB, sharedB)
        .concat(findDiff(a, sharedA + sharedLen, toA, b, sharedB + sharedLen, toB));
}
function mergeAdjacent(changes, minGap) {
    for (let i = 1; i < changes.length; i++) {
        let prev = changes[i - 1], cur = changes[i];
        if (prev.toA > cur.fromA - minGap && prev.toB > cur.fromB - minGap) {
            changes[i - 1] = new Change(prev.fromA, cur.toA, prev.fromB, cur.toB);
            changes.splice(i--, 1);
        }
    }
}
function normalize(a, b, changes) {
    for (;;) {
        mergeAdjacent(changes, 1);
        let moved = false;
        for (let i = 0; i < changes.length; i++) {
            let ch = changes[i], pre, post;
            if (pre = commonPrefix(a, ch.fromA, ch.toA, b, ch.fromB, ch.toB))
                ch = changes[i] = new Change(ch.fromA + pre, ch.toA, ch.fromB + pre, ch.toB);
            if (post = commonSuffix(a, ch.fromA, ch.toA, b, ch.fromB, ch.toB))
                ch = changes[i] = new Change(ch.fromA, ch.toA - post, ch.fromB, ch.toB - post);
            let lenA = ch.toA - ch.fromA, lenB = ch.toB - ch.fromB;
            if (lenA && lenB)
                continue;
            let beforeLen = ch.fromA - (i ? changes[i - 1].toA : 0);
            let afterLen = (i < changes.length - 1 ? changes[i + 1].fromA : a.length) - ch.toA;
            if (!beforeLen || !afterLen)
                continue;
            let text = lenA ? a.slice(ch.fromA, ch.toA) : b.slice(ch.fromB, ch.toB);
            if (beforeLen <= text.length &&
                a.slice(ch.fromA - beforeLen, ch.fromA) == text.slice(text.length - beforeLen)) {
                changes[i] = new Change(ch.fromA - beforeLen, ch.toA - beforeLen, ch.fromB - beforeLen, ch.toB - beforeLen);
                moved = true;
            }
            else if (afterLen <= text.length &&
                a.slice(ch.toA, ch.toA + afterLen) == text.slice(0, afterLen)) {
                changes[i] = new Change(ch.fromA + afterLen, ch.toA + afterLen, ch.fromB + afterLen, ch.toB + afterLen);
                moved = true;
            }
        }
        if (!moved)
            break;
    }
    return changes;
}
function makePresentable(changes, a, b) {
    for (let posA = 0, i = 0; i < changes.length; i++) {
        let change = changes[i];
        let lenA = change.toA - change.fromA, lenB = change.toB - change.fromB;
        if (lenA && lenB || lenA > 3 || lenB > 3) {
            let nextChangeA = i == changes.length - 1 ? a.length : changes[i + 1].fromA;
            let maxScanBefore = change.fromA - posA, maxScanAfter = nextChangeA - change.toA;
            let boundBefore = findWordBoundaryBefore(a, change.fromA, maxScanBefore);
            let boundAfter = findWordBoundaryAfter(a, change.toA, maxScanAfter);
            let lenBefore = change.fromA - boundBefore, lenAfter = boundAfter - change.toA;
            if ((!lenA || !lenB) && lenBefore && lenAfter) {
                let changeLen = Math.max(lenA, lenB);
                let [changeText, changeFrom, changeTo] = lenA ? [a, change.fromA, change.toA] : [b, change.fromB, change.toB];
                if (changeLen > lenBefore &&
                    a.slice(boundBefore, change.fromA) == changeText.slice(changeTo - lenBefore, changeTo)) {
                    change = changes[i] = new Change(boundBefore, boundBefore + lenA, change.fromB - lenBefore, change.toB - lenBefore);
                    boundBefore = change.fromA;
                    boundAfter = findWordBoundaryAfter(a, change.toA, nextChangeA - change.toA);
                }
                else if (changeLen > lenAfter &&
                    a.slice(change.toA, boundAfter) == changeText.slice(changeFrom, changeFrom + lenAfter)) {
                    change = changes[i] = new Change(boundAfter - lenA, boundAfter, change.fromB + lenAfter, change.toB + lenAfter);
                    boundAfter = change.toA;
                    boundBefore = findWordBoundaryBefore(a, change.fromA, change.fromA - posA);
                }
                lenBefore = change.fromA - boundBefore;
                lenAfter = boundAfter - change.toA;
            }
            if (lenBefore || lenAfter) {
                change = changes[i] = new Change(change.fromA - lenBefore, change.toA + lenAfter, change.fromB - lenBefore, change.toB + lenAfter);
            }
            else if (!lenA) {
                let first = findLineBreakAfter(b, change.fromB, change.toB), len;
                let last = first < 0 ? -1 : findLineBreakBefore(b, change.toB, change.fromB);
                if (first > -1 && (len = first - change.fromB) <= maxScanAfter &&
                    b.slice(change.fromB, first) == b.slice(change.toB, change.toB + len))
                    change = changes[i] = change.offset(len);
                else if (last > -1 && (len = change.toB - last) <= maxScanBefore &&
                    b.slice(change.fromB - len, change.fromB) == b.slice(last, change.toB))
                    change = changes[i] = change.offset(-len);
            }
            else if (!lenB) {
                let first = findLineBreakAfter(a, change.fromA, change.toA), len;
                let last = first < 0 ? -1 : findLineBreakBefore(a, change.toA, change.fromA);
                if (first > -1 && (len = first - change.fromA) <= maxScanAfter &&
                    a.slice(change.fromA, first) == a.slice(change.toA, change.toA + len))
                    change = changes[i] = change.offset(len);
                else if (last > -1 && (len = change.toA - last) <= maxScanBefore &&
                    a.slice(change.fromA - len, change.fromA) == a.slice(last, change.toA))
                    change = changes[i] = change.offset(-len);
            }
        }
        posA = change.toA;
    }
    mergeAdjacent(changes, 3);
    return changes;
}
let wordChar;
try {
    wordChar = new RegExp("[\\p{Alphabetic}\\p{Number}]", "u");
}
catch (_) { }
function asciiWordChar(code) {
    return code > 48 && code < 58 || code > 64 && code < 91 || code > 96 && code < 123;
}
function wordCharAfter(s, pos) {
    if (pos == s.length)
        return 0;
    let next = s.charCodeAt(pos);
    if (next < 192)
        return asciiWordChar(next) ? 1 : 0;
    if (!wordChar)
        return 0;
    if (!isSurrogate1(next) || pos == s.length - 1)
        return wordChar.test(String.fromCharCode(next)) ? 1 : 0;
    return wordChar.test(s.slice(pos, pos + 2)) ? 2 : 0;
}
function wordCharBefore(s, pos) {
    if (!pos)
        return 0;
    let prev = s.charCodeAt(pos - 1);
    if (prev < 192)
        return asciiWordChar(prev) ? 1 : 0;
    if (!wordChar)
        return 0;
    if (!isSurrogate2(prev) || pos == 1)
        return wordChar.test(String.fromCharCode(prev)) ? 1 : 0;
    return wordChar.test(s.slice(pos - 2, pos)) ? 2 : 0;
}
const MAX_SCAN = 8;
function findWordBoundaryAfter(s, pos, max) {
    if (pos == s.length || !wordCharBefore(s, pos))
        return pos;
    for (let cur = pos, end = pos + max, i = 0; i < MAX_SCAN; i++) {
        let size = wordCharAfter(s, cur);
        if (!size || cur + size > end)
            return cur;
        cur += size;
    }
    return pos;
}
function findWordBoundaryBefore(s, pos, max) {
    if (!pos || !wordCharAfter(s, pos))
        return pos;
    for (let cur = pos, end = pos - max, i = 0; i < MAX_SCAN; i++) {
        let size = wordCharBefore(s, cur);
        if (!size || cur - size < end)
            return cur;
        cur -= size;
    }
    return pos;
}
function findLineBreakBefore(s, pos, stop) {
    for (; pos != stop; pos--)
        if (s.charCodeAt(pos - 1) == 10)
            return pos;
    return -1;
}
function findLineBreakAfter(s, pos, stop) {
    for (; pos != stop; pos++)
        if (s.charCodeAt(pos) == 10)
            return pos;
    return -1;
}
const isSurrogate1 = (code) => code >= 0xD800 && code <= 0xDBFF;
const isSurrogate2 = (code) => code >= 0xDC00 && code <= 0xDFFF;
function validIndex(s, index) {
    return !index || index == s.length || !isSurrogate1(s.charCodeAt(index - 1)) || !isSurrogate2(s.charCodeAt(index));
}
function diff(a, b, config) {
    var _a;
    scanLimit = ((_a = config === null || config === void 0 ? void 0 : config.scanLimit) !== null && _a !== void 0 ? _a : 1e9) >> 1;
    timeout = (config === null || config === void 0 ? void 0 : config.timeout) ? Date.now() + config.timeout : 0;
    crude = false;
    return normalize(a, b, findDiff(a, 0, a.length, b, 0, b.length));
}
exports.diff = diff;
function diffIsPrecise() { return !crude; }
exports.diffIsPrecise = diffIsPrecise;
function presentableDiff(a, b, config) {
    return makePresentable(diff(a, b, config), a, b);
}
exports.presentableDiff = presentableDiff;
