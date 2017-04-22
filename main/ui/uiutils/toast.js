/**
 * Created by rico on 16/5/17.
 */

import _ from '../../base/utils/objects';
import { LogWithTag } from '../../base/utils/log';
import rsc from '../../base/i18n/resource';

const log = new LogWithTag();

let toastList = null;
let toastCount = 0;

class Toast {

    constructor(opt_) {
        this.opt = opt_;
        this.dom = null;
    }

    static toast(opt, arg2) {

        opt = _.getRegular(opt, {});

        if (_.isString(opt)) {
            opt = {
                level: 'normal',
                msg: opt,
                title: arg2 || rsc.localStr('温馨提示')
            }
        }

        log.d('Toast', 'Toasting opt: ', opt);

        let t = new Toast(opt);
        t.auto();
    }

    show() {

        let color = (this.opt.level == 'warn'
            ? '#E12'
            : '#FFF');

        this.dom = window.document.createElement('div');
        this.dom.innerHTML =
            `<div class="toast" style="width: 60%; margin: 0.2em auto; padding: 0.5em 1em; border-radius: 0.5em; background: rgba(0,0,0,0.618);">` +
            `<p class="id_title" style="text-align: center; font-size: 1.1em; margin: 0.2em auto; color: ${color};">${this.opt.title}</p>` +
            `<hr style="color: rgba(255,255,255,0.1);"/>` +
            `<p class="id_msg" style="font-size: 0.9em; margin: 0.2em auto; color: ${color};">${this.opt.msg}</p>` +
            `</div>`
        ;

        // log.d('Toast', 'Appending dom: ', this.dom);
        if (++toastCount == 1) {
            toastList = window.document.createElement('ul');
            window.document.body.appendChild(toastList);
            toastList.style.position = 'fixed';
            toastList.style.bottom = '1em';
            toastList.style.width = '90%';
            toastList.style.alignContent = 'center';
            toastList.style.maxHeight = '70%';
        }

        toastList.appendChild(this.dom);
        // if (toastCount == 1) toastList.appendChild(this.dom);
        // else toastList.insertBefore(this.dom, toastList.childNodes[0]);
    }

    hide() {
        // window.document.body.removeChild(this.dom);
        // log.d('Toast', 'Appending dom: ', this.dom);
        this.dom.parentNode.removeChild(this.dom);
        this.dom = null;
        if (--toastCount <= 0) {
            toastList.parentNode.removeChild(toastList);
            toastList = null;
        }
    }

    auto() {
        this.show();
        setTimeout(this.hide.bind(this), this.opt.duration || 3000);
    }
}

export default Toast;