import Stripe from 'stripe';
import { stripe } from '../../config/stripe';

class StripeService {
  private stripe: Stripe;

  constructor(stripeInstance: Stripe) {
    this.stripe = stripeInstance;
  }

  // Create a connected account for the vendor
  async createConnectedAccount(email: string): Promise<Stripe.Account> {
    const account = await this.stripe.accounts.create({
      type: 'express', 
      email,
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
    });
    return account;
  }

  async createAccountLink(
    accountId: string,
    returnUrl: string,
    refreshUrl: string
  ): Promise<string> {
    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });
    return accountLink.url;
  }

  async createCheckoutSession(
    customerEmail: string,
    amount: number,
    orderId: string
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Service Payment',
              description: 'Payment for vendor service',
            },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://yourapp.com/success',
      cancel_url: 'https://yourapp.com/cancel',
      payment_intent_data: {},
      metadata: {
        customer_email: customerEmail,
        amount: Math.round(Number(amount)).toString(),
        orderId: orderId,
      },
    });

    return { sessionId: session.id, url: session.url as string };
  }

  async createLoginLink(accountId: string): Promise<string> {
    const loginLink = await this.stripe.accounts.createLoginLink(accountId);
    return loginLink.url;
  }

  async checkStripeAccountStatus(accountId: string): Promise<string | null> {
    const account = await this.stripe.accounts.retrieve(accountId);
    if (account.requirements && account.requirements.disabled_reason) {
      return account.requirements.disabled_reason; 
    }

    return null;
  }
}

// Create an instance of StripeService with the Stripe instance
const stripeService = new StripeService(stripe);

export default stripeService;
