import { describe, it, expect } from "bun:test";
import { MockDataSource, type MockModel } from "./mock-data-source.spec";

const dataSource = new MockDataSource()

describe("IDataSource", () => {
  it("create method", async () => {
    const data = {
      name: "Test Model",
      description: "This is a test model"
    };

    const result = await dataSource.create(data)

    expect(result.id).toBeDefined()
    expect(result.name).toEqual(data.name)
    expect(result.description).toEqual(data.description)
  })

  it("read method -> Array", async () => {
    const data = {
      name: "Test Model",
    };

    const result = await dataSource.read(data)

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect((result as MockModel[]).length).toBeGreaterThan(0)
    expect((result as MockModel[]).every((model: MockModel) => model.name === data.name)).toBe(true)
  })

  it("read method -> Single", async () => {
    const data = {
      id: "one",
    }

    const result = await dataSource.read(data)

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(false)
    expect((result as MockModel).id).toEqual(data.id)
  })


  it("update method", async () => {
    const id = "one";

    const updateData = {
      name: "Updated Model",
      description: "This is an updated model"
    }

    const currentModel = await dataSource.read({ id })

    expect(Array.isArray(currentModel)).toBe(false)
    expect((currentModel as MockModel).id).toEqual(id)

    const updatedModel = await dataSource.update({ id, ...updateData })
    expect(updatedModel).toBeDefined()
    expect(updatedModel?.description).not.toEqual((currentModel as MockModel).description)
    expect(updatedModel?.name).not.toEqual((currentModel as MockModel).name)
    expect(updatedModel?.id).toEqual(id)
  })

  it("delete method", async () => {
    const id = "one";

    const result = await dataSource.delete({ id })

    expect(result).toBe(true)
  });
})
