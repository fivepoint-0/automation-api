import type { Automation } from "@/models/automation"

type AutomationCreateRequest = Omit<Automation, "id">
type AutomationUpdateRequest = Pick<Automation, "id"> & Partial<Omit<Automation, "id">>
type AutomationDeleteRequest = Pick<Automation, "id">
type AutomationReadRequest = Partial<Automation>

export type { AutomationCreateRequest, AutomationUpdateRequest, AutomationDeleteRequest, AutomationReadRequest }
