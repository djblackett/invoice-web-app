"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useWindowWidth() {
    var _a = (0, react_1.useState)(window.innerWidth), width = _a[0], setWidth = _a[1];
    (0, react_1.useEffect)(function () {
        var handleResize = function () { return setWidth(window.innerWidth); };
        window.addEventListener("resize", handleResize);
        return function () { return window.addEventListener("resize", handleResize); };
    });
    return width;
}
exports.default = useWindowWidth;
