import type { Transaction } from "@/models/transaction";
import type { TransactionCreateRequest, TransactionDeleteRequest, TransactionReadRequest, TransactionUpdateRequest } from "@/api/transaction/types";

interface ITransactionApiContract {
  create(data: TransactionCreateRequest): Promise<Transaction>
  read(data?: TransactionReadRequest | undefined): Promise<Transaction | Transaction[]>
  update(data: TransactionUpdateRequest): Promise<Transaction | undefined>
  delete(data: TransactionDeleteRequest): Promise<boolean>
}

export type { ITransactionApiContract }
