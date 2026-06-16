import { redPen, yellowPen, bluePen } from '@vvi/pen';

/**
 * # 执行为 false
 */
export function runningFalse({
  description,
  lastDescription,
  message,
  printf,
}: {
  description: string;
  lastDescription: string;
  message: string;
  printf(str: string): void;
}) {
  const parentMessage = redPen(description);
  const awaitRun = yellowPen(lastDescription);
  printf(
    `当前 "${bluePen(message)}" 步骤
    \r其父级 "${parentMessage}" 已执行完毕
    \r上一个步骤执行却未执行完毕 "${awaitRun}"
    \r现在期待 
    \r"${parentMessage}-${awaitRun}" 
    \r异步方法前有 await 等待
    `,
  );

  printf('\n\n\n\n\n看上面 👆\n\n\n\n');
}
