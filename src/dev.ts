import { dog } from './dog';
import { createConstructor, getRandomInt } from '@vvi/utils';
import {
  DevCallBack,
  DevTool,
  InitDevOption,
  OriginDevTool,
  RunOptions,
} from './types';
import {
  isAsyncFunction,
  isFalse,
  isFunction,
  isGeneratorFunction,
  isType,
  isUndefined,
} from '@vvi/is';
import { bluePen, brightRedPen, hexPen, magentaPen, yellowPen } from '@vvi/pen';

import { runningFalse } from './runningFalse';
import { runNext } from './runNext';
import { createDevParamList } from './devParamList';
import { createPrintf } from './createPrintf';
import { execFn } from './execFn';

/**
 *
 * 在真实使用中，无论有没有使用 it ， 回调函数的 level 都是 1，message 是下一级的而不是上一级的
 *
 */
/**
 * # 创建 dev 的工厂函数
 */
function Dev(this: OriginDevTool, options: InitDevOption): OriginDevTool {
  /**  执行的环境  */
  const _runOption: RunOptions = {
    skip: options?.skip ?? false,
    name: options.name,
    description: [...(options.description || [''])],
    level: options.level,
    hooks: {
      before: [],
      after: [],
    },
  };
  /**  当前层级的随机色（除了 _lever 为 0 时都继承于父级）  */
  const _randomColor = [...options.randomColor];
  /**  执行栈  */
  const _executionStack = options.executionStack;
  /**  当前的执行状态，仅当上一步骤执行完毕时才允许下一步骤开始执行  */
  const runList: {
    /**  唯一 id  */
    id: symbol;
    /**  状态  */
    running: boolean;
    /**  执行描述  */
    description: string;
  }[] = [];

  dog('当前执参数称为：', _runOption);

  dog('当前执行的色值列表为：', [..._randomColor]);

  /** 函数对象的主体  */
  const _dev = async <T extends void = void>(
    message: string,
    suite: DevCallBack<T>,
  ) => {
    /**  当前（要）执行的块  */
    const lastExecution = _executionStack[0];

    // 如果没有当前正在执行
    if (isUndefined(lastExecution)) {
      _executionStack.push({ message, callback: suite, skip: _runOption.skip });
    } else {
      /**  当前（要）执行的块不是我  */
      const isNotMe =
        lastExecution.message !== message && lastExecution.callback !== suite;

      // 执行的非自身则显示将自身推入执行栈
      if (isNotMe) {
        _executionStack.push({
          message,
          callback: suite,
          skip: _runOption.skip,
        });
        return;
      }
    }
    const id = Symbol(message);
    const lastRun = runList[runList.length - 1];
    const currentRun = {
      id,
      running: true,
      description: message,
    };
    {
      /**  当前执行的色值设置  */
      const currentColor = getRandomInt(1, 222);

      /**  色值  */
      if (_runOption.level === _randomColor.length) {
        _randomColor.push(currentColor);
      } else {
        _randomColor.splice(_runOption.level, 1, currentColor);
      }
    }

    /**  兼容打印  */
    const printf = createPrintf(_randomColor);

    dog('上一步执行', { ...lastRun });
    dog('当前执行', { ...currentRun });
    dog('父级给出的执行状态', { ...options.running });
    if (isFalse(options.running.running)) {
      runningFalse({
        description: options.running.description,
        lastDescription: lastRun.description,
        message: message,
        printf,
      });
    }

    if (lastRun && lastRun.running) {
      const awaitRun = brightRedPen(lastRun.description);
      printf(
        `当前 ${bluePen(message)} 期待上一个步骤执行完毕 ${awaitRun}（可添加 await 等待 ${awaitRun}）`,
      );
      printf('\n\n\n\n\n看上面 👆\n\n\n\n\n');
    }

    runList.push(currentRun);

    /**  跳过执行  */
    if (_runOption.skip) {
      printf(`${yellowPen`跳过执行`} ${message}`);
      currentRun.running = false;
      _executionStack.shift(); // 弹出栈首
      runNext({
        executionStack: _executionStack,
        runOptions: _runOption,
        fn: _dev,
      });
      return;
    }

    /**
     *  # 创建的子参数列表
     *  <span style="color:#ff0;">其实在使用的时候 </span>
     */
    const childOption: InitDevOption = {
      skip: false,
      before: [],
      after: [],
      level: _runOption.level + 1,
      randomColor: [..._randomColor],
      running: currentRun,
      executionStack: [],
      ...(_runOption.level === 0
        ? {
            name: message,
            description: [],
          }
        : {
            name: _runOption.name,
            description: [..._runOption.description, message],
          }),
    };
    printf(hexPen('#166')`执行 ${message}`);

    const newThis = new DevConstructor(childOption) as unknown as DevTool;
    // TODO <#FF0>
    // 这里的 this 和  newThis 搞不清楚。。 需要再看
    /// 执行自身的 forEach
    await Reflect.apply(execFn, newThis, [_runOption.hooks.before]);
    // 执行由子测试的 beforeEach 绑定的 hook
    /// 执行顺序的特殊性导致执行钩子函数禁止🈲被封装
    await Reflect.apply(execFn, this, [childOption.before]);

    // 执行测试主体
    try {
      if (isType<Promise<T>>(suite, isAsyncFunction(suite))) {
        await suite(newThis);
      } else if (isFunction(suite) || isGeneratorFunction(suite)) {
        suite(newThis);
      }
    } catch (error) {
      dog.error(error);
      printf(magentaPen(`执行本体方法出现异常 \n ${error}`));
    }

    /// 执行顺序的特殊性导致执行钩子函数禁止🈲被封装
    await Reflect.apply(execFn, this, [childOption.after.reverse()]);
    /// 执行顺序的特殊性导致执行钩子函数禁止🈲被封装
    await Reflect.apply(execFn, newThis, [_runOption.hooks.after.reverse()]);
    _executionStack.shift(); // 弹出当前执行
    currentRun.running = false;
    runNext({
      executionStack: _executionStack,
      runOptions: _runOption,
      fn: _dev,
    });
  };

  Object.setPrototypeOf(_dev, this);
  ///  通过  defineProperties 给函数对象设置属性
  Object.defineProperties(
    _dev,
    createDevParamList({
      runOptions: _runOption,
      options: options,
      DevConstructor,
    }),
  );

  return _dev as unknown as DevTool;
}

/**  装配 dev  */
const DevConstructor = createConstructor(Dev);

export { DevConstructor, DevConstructor as Dev };
