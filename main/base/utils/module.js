/**
 * Created by rico on 16/5/12.
 */

window.export = (moduleName, builder) => {

    if (moduleName === undefined || moduleName === null) {
        console.error('Cannot export module: ', moduleName, ', builder:', builder);
        throw `Cannot export module: ${moduleName}, builder: ${{builder}}.`;
    }

    if (!window.wsModules) {
        window.wsModules = { };
    }

    if (builder && (typeof builder) == 'Function') {
        var exp = {};
        builder(exp);
        window.wsModules[moduleName] = builder;
    } else {
        window.wsModules[moduleName] = builder;
    }
};

window.import = (moduleName) => {
    if (moduleName === undefined || moduleName === null) {
        console.error('Cannot import module: ', moduleName);
        throw `Cannot import module: ${moduleName}.`;
    }

    if (window.wsModules === undefined || window.wsModules === null) {
        throw `Cannot import module: ${moduleName}, not exist.`;
    }

    return window.wsModules[moduleName];
};
