import { colorText, numberPen } from '@vvi/pen';

/**  兼容打印  */
export function createPrintf(randomColor: number[]) {
  /**  前导符  */
  const startsStr = randomColor.reduce(
    (previousValue: string, currentValue: number) =>
      previousValue.concat(numberPen(currentValue)`⎆ `),
    '',
  );
  return (message: string) => console.log(startsStr, ...colorText(message));
}
