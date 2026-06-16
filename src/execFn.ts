import { isAsyncFunction, isFunction, isGeneratorFunction } from '@vvi/is';

import { DevContextHookFn, DevTool } from './types';
/**
 * # 执行函数
 * 现在以列队的方式执行，不考虑是否异步
 */
export async function execFn(this: DevTool, fnArr: DevContextHookFn[]) {
  for (const fn of fnArr) {
    try {
      if (!fn) continue;
      if (isAsyncFunction(fn)) {
        await Reflect.apply(fn, this, [this]);
      } else if (isFunction(fn) || isGeneratorFunction(fn)) {
        Reflect.apply(fn, this, [this]);
      }
    } catch (error) {
      console.error('Hook执行出错:', error);
    }
  }
}
