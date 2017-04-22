/**
 * Created by test on 2017/4/18.
 */
class ClassHelper {
    constructor(){

    }
    hasClass(elem, cls:string):boolean {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length === 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    }

    addClass(elem, cls:string) {
        if (!this.hasClass(elem, cls)) {
            elem.className = elem.className === '' ? cls : elem.className + ' ' + cls;
        }
    }

    removeClass(elem, cls:string) {
        if (this.hasClass(elem, cls)) {
            let newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
            while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                newClass = newClass.replace(' ' + cls + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }

}

export default new ClassHelper();