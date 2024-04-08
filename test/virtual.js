var Virtual = /** @class */ (function () {
    function Virtual(data, container, renderFn) {
        this.data = [];
        this.container = null;
        this.renderFn = null;
        this.top = 0; // 顶部
        this.bottom = 0; // 底部
        this.data = data;
        this.container = container;
        this.container.addEventListener('scroll', this._onScroll);
        this.renderFn = renderFn;
    }
    Virtual.prototype._onScroll = function (e) {
    };
    Virtual.prototype._render = function () {
        var _a;
        (_a = this.renderFn) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    return Virtual;
}());
