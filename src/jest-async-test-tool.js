const top = global || window;
const [_setTimeout, _setInterval]=[top.setTimeout, top.setInterval];
function runAsyncTestSafely(currentTest) {
    return (done) => {
        let queue = new Set();
        let proxy = (delegate) => {
            return (statement, ...args) => {
                let tid = Symbol();
                queue.add(tid);
                return delegate.call(this, () => {
                    try {
                        statement();
                        queue.delete(tid);
                    } catch (e) {
                        queue.clear();
                        done.fail(e);
                    }
                }, ... args);
            }
        };
        top.setTimeout = proxy(_setTimeout);
        top.setInterval = proxy(_setInterval);
        try {
            currentTest(done);
        } finally {
            let timerId = _setInterval(() => {
                if (!queue.size) {
                    clearInterval(timerId);
                    global.setTimeout = _setTimeout;
                    global.setTimeout = _setInterval;
                }
            });
        }
    };
}

function wrapTest(nativeTest) {
    return function (name, currentTest) {
        if (!currentTest.length) return nativeTest(name, currentTest);
        return nativeTest(name, runAsyncTestSafely(currentTest));
    };
}


(module.exports = top.it = top.test = wrapTest(top.test)).wrapTest = wrapTest;
