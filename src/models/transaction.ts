type TransactionType = 'incoming' | 'outgoing'

type Transaction = {
  id: string
  automationId: string
  timestamp: string
  status: string
  success: boolean
  message: string
  type: TransactionType
}

export type { Transaction, TransactionType }
