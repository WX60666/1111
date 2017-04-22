/**
 * Created by test on 2017/4/20.
 */

class CountDown {
    constructor() {

    }
    init(btn) {
        this.oBtn = document.getElementsByClassName(btn)[0];
        this.getVcode();

    }
    getVcode() {
        this.oBtn.disabled = true;
        this.oBtn.style.cursor = 'wait';
        this.update_p(0, 60);
    }
    update_p(num, t) {
        let This = this;
        this.oBtn.disabled = true;
        if(num === t) {
            this.oBtn.value = "获取验证码";
            this.oBtn.disabled = false;
            this.oBtn.style.cursor = 'pointer';
        } else {
            let printnr = t - num;
            num++;
            this.oBtn.value =  printnr + "秒后重新发送";
            setTimeout(function() {
                This.update_p(num, t);
            }, 1000);
        }
    }

}

export default CountDown;