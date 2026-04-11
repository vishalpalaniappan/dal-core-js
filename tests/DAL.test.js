import { describe, it, expect } from 'vitest';
import { DALEngine } from '../src/DALEngine.ts';

describe('DALEngine', () => {
  it('sets the name correctly', () => {
    const dalInstance = new DALEngine({ name: "name" });
    expect(dalInstance.name).toBe("name");
  });
});