import { isAsyncFunction, isEmptyArray } from '@vvi/is';
import { DevCallBack, ExecutionStack, RunOptions } from './types';

/**
 * # 执行下一项
 */
export async function runNext({
  executionStack,
  runOptions,
  fn,
}: {
  executionStack: ExecutionStack;
  runOptions: RunOptions;
  fn: <T extends void = void>(
    message: string,
    suite: DevCallBack<T>,
  ) => Promise<void>;
}) {
  if (!isEmptyArray(executionStack)) {
    /// 下面的代码包含异步不可被封装
    /**  当前执行的栈  */
    const currentExecution = executionStack[0];
    runOptions.skip = currentExecution.skip;
    if (isAsyncFunction(currentExecution.callback)) {
      await fn(currentExecution.message, currentExecution.callback);
    } else {
      fn(currentExecution.message, currentExecution.callback);
    }
  }
}
