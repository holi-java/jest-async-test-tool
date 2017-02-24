# jest-async-test-tool

## Introduction
> a tool for async test within setTimeout/setInterval without try-catch to fail the blocked test.

when you use jest to test async test must be embedded try-catch block like this:

```js
test('async test',(done)=>{
    setTimeout(()=>{
       try{
           expect(foo).toBe(bar);
           done();
       }catch(e){
           done.fail(e);
       }
    });
});
```
but we want test async test within setTimeout/setInterval like that,and this lib will do it:

```js
test('async test',(done)=>{
    setTimeout(()=>{
       expect(foo).toBe(bar);
       done();
    });
});
```

## Usage

two ways allow you use this tool.you can import 'jest-async-test-tool' in all your async test files.
```js
import 'jest-async-test-tool';
```

or you can use jest `setupTestFrameworkScriptFile` option in package.json,then all test will includes this tool.
```json
{
    "jest": {
    "setupTestFrameworkScriptFile": "jest-async-test-tool"
    }
}
```


