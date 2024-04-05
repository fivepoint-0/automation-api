import type { Automation } from "@/models/automation";
import type { AutomationCreateRequest, AutomationDeleteRequest, AutomationReadRequest, AutomationUpdateRequest } from "@/api/automation/types";

interface IAutomationApiContract {
  create(data: AutomationCreateRequest): Promise<Automation>
  read(data?: AutomationReadRequest): Promise<Automation | Automation[]>
  update(data: AutomationUpdateRequest): Promise<Automation | undefined>
  delete(data: AutomationDeleteRequest): Promise<boolean>
}

export type { IAutomationApiContract }
