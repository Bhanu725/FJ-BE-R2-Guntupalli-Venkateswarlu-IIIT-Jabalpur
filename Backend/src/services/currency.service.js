const axios = require('axios');

exports.convertCurrency = async (
  amount,
  fromCurrency,
  toCurrency
) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const response = await axios.get(
    `https://api.exchangerate.host/convert`,
    {
      params: {
        from: fromCurrency,
        to: toCurrency,
        amount
      }
    }
  );

  return response.data.result;
};
