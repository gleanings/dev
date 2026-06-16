import { Dev } from './dev';
import { DevContextHookFn, InitDevOption, RunOptions } from './types';
/**
 * # 构建一个属性列表
 */
export function createDevParamList({
  runOptions,
  options,
  DevConstructor,
}: {
  runOptions: RunOptions;
  options: InitDevOption;
  DevConstructor: typeof Dev;
}) {
  const list = [
    // 注册跳过的项，该项作为子项却与父级使用同一执行体。因为执行时跳过
    // before 、after 值不重要（实际会使用父级的）,为了防止空执行，使用同一指向
    [
      'skip',
      () =>
        new DevConstructor({
          /**  为了方便之后的扩展，使用参数进行处理数据  */
          before: options.before,
          after: options.after,
          level: runOptions.level,
          randomColor: options.randomColor,
          skip: true,
          name: runOptions.name,
          description: [...runOptions.description],
          running: options.running,
          // 虽然是跳过的条目测试，其执行栈需要与原栈保持一致，防止因为是跳过的而插入到异步栈执行过程中执行
          executionStack: options.executionStack,
        }),
    ],
    ///  添加执行的 name（顶级名称）
    ['name', () => runOptions.name],
    /// 添加执行前的每一次执行
    [
      'beforeEach',
      () => (fn?: DevContextHookFn) => runOptions.hooks.before.push(fn),
    ],
    /// 添加执行后的每一次执行
    [
      'afterEach',
      () => (fn?: DevContextHookFn) => runOptions.hooks.after.push(fn),
    ],
  ];

  if (runOptions.level > 0) {
    list.push(
      ...[
        ['before', () => (fn?: DevContextHookFn) => options.before.push(fn)],
        ['after', () => (fn?: DevContextHookFn) => options.after.push(fn)],
        [
          'description',
          () => runOptions.description[runOptions.description.length - 1],
        ],
      ],
    );
  }

  /**  属性列表组  */
  return Object.fromEntries(list.map(e => [e[0], { get: e[1] }]));
}
