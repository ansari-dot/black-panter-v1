import Stripe from 'stripe';

const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();

// Determine if configured key is valid (must start with sk_test_, sk_live_, rk_test_, or rk_live_)
const isValidKeyPrefix = stripeSecretKey.startsWith('sk_test_') || 
                         stripeSecretKey.startsWith('sk_live_') || 
                         stripeSecretKey.startsWith('rk_test_') || 
                         stripeSecretKey.startsWith('rk_live_');

const isPlaceholderKey = !stripeSecretKey || !isValidKeyPrefix || stripeSecretKey.includes('MockStripe') || stripeSecretKey.includes('your_sandbox_secret_key');

if (!isValidKeyPrefix && stripeSecretKey) {
  console.error('\x1b[31m%s\x1b[0m', `❌ [STRIPE ERROR] Invalid STRIPE_SECRET_KEY prefix "${stripeSecretKey.slice(0, 7)}...". Stripe Secret Keys MUST start with sk_live_... or sk_test_... (or rk_live_... for restricted keys). Please fix the key in server/.env.`);
} else if (isPlaceholderKey) {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️  [STRIPE NOTICE] Stripe is using Sandbox simulation mode. Update STRIPE_SECRET_KEY in server/.env with your active Stripe Secret Key (sk_live_... or sk_test_...).');
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  appInfo: {
    name: 'BlackPantherBatteries',
    version: '1.0.0'
  }
});

export const isStripeConfigured = () => {
  return Boolean(stripeSecretKey && isValidKeyPrefix && !isPlaceholderKey);
};

export default stripe;

