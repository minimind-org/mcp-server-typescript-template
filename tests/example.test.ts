import { exampleAddition } from "../operations/example-operation";


describe('Example Operation Test', () => {
  it('should return total of two number', async () => {
    const result = exampleAddition({ a: 1, b: 2});
    expect(result).toBe(3);
  })
});