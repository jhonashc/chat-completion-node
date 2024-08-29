export const getWeather = ({ cityName }: { cityName: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ error: false, data: `El clima actual de ${cityName} es de ${cityName.length}° Grados Celsius` });
    }, 1000);
  });
};

export const getRandomCity = (): string => {
  const cities: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex] ?? 'unknown';
};
