export type DevCallBack<T = void> = (it: DevTool) => T | Promise<T>;

/**
 * # 根测试
 */
export interface OriginDevTool {
  /**  本体方法  */
  <T = void>(message: string, callBack: DevCallBack<T>): T | Promise<T>;

  <T = void>(message: string, callback: () => T | Promise<T>): T | Promise<T>;
  // /**  跳过执行  */
  skip: DevTool;
  /**  每一步执行前  */
  beforeEach: (fn?: DevContextHookFn) => void;
  /**  每一步执行后  */
  afterEach: (fn?: DevContextHookFn) => void;
  /**  主测试的根名称  */
  name: string;
  /**  不打印消息  */
}

/**
 * # 衍生测试
 */
export type DevTool = {
  /**  本体方法  */
  <T = void>(
    message: string,
    callBack: (it: DevTool) => T | Promise<T>,
  ): T | Promise<T>;

  <T = void>(message: string, callback: () => T | Promise<T>): T | Promise<T>;
  // /**  跳过执行  */
  skip: DevTool;
  /**  执行前  */
  before: (fn?: DevContextHookFn) => void;
  /**  每一步执行前  */
  beforeEach: (fn?: DevContextHookFn) => void;
  /**  执行后  */
  after: (fn?: DevContextHookFn) => void;
  /**  每一步执行后  */
  afterEach: (fn?: DevContextHookFn) => void;
  /**  根测试的名称  */
  name: string;
  /**  测试链  */
  description: string[];
};

/**
 * # 声明周期回调
 */
export type DevContextHookFn = (it: DevTool) => void;

export type DevContentHookOptions<T> = T[];

export type InitDevOption = {
  /**  当前执行的层级  */
  level: number;
  /**  随机色  */
  randomColor: number[];
  /**  是否跳过  */
  skip: boolean;
  /**  执行前  */
  before: (DevContextHookFn | undefined)[];
  /**  执行后  */
  after: (DevContextHookFn | undefined)[];
  /**  根测试的名称  */
  name: string;
  /**  测试链  */
  description?: string[];
  /**  父级测试执行状态  */
  running: {
    id: symbol;
    running: boolean;
    description: string;
  };
  /**  子调用的执行列表，让调用按顺序执行，而不是返回一个 typeError  */
  executionStack: ExecutionStack;
};

export type ExecutionStack = {
  /**  执行的消息  */
  message: string;
  /**  执行的函数  */
  callback: DevCallBack;
  /**  是否跳过执行  */
  skip: boolean;
}[];

export type RunOptions = {
  /**  跳过执行  */
  skip: boolean;
  /**  当前执行的顶名  */
  name: string;
  /**  当前执行的次级名序  */
  description: string[];
  /**  当前的等级  */
  level: number;
  /**  执行的钩子  */
  hooks: {
    before: (DevContextHookFn | undefined)[];
    after: (DevContextHookFn | undefined)[];
  };
};
