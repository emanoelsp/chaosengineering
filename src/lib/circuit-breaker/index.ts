export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export interface CircuitBreakerConfig {
  failureThreshold: number
  timeout: number
  successThreshold: number
  name: string
}

const DEFAULT_CONFIG: Omit<CircuitBreakerConfig, 'name'> = {
  failureThreshold: 3,
  timeout: 30_000,
  successThreshold: 1,
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED'
  private failureCount = 0
  private successCount = 0
  private lastFailureTime?: number
  private readonly config: CircuitBreakerConfig

  constructor(config: Partial<CircuitBreakerConfig> & { name: string }) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      const now = Date.now()
      if (this.lastFailureTime && now - this.lastFailureTime > this.config.timeout) {
        this.state = 'HALF_OPEN'
        this.successCount = 0
      } else {
        throw new Error(`CIRCUIT_OPEN:${this.config.name}`)
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      if ((error as Error).message?.startsWith('CIRCUIT_OPEN:')) {
        throw error
      }
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failureCount = 0
    if (this.state === 'HALF_OPEN') {
      this.successCount++
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'CLOSED'
      }
    }
  }

  private onFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()
    if (this.failureCount >= this.config.failureThreshold || this.state === 'HALF_OPEN') {
      this.state = 'OPEN'
    }
  }

  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      nextRetryTime:
        this.state === 'OPEN' && this.lastFailureTime
          ? this.lastFailureTime + this.config.timeout
          : undefined,
    }
  }

  reset() {
    this.state = 'CLOSED'
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = undefined
  }
}

export const freightCircuitBreaker = new CircuitBreaker({
  name: 'freight-ai',
  failureThreshold: 3,
  timeout: 30_000,
  successThreshold: 1,
})
