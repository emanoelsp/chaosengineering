// Domain types — generated from Zod schemas via z.infer<>
// Import from @/schemas/* for schema + type in one place

export type UserRole = 'aluno' | 'professor' | 'admin'

export interface AppUser {
  uid: string
  email: string
  displayName: string | null
  role: UserRole
  createdAt: Date
}

export interface Product {
  id: string
  nome: string
  descricao: string
  preco: number
  estoque: number
  imageUrl: string
  categoria: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  product: Product
  quantidade: number
}

export interface FreightResult {
  valorFrete: number
  prazoEntrega: number
  justificativa: string
  isFallback: boolean
}

export type OrderStatus = 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado'

export interface Order {
  id: string
  userId: string
  itens: CartItem[]
  frete: FreightResult
  total: number
  status: OrderStatus
  enderecoEntrega: EnderecoEntrega
  cupomAplicado?: string
  descontoAplicado?: number
  createdAt: Date
  updatedAt: Date
}

export interface EnderecoEntrega {
  cep: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
}

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export interface CircuitBreakerStatus {
  state: CircuitState
  failureCount: number
  lastFailureTime?: number
  nextRetryTime?: number
}

export type ChaosType = 'latency' | 'error_500' | 'timeout' | 'unavailable'

export interface ChaosExperiment {
  id: string
  type: ChaosType
  target: string
  delayMs?: number
  durationMs: number
  blastRadius: number
  startedAt: Date
  endedAt?: Date
  startedBy: string
  metrics?: ChaosMetrics
}

export interface ChaosMetrics {
  errorRateBefore: number
  errorRateAfter: number
  avgResponseTimeBefore: number
  avgResponseTimeAfter: number
  conversionRateBefore: number
  conversionRateAfter: number
  circuitBreakerOpened: boolean
  fallbackActivated: boolean
}
