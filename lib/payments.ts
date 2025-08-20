// Payment Gateway Abstraction Layer for Developlogy

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  metadata?: Record<string, any>
}

export interface PaymentRequest {
  amount: number
  currency: string
  orderId: string
  customerInfo: {
    name: string
    email: string
    phone?: string
  }
  metadata?: Record<string, any>
}

// Abstract payment gateway interface
export interface IPayments {
  processPayment(request: PaymentRequest): Promise<PaymentResult>
  verifyPayment(transactionId: string): Promise<PaymentResult>
  refundPayment(transactionId: string, amount?: number): Promise<PaymentResult>
}

// Mock payment gateway for development and testing
export class MockPaymentGateway implements IPayments {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate 95% success rate
    const success = Math.random() > 0.05

    if (success) {
      return {
        success: true,
        transactionId: `mock_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          gateway: "mock",
          processedAt: new Date().toISOString(),
          amount: request.amount,
          currency: request.currency,
        },
      }
    } else {
      return {
        success: false,
        error: "Payment failed due to insufficient funds or network error",
        metadata: {
          gateway: "mock",
          failedAt: new Date().toISOString(),
        },
      }
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    // Mock verification - assume all mock transactions are valid
    if (transactionId.startsWith("mock_txn_")) {
      return {
        success: true,
        transactionId,
        metadata: {
          gateway: "mock",
          verified: true,
          verifiedAt: new Date().toISOString(),
        },
      }
    }

    return {
      success: false,
      error: "Transaction not found",
      metadata: {
        gateway: "mock",
        transactionId,
      },
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResult> {
    // Simulate refund processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      success: true,
      transactionId: `refund_${transactionId}`,
      metadata: {
        gateway: "mock",
        refundedAt: new Date().toISOString(),
        originalTransaction: transactionId,
        refundAmount: amount,
      },
    }
  }
}

// Future gateway adapters (placeholder implementations)
export class StripeGateway implements IPayments {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // TODO: Implement Stripe integration
    throw new Error("Stripe gateway not implemented yet. Set STRIPE_SECRET_KEY environment variable.")
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    // TODO: Implement Stripe verification
    throw new Error("Stripe gateway not implemented yet.")
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResult> {
    // TODO: Implement Stripe refund
    throw new Error("Stripe gateway not implemented yet.")
  }
}

export class RazorpayGateway implements IPayments {
  private keyId: string
  private keySecret: string

  constructor(keyId: string, keySecret: string) {
    this.keyId = keyId
    this.keySecret = keySecret
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // TODO: Implement Razorpay integration
    throw new Error(
      "Razorpay gateway not implemented yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.",
    )
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    // TODO: Implement Razorpay verification
    throw new Error("Razorpay gateway not implemented yet.")
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResult> {
    // TODO: Implement Razorpay refund
    throw new Error("Razorpay gateway not implemented yet.")
  }
}

// Payment gateway factory
export function createPaymentGateway(): IPayments {
  // Check environment variables to determine which gateway to use
  if (process.env.STRIPE_SECRET_KEY) {
    return new StripeGateway(process.env.STRIPE_SECRET_KEY)
  } else if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return new RazorpayGateway(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET)
  } else {
    // Default to mock gateway for development
    return new MockPaymentGateway()
  }
}
