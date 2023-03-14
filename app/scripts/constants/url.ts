export const MOONPAY_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://sandbox.moonpay.com'
    : 'https://buy-sandbox.moonpay.com';
