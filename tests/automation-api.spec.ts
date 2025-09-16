import { describe, it, expect } from "bun:test";
import { AutomationApi } from "@/api/automation";
import type { Automation } from "@/models/automation";
import type {
  AutomationCreateRequest,
  AutomationDeleteRequest,
  AutomationReadRequest,
  AutomationUpdateRequest,
} from "@/api/automation/types";
import type { IDataSource } from "@/data-source";

class AutomationMemoryDataSource
  implements
    IDataSource<
      Automation,
      AutomationCreateRequest,
      AutomationReadRequest,
      AutomationUpdateRequest,
      AutomationDeleteRequest
    >
{
  private automations: Automation[];

  constructor(initialAutomations: Automation[], private readonly alwaysReturnArray = false) {
    this.automations = [...initialAutomations];
  }

  async create(data: AutomationCreateRequest): Promise<Automation> {
    const automation: Automation = {
      id: `automation-${this.automations.length + 1}`,
      ...data,
    };

    this.automations.push(automation);

    return automation;
  }

  async read(data?: AutomationReadRequest): Promise<Automation | Automation[]> {
    if (!data) {
      return this.alwaysReturnArray ? [...this.automations] : this.automations;
    }

    const matches = this.automations.filter((automation) => {
      return Object.entries(data).every(([key, value]) => {
        if (value === undefined) {
          return true;
        }

        return automation[key as keyof Automation] === value;
      });
    });

    if (this.alwaysReturnArray || matches.length !== 1) {
      return matches;
    }

    return matches[0];
  }

  async update(data: AutomationUpdateRequest): Promise<Automation | undefined> {
    const index = this.automations.findIndex((automation) => automation.id === data.id);

    if (index === -1) {
      return undefined;
    }

    this.automations[index] = {
      ...this.automations[index],
      ...data,
    };

    return this.automations[index];
  }

  async delete(data: AutomationDeleteRequest): Promise<boolean> {
    const previousLength = this.automations.length;

    this.automations = this.automations.filter((automation) => automation.id !== data.id);

    return this.automations.length < previousLength;
  }
}

describe("AutomationApi", () => {
  const existingAutomation: Automation = {
    id: "automation-1",
    name: "Test Automation",
    description: "Ensures automations can be found by ID",
  };

  it("findById returns the automation when the store resolves to an entity", async () => {
    const api = new AutomationApi(new AutomationMemoryDataSource([existingAutomation]));

    const automation = await api.findById(existingAutomation.id);

    expect(automation).toBeDefined();
    expect(automation?.id).toBe(existingAutomation.id);
    expect(automation?.name).toBe(existingAutomation.name);
  });

  it("findById returns undefined when no automation matches the id", async () => {
    const api = new AutomationApi(new AutomationMemoryDataSource([existingAutomation]));

    const automation = await api.findById("missing-automation");

    expect(automation).toBeUndefined();
  });

  it("findById supports stores that return array responses", async () => {
    const api = new AutomationApi(new AutomationMemoryDataSource([existingAutomation], true));

    const automation = await api.findById(existingAutomation.id);

    expect(automation).toBeDefined();
    expect(automation?.id).toBe(existingAutomation.id);
  });
});
