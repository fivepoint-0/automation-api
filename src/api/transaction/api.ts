import type { TransactionCreateRequest, TransactionReadRequest, TransactionUpdateRequest, TransactionDeleteRequest } from "@/api/transaction/types";
import type { ITransactionApiContract } from "@/api/transaction/interfaces";
import type { Transaction } from "@/models/transaction";
import type { IDataSource } from "@/data-source";

abstract class BaseTransactionApi implements ITransactionApiContract {
  constructor(protected store: IDataSource<Transaction, TransactionCreateRequest, TransactionReadRequest, TransactionUpdateRequest, TransactionDeleteRequest>) {}
  abstract create(data: TransactionCreateRequest): Promise<Transaction>
  abstract read(data?: TransactionReadRequest | undefined): Promise<Transaction | Transaction[]> 
  abstract update(data: TransactionUpdateRequest): Promise<Transaction | undefined>
  abstract delete(data: TransactionDeleteRequest): Promise<boolean>
}

class TransactionApi extends BaseTransactionApi {
  async create(data: TransactionCreateRequest): Promise<Transaction> {
    return this.store.create(data)
  }
  async read(data?: TransactionReadRequest | undefined): Promise<Transaction | Transaction[]> {
    return this.store.read(data)
  }
  async update(data: TransactionUpdateRequest): Promise<Transaction | undefined> {
    return this.store.update(data)
  }
  async delete(data: TransactionDeleteRequest): Promise<boolean> {
    return this.store.delete(data)
  }
}

export { TransactionApi }
