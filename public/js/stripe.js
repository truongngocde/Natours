import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51OFqMOAvs4w6y81KHCWutAFyS6c0rBPx1O3sqdtcGfiGhYMClXgAdM1Nz3oBsp5IqrdYm3Wzd3qudRRbrfKH6FQN00iQlwZQk9'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    })
  } catch (error) {
    showAlert('error', error);
  }
};
