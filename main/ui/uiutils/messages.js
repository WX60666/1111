/**
 * Created by rico on 16/5/13.
 */

import Toast from './toast';

function tips(tip) {
    var box = new msgBox({ title: '温馨提示', cntBody:tip, btnLabel:['确定'], firstCallback: function () {
        box.closeMsg();
    }  });
}

function confirmTip(tip, cb) {
    var msg = new msgBox({
        title: '温馨提示',
        cntBody: tip,
        isClose: false,
        btnLabel: ['确认','取消'],
        firstCallback: function(){
            msg.closeMsg();
            cb();
        },
        secondCallback: function(){
            msg.closeMsg();
        }
    });
}

class Message {

    constructor(opt_) {
        this.opt = opt_;
        this.dom = null;
    }

    toast(opt) {
        let t = new Toast(opt);
        t.auto();
        // tips(opt);
    }

    show() {

        let style = (opt.level == 'warn'
            ? ''
            : '');

        this.dom = $(
            `<div class="toast" style="${style}">` +
            `<p class="id_title">${this.opt.title}</p>` +
            `<p class="id_msg">${this.opt.msg}</p>` +
            `</div>`);

        window.document.body.appendChild(this.dom);
    }

    hide() {
        window.document.body.removeChild(this.dom);
        this.dom = null;
    }

    auto() {
        show();
        setTimeout(this.hide, this.opt.duration);
    }
}

export default Message;