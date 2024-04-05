import type { IDataSource } from "../src/data-source";

type MockModel = {
  id: string;
  name: string;
  description: string;
}
type MockModelCreateRequest = Omit<MockModel, "id">
type MockModelReadRequest = Partial<MockModel>
type MockModelUpdateRequest = Pick<MockModel, "id"> & Partial<Omit<MockModel, "id">>
type MockModelDeleteRequest = Pick<MockModel, "id">

class MockDataSource implements IDataSource<MockModel, MockModelCreateRequest, MockModelReadRequest, MockModelUpdateRequest, MockModelDeleteRequest> {
  private store: MockModel[] = [
    {
      id: "one",
      name: "Test Model",
      description: "This is a test model"
    }
  ]

  getNextId(): string {
    return btoa(new Date(Math.ceil(Math.random() * 1e13)).getTime().toString())
  }
  async create(data: MockModelCreateRequest): Promise<MockModel> {
    const model = { id: this.getNextId(), ...data }
    this.store.push(model)
    return model
  }
  async read(data?: MockModelReadRequest | undefined): Promise<MockModel | MockModel[]> {
    if (data) {
      if (data.id) {
        return this.store.find((model) => model.id === data.id) || []
      }

      return this.store.filter((model: MockModel) => {
        return Object.keys(data).every((key) => model[key as keyof MockModel] === data[key as keyof MockModel])
      })
    }

    return this.store
  }
  async update(data: MockModelUpdateRequest): Promise<MockModel | undefined> {
    const modelIndex = this.store.findIndex(model => model.id === data.id)
    if (modelIndex === -1) {
      return
    }

    this.store[modelIndex] = { ...this.store[modelIndex], ...data }

    return this.store[modelIndex]
  }
  async delete(data: MockModelDeleteRequest): Promise<boolean> {
    const modelIndex = this.store.findIndex(model => model.id === data.id)
    if (modelIndex === -1) {
      return false
    }

    this.store.splice(modelIndex, 1)

    return true
  }
}

export { MockDataSource }
export type { MockModel, MockModelCreateRequest, MockModelReadRequest, MockModelUpdateRequest, MockModelDeleteRequest }