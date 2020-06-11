import { generateUuid } from './uuid';

describe('UUID', () => {
  it('should generate unique ids', () => {
    const uuidArray = [];
    const size = 1000;

    expect.assertions(size);

    for (let i = 0; i < size; i++) {
      const uuid = generateUuid();
      expect(uuidArray).not.toContain(uuid);
      uuidArray.push(uuid);
    }
    
  });
});
