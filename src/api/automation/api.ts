import type { AutomationCreateRequest, AutomationDeleteRequest, AutomationReadRequest, AutomationUpdateRequest } from "@/api/automation/types";
import type { IAutomationApiContract } from "@/api/automation/interfaces";
import type { Automation } from "@/models/automation";
import type { IDataSource } from "@/data-source";

abstract class BaseAutomationApi implements IAutomationApiContract {
  constructor(protected store: IDataSource<Automation, AutomationCreateRequest, AutomationReadRequest, AutomationUpdateRequest, AutomationDeleteRequest>) {}
  abstract create(data: AutomationCreateRequest): Promise<Automation>
  abstract read(data?: AutomationReadRequest | undefined): Promise<Automation | Automation[]> 
  abstract update(data: AutomationUpdateRequest): Promise<Automation | undefined>
  abstract delete(data: AutomationDeleteRequest): Promise<boolean>
}

class AutomationApi extends BaseAutomationApi {
  async create(data: AutomationCreateRequest): Promise<Automation> {
    return this.store.create(data)
  }
  async read(data?: AutomationReadRequest | undefined): Promise<Automation | Automation[]> {
    return this.store.read(data)
  }
  async update(data: AutomationUpdateRequest): Promise<Automation | undefined> {
    return this.store.update(data)
  }
  async delete(data: AutomationDeleteRequest): Promise<boolean> {
    return this.store.delete(data)
  }
}

export { AutomationApi }
