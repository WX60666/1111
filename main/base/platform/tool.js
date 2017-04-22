/**
 * Created by test on 2017/4/19.
 */

class FullScreen {
    constructor(){

    }

    fullScreen(el) {
        let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
            wscript;

        if(typeof rfs !== "undefined" && rfs) {
            rfs.call(el);
            return;
        }

        if(typeof window.ActiveXObject !== "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if(wscript) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    exitFullScreen() {
        let el= document,
            cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
            wscript;

        if (typeof cfs !== "undefined" && cfs) {
            cfs.call(el);
            return;
        }

        if (typeof window.ActiveXObject !== "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    getLastUrlItem(str: string) : string {
        let index = str.lastIndexOf("\/");
        str = str.substring(index + 1, str.length);
        if (str) return str;
    }

}
export default new FullScreen();
