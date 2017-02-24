import {wrapTest} from '../src/jest-async-test-tool';


const it = wrapTest((name, testCase) => {
    if (!testCase.length)
        return testCase();

    return new Promise((resolve) => {
        let done = Object.assign(() => resolve(), {fail: resolve});
        try {
            testCase(done);
        } catch (e) {
            done.fail(e);
        }
    });
});


test('success sync test', () => {
    let executed = false;

    it('test', () => {
        executed = true;
    });

    expect(executed).toBe(true);
});

test('failed sync test', () => {
    expect(() => {
        it('test', () => {
            throw 'failed';
        });
    }).toThrow('failed');
});


test('success async test', (done) => {
    it('test', (done) => {
        done();
    }).then((error) => {
        expect(error).toBeUndefined();
        done();
    });
});


test('failed async test', (done) => {
    it('test', (done) => {
        throw 'failed';
    }).then((error) => {
        expect(error).toEqual('failed');
        done();
    }).catch(done.fail);
});


test('failed async test in setTimeout', (done) => {
    it('test', (done) => {
        setTimeout(() => {
            throw 'failed';
        });
    }).then((error) => {
        expect(error).toEqual('failed');
        done();
    }).catch(done.fail);
});

test('failed async test in nested setTimeout', (done) => {
    it('test', (done) => {
        setTimeout(() => {
            setTimeout(() => {
                throw 'failed';
            });
        });
    }).then((error) => {
        expect(error).toEqual('failed');
        done();
    }).catch(done.fail);
});


test('failed async test in nested setInterval', (done) => {
    it('test', (done) => {
        setInterval(() => {
            setInterval(() => {
                throw 'failed';
            });
        });
    }).then((error) => {
        expect(error).toEqual('failed');
        done();
    }).catch(done.fail);
});
