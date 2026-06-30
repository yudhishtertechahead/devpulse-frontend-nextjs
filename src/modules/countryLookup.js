export function getCountryStats(countries) {
  const normalised = countries.map(c => ({
    name: c.name.common,
    capital: c.capital ? c.capital[0] : 'N/A',
    population: c.population,
    currency: c.currencies
      ? Object.keys(c.currencies)[0]
      : 'N/A',
    flag: c.flags?.emoji || '',
    region: c.subregion || 'Asia',
  }));

  const totalPopulation = normalised.reduce((sum, c) => sum + c.population, 0);

  const top5 = [...normalised]
    .sort((a, b) => b.population - a.population)
    .slice(0, 5);

  const totalCountries = normalised.length;

  return { normalised, top5, totalCountries, totalPopulation };
}
