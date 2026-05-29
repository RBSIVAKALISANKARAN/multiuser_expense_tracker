export const EXPENSE_CATEGORIES = [
  {
    id: 'stationary',
    name: 'Stationary',
    icon: 'BookOpen',
    color: 'bg-blue-500',
    description: 'Books, stationery, exam fees',
  },
  {
    id: 'food',
    name: 'Food',
    icon: 'Utensils',
    color: 'bg-orange-500',
    description: 'Meals, groceries, mess',
  },
  {
    id: 'pg',
    name: 'PG/Rent',
    icon: 'Home',
    color: 'bg-purple-500',
    description: 'Rent, utilities, maintenance',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'Car',
    color: 'bg-green-500',
    description: 'Bus, train, cab, fuel',
  },
  {
    id: 'household',
    name: 'Household',
    icon: 'Package',
    color: 'bg-cyan-500',
    description: 'Cleaning, kitchen supplies',
  },
  {
    id: 'friends',
    name: 'Friends',
    icon: 'Users',
    color: 'bg-pink-500',
    description: 'Outings, treats, gifts',
  },
  {
    id: 'family',
    name: 'Family',
    icon: 'Heart',
    color: 'bg-rose-500',
    description: 'Family expenses, sent home',
  },
  {
    id: 'donated',
    name: 'Donated',
    icon: 'Gift',
    color: 'bg-amber-500',
    description: 'Donations, charity',
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'Activity',
    color: 'bg-red-500',
    description: 'Medical, pharmacy, insurance',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Smartphone',
    color: 'bg-indigo-500',
    description: 'Devices, repairs, accessories',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'Music',
    color: 'bg-violet-500',
    description: 'Movies, OTT, gaming',
  },
  {
    id: 'shopping_clothing',
    name: 'Shopping (Clothing)',
    icon: 'Shirt',
    color: 'bg-fuchsia-500',
    description: 'Clothes, accessories',
  },
  {
    id: 'shopping_other',
    name: 'Shopping (Other)',
    icon: 'ShoppingBag',
    color: 'bg-lime-500',
    description: 'Footwear, bags, decor',
  },
] as const;

export const PAYMENT_MODES = [
  { id: 'cash', name: 'Cash' },
  { id: 'upi', name: 'UPI' },
  { id: 'card', name: 'Card' },
  { id: 'net_banking', name: 'Net Banking' },
  { id: 'wallet', name: 'Wallet' },
] as const;

export const FOOD_MEAL_TYPES = [
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'lunch', name: 'Lunch' },
  { id: 'dinner', name: 'Dinner' },
  { id: 'snacks', name: 'Snacks' },
] as const;

export const FOOD_CATEGORIES = [
  { id: 'fruits', name: 'Fruits' },
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'millets', name: 'Millets' },
  { id: 'carb_items', name: 'Carb Items' },
  { id: 'junk', name: 'Junk Food' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'groceries', name: 'Groceries' },
] as const;

export const PG_EXPENSE_TYPES = [
  { id: 'rent', name: 'Rent' },
  { id: 'electricity', name: 'Electricity (EB)' },
  { id: 'water', name: 'Water' },
  { id: 'maintenance', name: 'Maintenance' },
  { id: 'security_deposit', name: 'Security Deposit' },
] as const;

export const TRANSPORT_TYPES = [
  { id: 'bus', name: 'Bus' },
  { id: 'train', name: 'Train' },
  { id: 'bike', name: 'Bike/Scooter' },
  { id: 'auto', name: 'Auto' },
  { id: 'cab', name: 'Cab/Taxi' },
  { id: 'others', name: 'Others' },
] as const;

export const HOUSEHOLD_TYPES = [
  { id: 'cleaning', name: 'Cleaning Supplies' },
  { id: 'kitchen', name: 'Kitchen Items' },
  { id: 'bathroom', name: 'Bathroom Items' },
  { id: 'electrical', name: 'Electrical Items' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'others', name: 'Others' },
] as const;

export const HEALTH_TYPES = [
  { id: 'hospital_visit', name: 'Hospital Visit' },
  { id: 'pharmacy', name: 'Pharmacy' },
  { id: 'insurance', name: 'Insurance Premium' },
  { id: 'lab_test', name: 'Lab Test' },
  { id: 'others', name: 'Others' },
] as const;

export const DONATION_TYPES = [
  { id: 'food', name: 'Food' },
  { id: 'drink', name: 'Drink' },
  { id: 'money', name: 'Money' },
  { id: 'clothes', name: 'Clothes' },
  { id: 'others', name: 'Others' },
] as const;

export const ELECTRONICS_TYPES = [
  { id: 'mobile', name: 'Mobile Phone' },
  { id: 'laptop', name: 'Laptop' },
  { id: 'earphones', name: 'Earphones/Headphones' },
  { id: 'charger', name: 'Charger' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'other', name: 'Other' },
] as const;

export const ENTERTAINMENT_TYPES = [
  { id: 'movies', name: 'Movies' },
  { id: 'ott', name: 'OTT Subscription' },
  { id: 'concerts', name: 'Concerts/Events' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'amusement_park', name: 'Amusement Park' },
  { id: 'others', name: 'Others' },
] as const;

export const CLOTHING_MEN = [
  { id: 'innerwear', name: 'Innerwear' },
  { id: 'shirts', name: 'Shirts' },
  { id: 't_shirts', name: 'T-Shirts' },
  { id: 'pants', name: 'Pants/Jeans' },
  { id: 'trousers', name: 'Trousers' },
  { id: 'shorts', name: 'Shorts' },
  { id: 'ethnic', name: 'Ethnic Wear' },
  { id: 'jacket', name: 'Jacket/Hoodie' },
  { id: 'accessories', name: 'Accessories' },
] as const;

export const CLOTHING_WOMEN = [
  { id: 'innerwear', name: 'Innerwear' },
  { id: 'kurti', name: 'Kurti/Salwar' },
  { id: 'saree', name: 'Saree' },
  { id: 'tops', name: 'Tops' },
  { id: 'jeans_leggings', name: 'Jeans/Leggings' },
  { id: 'churidar', name: 'Churidar' },
  { id: 'dresses', name: 'Dresses' },
  { id: 'dupatta', name: 'Dupatta' },
  { id: 'nightwear', name: 'Nightwear' },
  { id: 'ethnic', name: 'Ethnic Wear' },
  { id: 'accessories', name: 'Accessories' },
] as const;

export const SHOPPING_OTHER_TYPES = [
  { id: 'footwear', name: 'Footwear' },
  { id: 'bag', name: 'Bags' },
  { id: 'stationery', name: 'Stationery' },
  { id: 'personal_care', name: 'Personal Care' },
  { id: 'home_decor', name: 'Home Decor' },
  { id: 'others', name: 'Others' },
] as const;

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const SUBSCRIPTION_FREQUENCIES = [
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'quarterly', name: 'Quarterly' },
  { id: 'yearly', name: 'Yearly' },
] as const;
