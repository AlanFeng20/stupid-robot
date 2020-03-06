/*
 *   Copyright (c) 2020 Alan Feng
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */


function* rangen() {
    let i = 0;
    while (true) {
        i = Math.random() * 8 + 10;
        yield i
    }
}
function robot() {
    let last = null
    let cont = 0

    let all = 0
    let hasrelax = 0
    let max = rangen().next().value
    function likehuman(ask) {
        function checkRepeat() {
            if (ask == last) { cont++ }
            else { cont = 1; last = ask }
            const r = cont > 2 ? [
                "别闹了，我知道了", "...不要当复读机好吗", "不理你了"
            ] : null;
            return r
        }
        function relax() {
            all++;
            let r = null
            if (all < max) return null;
            switch (hasrelax) {
                case 0: r = ["好累啊，我休息一会儿", "原谅我要走开一下"]; hasrelax++; break;
                case 1:
                case 2: r = ["休息ing"]; hasrelax++; break;
                case 3: all = 0; hasrelax = 0; max = rangen.next().value; break;
            }
            return r;
        }
        const c = checkRepeat()
        return c ? c : relax()
    }
    return function answer(ask) {
        const repeatArr = likehuman(ask)
        const arr = repeatArr ? repeatArr : answerAnasys(ask)
        return arr[Math.floor(Math.random() * arr.length)]
    }
}
function rulesSet(ask) {
    const rules = new Map()
    rules.set(/.*是什么/, ["有点难欸，让我想想。。", `让我帮你找找  ${search(ask)}`, "嘿嘿嘿，不告诉你"])
    rules.set(/\s*你.*/, ["我？", `我知道你对我很感兴趣，但是我要做一个高冷的人`, "你觉得呢"])
    rules.set(["为什么", "为何", "?"], ["小朋友，你是否有很多问号，虽然我也不知道怎么回答", "嗯...这是个好问题（逃"])
    rules.set(["如果", "假如", "假设"], ["没那么多如果啦，安心吧", "我也曾想过，假如我是一只猫会怎么样"])
    rules.set(["窝囊废", "垃圾", "什么玩意", "SB", "脑残", "nmsl", "NMSL", "智障", "白痴", "傻逼", "傻叉"], ["???", "先平静下", `${ask}`, "你这真是..."])
    rules.set(["难过", "伤心", "悲伤", "郁闷", "失落", "sad", "烦躁", "忧伤", "哀伤", "难受"], ["加油宝贝", "摸摸头", "抱抱"])
    rules.set(/\s*我觉得|我感觉|我认为.*/, ["嗯..我也有同感", "我认为你说的很对", "好像是这样的"])
    return rules
}
function search(d) {
    return `<a href="https://www.baidu.com/s?ie=UTF-8&wd=${d}">点击查看搜索</a>`
}

function run(key = [], ask = '') {
    switch (Object.prototype.toString.call(key)) {
        case '[object Array]':
            return key.some(e => ask.includes(e))
        case '[object RegExp]':
            return ask.match(key)
    }
    return -1
}
function answerAnasys(ask) {
    let arr = ["我也不知道欸。。", "这就触及到我的知识盲点了", "继续", "go on", `没理解到欸，不过我可以帮你搜搜${search(ask)}`]
    const iter = rulesSet(ask).entries()
    let i = iter.next()
    while (!i.done) {
        if (run(i.value[0], ask)) {
            arr = i.value[1];
            break;
        }
        i = iter.next()

    }
    return arr
}


function _main() {
    const getAnswer = robot()
    const p = manager()
    p.r_say("你好，我是stupid robot,来和我交流吧，虽然我可能听不懂你的话")
    const btn = document.querySelector("#send")
    const text = document.querySelector("#text")
    const send = () => {
        const v = text.value
        p.m_say(v);
        text.value = ''
        p.r_say(getAnswer(v))
        p.sroll()
    }
    btn.addEventListener('click', send)
    window.onkeydown = e => {
        if (e && e.keyCode === 13) {
            send()
        }
    }

}

function manager() {
    const con = document.querySelector("#root")
    const add = (e) => con.innerHTML += e
    const template = (classN, msg) => `<div class='${classN}'>${msg}</div>`
    return {
        m_say(msg) {
            add(template("m", msg))
        },
        r_say(msg) {
            add(template("r", msg))
        },
        sroll() {
            con.scrollTop = con.scrollHeight;
        }
    }
}
_main()
