import type { AutomationCreateRequest, AutomationDeleteRequest, AutomationReadRequest, AutomationUpdateRequest } from "@/api/automation/types";
import type { IAutomationApiContract } from "@/api/automation/interfaces";
import type { Automation } from "@/models/automation";
import type { IDataSource } from "@/data-source";
import { AutomationApi } from "@/api/automation/api";
import { 
  AutomationCreateRequestSchema, 
  AutomationUpdateRequestSchema, 
  AutomationDeleteRequestSchema, 
  AutomationReadRequestSchema 
} from "@/validation/automation-schemas";
import { validateDataWithError } from "@/validation/validation-utils";

/**
 * Validated Automation API that ensures all requests are validated with Zod schemas
 */
export class ValidatedAutomationApi extends AutomationApi implements IAutomationApiContract {
  constructor(store: IDataSource<Automation, AutomationCreateRequest, AutomationReadRequest, AutomationUpdateRequest, AutomationDeleteRequest>) {
    super(store);
  }

  async create(data: AutomationCreateRequest): Promise<Automation> {
    const validatedData = validateDataWithError(AutomationCreateRequestSchema, data);
    return super.create(validatedData);
  }

  async read(data?: AutomationReadRequest | undefined): Promise<Automation | Automation[]> {
    if (data !== undefined) {
      const validatedData = validateDataWithError(AutomationReadRequestSchema, data);
      return super.read(validatedData);
    }
    return super.read();
  }

  async update(data: AutomationUpdateRequest): Promise<Automation | undefined> {
    const validatedData = validateDataWithError(AutomationUpdateRequestSchema, data);
    return super.update(validatedData);
  }

  async delete(data: AutomationDeleteRequest): Promise<boolean> {
    const validatedData = validateDataWithError(AutomationDeleteRequestSchema, data);
    return super.delete(validatedData);
  }
}