import { describe, it, expect } from "bun:test";
import type { Automation } from "@/models/automation";

describe('Automation Model', () => {

  it('should create a valid automation', () => {
    const automation: Automation = {
      id: '123',
      name: 'Test Automation',
      description: 'This is a test automation',
    };

    expect(automation).toBeDefined();
    expect(automation.id).toBe('123');
    expect(automation.name).toBe('Test Automation');
    expect(automation.description).toBe('This is a test automation');
  })

})