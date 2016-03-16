var BrowserifyBundleMock = function () {
    this.pipeline = {on: stub()};
    this.transform = stub().returns(this);
    this.bundle = stub().returns(this);
    this.on = stub().returns(this);
    this.pipe = stub().returns(this);
};

BrowserifyBundleMock.prototype.reset = function () {
    this.pipeline = {on: stub()};
    this.transform = stub().returns(this);
    this.bundle = stub().returns(this);
    this.on = stub().returns(this);
    this.pipe = stub().returns(this);
};

module.exports = BrowserifyBundleMock;