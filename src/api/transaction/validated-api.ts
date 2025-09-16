import type { TransactionCreateRequest, TransactionReadRequest, TransactionUpdateRequest, TransactionDeleteRequest } from "@/api/transaction/types";
import type { ITransactionApiContract } from "@/api/transaction/interfaces";
import type { Transaction } from "@/models/transaction";
import type { IDataSource } from "@/data-source";
import { TransactionApi } from "@/api/transaction/api";
import { 
  TransactionCreateRequestSchema, 
  TransactionUpdateRequestSchema, 
  TransactionDeleteRequestSchema, 
  TransactionReadRequestSchema 
} from "@/validation/transaction-schemas";
import { validateDataWithError } from "@/validation/validation-utils";

/**
 * Validated Transaction API that ensures all requests are validated with Zod schemas
 */
export class ValidatedTransactionApi extends TransactionApi implements ITransactionApiContract {
  constructor(store: IDataSource<Transaction, TransactionCreateRequest, TransactionReadRequest, TransactionUpdateRequest, TransactionDeleteRequest>) {
    super(store);
  }

  async create(data: TransactionCreateRequest): Promise<Transaction> {
    const validatedData = validateDataWithError(TransactionCreateRequestSchema, data);
    return super.create(validatedData);
  }

  async read(data?: TransactionReadRequest | undefined): Promise<Transaction | Transaction[]> {
    if (data !== undefined) {
      const validatedData = validateDataWithError(TransactionReadRequestSchema, data);
      return super.read(validatedData);
    }
    return super.read();
  }

  async update(data: TransactionUpdateRequest): Promise<Transaction | undefined> {
    const validatedData = validateDataWithError(TransactionUpdateRequestSchema, data);
    return super.update(validatedData);
  }

  async delete(data: TransactionDeleteRequest): Promise<boolean> {
    const validatedData = validateDataWithError(TransactionDeleteRequestSchema, data);
    return super.delete(validatedData);
  }
}