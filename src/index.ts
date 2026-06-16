import { DevConstructor } from './dev';

const name = '@qqi/dev-log';
/**
 * # 测试
 */
export const dev = new DevConstructor({
  level: 0,
  randomColor: [],
  skip: false,
  before: [],
  after: [],
  name,
  running: {
    description: name,
    running: true,
    id: Symbol(name),
  },
  executionStack: [],
});
