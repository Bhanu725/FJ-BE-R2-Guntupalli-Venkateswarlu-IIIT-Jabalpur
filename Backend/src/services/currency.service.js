const axios = require("axios");

// Fetch exchange rate between two currencies
const getRate = async (from, to) => {
  if (from === to) return 1;

  try {
    const response = await axios.get(
      "https://api.frankfurter.app/latest",
      {
        params: {
          from,
          to
        }
      }
    );

    const rate = response.data.rates[to];

    if (!rate) {
      throw new Error("Invalid currency conversion");
    }

    return rate;

  } catch (error) {
    console.error("Exchange rate fetch failed:", error.message);
    throw new Error("Currency conversion failed");
  }
};


// Convert any currency to USD (for storing in DB)
exports.convertToUSD = async (amount, fromCurrency) => {
  const rate = await getRate(fromCurrency, "USD");
  return Number(amount) * rate;
};


// Convert USD to any currency (for display)
exports.convertFromUSD = async (amount, toCurrency) => {
  const rate = await getRate("USD", toCurrency);
  return Number(amount) * rate;
};


// General converter (optional utility)
exports.convertCurrency = async (
  amount,
  fromCurrency,
  toCurrency
) => {
  const rate = await getRate(fromCurrency, toCurrency);
  return Number(amount) * rate;
};
