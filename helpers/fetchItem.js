const fetchItem = async (value) => {
  try {
    const url = `https://api.mercadolibre.com/items/${value}`;
    const require = await fetch(url);
    const data = await require.json();
    return data;
  } catch (error) {
    return error;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
