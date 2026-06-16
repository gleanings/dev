# @vvi/dev

[![version](<https://img.shields.io/npm/v/@vvi/dev.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/@vvi/dev) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/MrMudBean/dev/issues)

## 安装

```bash
npm install --save-dev @vvi/dev
```

## 使用

在单元测试的时候使用 `jest` ，在功能测试时使用 `node:test` 和 `node:assert`。但是测试的时候，总是有打印的消息被 `node:test` 的结果覆盖。所以，写了一个简介的 dev ，用于功能测试。

类似于 `node:test`，使用如下：

```ts
import { dev } from '@vvi/dev';

const log = console.log;

dev.beforeEach(() => {
  console.log('你们执行前需要先执行我');
});

dev.afterEach(() => {
  console.log('你们执行完后会执行我');
});

// 简单使用
dev('测试 1', () => {
  log(1);
});

// 我其实就是想能够跳过测试而不是每一次 ((skip)=>{ if(skip) return; ....})(false)
dev.skip('跳过的测试', () => {
  log('我并不会被打印出来');
});

// 子测试，每一个测试是独立的，类似于 jest，单独的测试模块出现 Error 将阻止剩余逻辑执行
dev('包含子项的测试', it => {
  it.before(() => {
    console.log('我是大哥，我先执行，且仅执行一次');
  });
  it.before(() => {
    console.log('我是二哥，我执行次于大哥，且仅执行一次');
  });

  it.after(() => {
    console.log('我是小弟，你们执行完再执行我就行，仅执行一次');
  });

  it.beforeEach(() => {
    console.log('我是三哥，我执行次于二哥，每次子项执行我都执行一次');
  });

  it.beforeEach(() => {
    console.log('我是二弟，我执行早于小弟，每次子项执行我都执行一次');
  });

  it('子项 1️⃣', () => {
    log('我要出错');
    throw new Error('我粗错了');
    log('完啦，我打印不出来了');
  });

  it('子项 2️⃣', () => {
    log('没想到吧，我还活着');
  });
});

// 可以异步执行
await dev('测试异步的代码', async it => {
  it('测试异代码 2️⃣ ', async () => {
    log('异步代码 2️⃣ 外部');
    return new Promise(resolve => {
      log('异步代码 2️⃣ 内部');
      setTimeout(() => {
        log('异步代码 2️⃣');
        resolve('异步代码 2️⃣');
      }, 500);
    });
  });

  await it<string>('测试异代码 1️⃣ ', async () => {
    log('异步代码 1️⃣ 外部');
    return new Promise(resolve => {
      log('异步代码 1️⃣ 内部');
      setTimeout(() => {
        log('异步代码 1️⃣');

        resolve('异步代码 1️⃣');
      }, 1000);
    });
  });
});
```

在使用异步的测试时，总是期待能够使用 `await` ，否者可能将收到 `TypeError`。

## 状态

此软件包是 `@mudbean` 生态系统的一部分。
它使用严格的 TypeScript 编写，并通过 Rollup 构建进行验证。
虽然单元测试较少，但 API 稳定，并在生产环境中大量使用。
