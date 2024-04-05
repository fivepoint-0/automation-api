import type { Transaction } from "@/models/transaction"

type TransactionCreateRequest = Omit<Transaction, "id">
type TransactionUpdateRequest = Pick<Transaction, "id"> & Partial<Omit<Transaction, "id">>
type TransactionDeleteRequest = Pick<Transaction, "id">
type TransactionReadRequest = Partial<Transaction>

export type { TransactionCreateRequest, TransactionUpdateRequest, TransactionDeleteRequest, TransactionReadRequest }
