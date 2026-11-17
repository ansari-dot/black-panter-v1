export const getAusPostConfig = () => {
  const apiKey = process.env.AUSPOST_API_KEY || '';
  const apiPassword = process.env.AUSPOST_API_PASSWORD || '';
  const accountNumber = process.env.AUSPOST_ACCOUNT_NUMBER || '';
  const baseUrl = process.env.AUSPOST_BASE_URL || 'https://digitalapi.auspost.com.au';

  const isPlaceholder = !apiKey || apiKey.includes('your_auspost_api_key') || !accountNumber;

  const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiPassword}`).toString('base64');

  return {
    apiKey,
    apiPassword,
    accountNumber,
    baseUrl,
    isPlaceholder,
    headers: {
      'Content-Type': 'application/json',
      'Account-Number': accountNumber,
      'Authorization': authHeader
    },
    sender: {
      name: process.env.AUSPOST_SENDER_NAME || 'Black Panther Batteries',
      phone: process.env.AUSPOST_SENDER_PHONE || '+61 402 277 723',
      addressLines: [process.env.AUSPOST_SENDER_ADDRESS || '123 Power Street'],
      suburb: process.env.AUSPOST_SENDER_CITY || 'Sydney',
      state: process.env.AUSPOST_SENDER_STATE || 'NSW',
      postcode: process.env.AUSPOST_SENDER_POSTCODE || '2000',
      country: process.env.AUSPOST_SENDER_COUNTRY || 'AU'
    }
  };
};

export const isAusPostConfigured = () => {
  const cfg = getAusPostConfig();
  return !cfg.isPlaceholder;
};

export default getAusPostConfig;
