import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const Pricing: React.FC = () => {
  const { user } = useAuth();

  const handleSubscribe = async (priceId: string) => {
    const stripe = await stripePromise;
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId: user?.id }),
    });
    const session = await response.json();
    await stripe?.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div>
      <h2>Choose your plan</h2>
      <div className="plan">
        <h3>Free</h3>
        <button onClick={() => handleSubscribe('price_free')}>Get started</button>
      </div>
      <div className="plan">
        <h3>Pro</h3>
        <button onClick={() => handleSubscribe('price_pro_monthly')}>Subscribe</button>
      </div>
    </div>
  );
};

export default Pricing;
