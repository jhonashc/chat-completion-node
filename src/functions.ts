export const getWeather = ({ cityName }: { cityName: string }) => {
  if (!cityName) return { error: 'Invalid city', message: 'Please specify the city' };
  return { weather: cityName.length };
};

export const getCostOfLiving = ({ cityName }: { cityName: string }) => {
  if (!cityName) return { error: 'Invalid city', message: 'Please specify the city' };

  return {
    city: cityName,
    housing: '$2,000 - $4,500',
    food: '$500 - $1,000',
    transportation: '$100 - $300',
    total: '$2,600 - $5,800',
  };
};

export const getRandomCity = () => {
  const cities: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const randomIndex: number = Math.floor(Math.random() * cities.length);

  if (randomIndex > cities.length || randomIndex < 0) return { error: 'Invalid city', message: 'Unknown random city' };

  return { city: cities[randomIndex] };
};
