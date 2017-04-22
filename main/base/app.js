/**
 * Created by rico on 16/5/23.
 */

import { FastUser } from './modules/user/user';
import { FastObjectStorage } from './storage/storage';

export default function App() {

    const modules = {};

    const storage = new FastObjectStorage('com.we-smart');
    this.addModule = (moduleID, moduleClass, moduleOpt) => {
        // let storeKey = 'com.we-smart.' + moduleID;
        let storeKey = moduleID;

        let m = new moduleClass(moduleOpt || storage.restore(storeKey));
        m.listeners.add({
            configChanged: () => { storage.save(m.toSave()) }
        });

        modules[moduleID] = m;
    };

    this.getModule = (moduleID) => { return modules[moduleID]; };
    this.containsModule = (moduleID) => { return moduleID in modules; }

    // build some basic modules;

    this.addModule('user', FastUser);
    // this.addModule('rsc');
}