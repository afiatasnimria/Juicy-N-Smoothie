const defaultData = {
  restaurant: {
    name: "Juicy n Smoothie",
    tagline: "Fresh Taste, Smooth Experience",
    subtitle: "Scan. Explore. Enjoy.",
    phone: "+880 1234-567890",
    hours: "10AM - 10PM",
    location: "Dhaka, Bangladesh"
  },
  todayOffer: {
    enabled: true,
    badge: "Today's Special",
    title: "Special Offer",
    emoji: "🍕+🍋",
    deal: "Buy 1 Pizza Get 1 Lemonade Free!",
    description: "Valid for all pizza varieties. Refreshing lemonade included!",
    buttonText: "Limited Time Offer"
  },
  categories: [
    { id: "all", name: "All", icon: "🍽️" },
    { id: "pizza", name: "Pizza", icon: "🍕" },
    { id: "fried-items", name: "Fried", icon: "🍗" },
    { id: "pasta", name: "Pasta", icon: "🍝" },
    { id: "momo", name: "Momo", icon: "🥟" },
    { id: "platters", name: "Platters", icon: "🍱" },
    { id: "breakfast", name: "Breakfast", icon: "🌅" },
    { id: "singara", name: "Singara", icon: "🥐" },
    { id: "fuska", name: "Fuska", icon: "🫓" },
    { id: "sandwiches", name: "Sandwiches", icon: "🥪" },
    { id: "ramen", name: "Ramen", icon: "🍜" }
  ],
  menu: [
    // === PIZZA ===
    { id: 1, name: "Basic Pizza", category: "pizza", sizes: [{ size: '9"', price: 300 }, { size: '12"', price: 420 }, { size: '14"', price: 550 }], image: "https://source.unsplash.com/800x600/?pizza" },
    { id: 2, name: "Chicken Pizza", category: "pizza", sizes: [{ size: '9"', price: 300 }, { size: '12"', price: 420 }, { size: '14"', price: 550 }], image: "https://source.unsplash.com/800x600/?chicken-pizza" },
    { id: 3, name: "Beef Pizza", category: "pizza", sizes: [{ size: '9"', price: 320 }, { size: '12"', price: 440 }, { size: '14"', price: 580 }], image: "https://source.unsplash.com/800x600/?beef-pizza" },
    { id: 4, name: "Margarita Pizza", category: "pizza", sizes: [{ size: '9"', price: 300 }, { size: '12"', price: 440 }, { size: '14"', price: 550 }], image: "https://source.unsplash.com/800x600/?margherita-pizza" },
    { id: 5, name: "Mushroom Lovers Pizza", category: "pizza", sizes: [{ size: '9"', price: 350 }, { size: '12"', price: 440 }, { size: '14"', price: 550 }], image: "https://source.unsplash.com/800x600/?mushroom-pizza" },
    { id: 6, name: "Special Pizza Loaded (1)", category: "pizza", sizes: [{ size: '9"', price: 300 }, { size: '12"', price: 420 }, { size: '14"', price: 550 }], image: "https://source.unsplash.com/800x600/?pizza" },
    { id: 7, name: "Special Pizza Loaded (2)", category: "pizza", sizes: [{ size: '9"', price: 360 }, { size: '12"', price: 460 }, { size: '14"', price: 720 }], image: "https://source.unsplash.com/800x600/?pizza" },
    { id: 8, name: "BBQ Blast Pizza", category: "pizza", sizes: [{ size: '9"', price: 380 }, { size: '12"', price: 499 }, { size: '14"', price: 749 }], image: "https://source.unsplash.com/800x600/?bbq-pizza" },
    { id: 9, name: "Mexican Hot Pizza", category: "pizza", sizes: [{ size: '9"', price: 399 }, { size: '12"', price: 519 }, { size: '14"', price: 799 }], image: "https://source.unsplash.com/800x600/?mexican-pizza" },
    { id: 10, name: "Four Season Pizza", category: "pizza", sizes: [{ size: '9"', price: 439 }, { size: '12"', price: 579 }, { size: '14"', price: 849 }], image: "https://source.unsplash.com/800x600/?pizza" },
    { id: 11, name: "Meat Lovers Pizza", category: "pizza", sizes: [{ size: '9"', price: 399 }, { size: '12"', price: 549 }, { size: '14"', price: 810 }], image: "https://source.unsplash.com/800x600/?pepperoni-pizza" },
    { id: 12, name: "Ultimate Pepperoni Pizza", category: "pizza", sizes: [{ size: '9"', price: 400 }, { size: '12"', price: 550 }, { size: '14"', price: 800 }], image: "https://source.unsplash.com/800x600/?pepperoni-pizza" },
    { id: 13, name: "Single Slice Pizza", category: "pizza", sizes: [], price: 50, image: "https://source.unsplash.com/800x600/?pizza-slice" },

    // === FRIED ITEMS ===
    { id: 14, name: "Fried Chicken (1pc Classic/BBQ)", category: "fried-items", price: 150, image: "https://source.unsplash.com/800x600/?fried-chicken" },
    { id: 15, name: "Hot Wings (4pcs)", category: "fried-items", price: 120, image: "https://source.unsplash.com/800x600/?hot-wings" },
    { id: 16, name: "BBQ Sweet & Sour Wings (4pcs)", category: "fried-items", price: 160, image: "https://source.unsplash.com/800x600/?bbq-wings" },
    { id: 17, name: "Chicken Strips (6pcs)", category: "fried-items", price: 160, image: "https://source.unsplash.com/800x600/?chicken-strips" },

    // === PASTA ===
    { id: 18, name: "Oven Baked Pasta", category: "pasta", price: 150, image: "https://source.unsplash.com/800x600/?baked-pasta" },
    { id: 19, name: "Spicy Pasta", category: "pasta", price: 130, image: "https://source.unsplash.com/800x600/?spicy-pasta" },
    { id: 20, name: "Chicken Naga Spaghetti", category: "pasta", price: 160, image: "https://source.unsplash.com/800x600/?spaghetti" },
    { id: 21, name: "Chicken Mushroom Creamy Spaghetti", category: "pasta", price: 180, image: "https://source.unsplash.com/800x600/?creamy-pasta" },

    // === MOMO ===
    { id: 22, name: "Chicken Steam Momo (5pcs)", category: "momo", price: 120, image: "https://source.unsplash.com/800x600/?momo" },
    { id: 23, name: "Chicken Fried Momo (5pcs)", category: "momo", price: 130, image: "https://source.unsplash.com/800x600/?fried-momo" },

    // === PLATTERS & SET MEAL ===
    { id: 24, name: "Chicken & Veggie Rice Bowl", category: "platters", price: 130, image: "https://source.unsplash.com/800x600/?rice-bowl" },
    { id: 25, name: "Fried Chicken Rice Bowl", category: "platters", price: 150, image: "https://source.unsplash.com/800x600/?fried-rice" },
    { id: 26, name: "Sweet & Sour Wings Rice Bowl", category: "platters", price: 120, image: "https://source.unsplash.com/800x600/?sweet-sour-chicken" },
    { id: 27, name: "Luchi + Alu Dum + Dal + Vegetable + Special Chutney", category: "platters", price: 120, image: "https://source.unsplash.com/800x600/?bangladeshi-food" },

    // === ALL DAY BREAKFAST ===
    { id: 28, name: "Alu Dum", category: "breakfast", price: 30, image: "https://source.unsplash.com/800x600/?potato-curry" },
    { id: 29, name: "Mixed Vegetables", category: "breakfast", price: 20, image: "https://source.unsplash.com/800x600/?mixed-vegetables" },
    { id: 30, name: "Dal", category: "breakfast", price: 25, image: "https://source.unsplash.com/800x600/?dal" },
    { id: 31, name: "Egg Cheese Parata", category: "breakfast", price: 90, image: "https://source.unsplash.com/800x600/?egg-paratha" },
    { id: 32, name: "Alu Parata", category: "breakfast", price: 30, image: "https://source.unsplash.com/800x600/?paratha" },
    { id: 33, name: "Plain Parata", category: "breakfast", price: 10, image: "https://source.unsplash.com/800x600/?paratha" },
    { id: 34, name: "Luchi", category: "breakfast", price: 10, image: "https://source.unsplash.com/800x600/?luchi" },
    { id: 35, name: "Cheese Omelette", category: "breakfast", price: 70, image: "https://source.unsplash.com/800x600/?omelette" },
    { id: 36, name: "Plain Omelette", category: "breakfast", price: 40, image: "https://source.unsplash.com/800x600/?omelette" },
    { id: 37, name: "Bread 2pcs + Sausage + Egg", category: "breakfast", price: 100, image: "https://source.unsplash.com/800x600/?breakfast" },

    // === SINGARA ===
    { id: 38, name: "Hotten Naughty (Naga) 3pcs", category: "singara", price: 45, image: "https://source.unsplash.com/800x600/?singara" },
    { id: 39, name: "Madani Veggie 3pcs", category: "singara", price: 40, image: "https://source.unsplash.com/800x600/?vegetable-samosa" },
    { id: 40, name: "Sir Koliza (Beef) 3pcs", category: "singara", price: 40, image: "https://source.unsplash.com/800x600/?beef-samosa" },
    { id: 41, name: "Lovely Koliza Chicken 1pc", category: "singara", price: 30, image: "https://source.unsplash.com/800x600/?chicken-samosa" },
    { id: 42, name: "Chicken Mayo 1pc", category: "singara", price: 50, image: "https://source.unsplash.com/800x600/?chicken-roll" },
    { id: 43, name: "Cheesy Chik 1pc", category: "singara", price: 60, image: "https://source.unsplash.com/800x600/?cheese-snack" },
    { id: 44, name: "Mr. Bolonese 1pc", category: "singara", price: 60, image: "https://source.unsplash.com/800x600/?bolognese" },
    { id: 45, name: "Chicken Naga Singara", category: "singara", price: 40, image: "https://source.unsplash.com/800x600/?spicy-samosa" },
    { id: 46, name: "Extra Dip Mayo/Garlic Mayo", category: "singara", price: 15, image: "https://source.unsplash.com/800x600/?sauce" },
    { id: 47, name: "Naga Sauce", category: "singara", price: 20, image: "https://source.unsplash.com/800x600/?hot-sauce" },

    // === FUSKA / CHOTPOTI ===
    { id: 48, name: "Regular Fuska", category: "fuska", price: 70, image: "https://source.unsplash.com/800x600/?fuchka" },
    { id: 49, name: "Special Naga Fuska", category: "fuska", price: 80, image: "https://source.unsplash.com/800x600/?fuchka" },
    { id: 50, name: "Doi Fuska", category: "fuska", price: 120, image: "https://source.unsplash.com/800x600/?doi-fuchka" },
    { id: 51, name: "Chotpoti", category: "fuska", price: 60, image: "https://source.unsplash.com/800x600/?chotpoti" },
    { id: 52, name: "Special Naga Chotpoti", category: "fuska", price: 70, image: "https://source.unsplash.com/800x600/?chotpoti" },

    // === SANDWICHES & BURGERS ===
    { id: 53, name: "Chicken Sandwich", category: "sandwiches", price: 90, image: "https://source.unsplash.com/800x600/?chicken-sandwich" },
    { id: 54, name: "Egg Sandwich", category: "sandwiches", price: 70, image: "https://source.unsplash.com/800x600/?egg-sandwich" },
    { id: 55, name: "Chicken Egg Club", category: "sandwiches", price: 160, image: "https://source.unsplash.com/800x600/?club-sandwich" },
    { id: 56, name: "Chicken Cheese Burger", category: "sandwiches", price: 120, image: "https://source.unsplash.com/800x600/?cheeseburger" },
    { id: 57, name: "Chicken Mayo Burger", category: "sandwiches", price: 150, image: "https://source.unsplash.com/800x600/?burger" },
    { id: 58, name: "Chicken Shawarma", category: "sandwiches", price: 120, image: "https://source.unsplash.com/800x600/?shawarma" },

    // === RAMEN & CHOWMEIN ===
    { id: 59, name: "Chicken Ramen", category: "ramen", price: 150, image: "https://source.unsplash.com/800x600/?ramen" },
    { id: 60, name: "Sausage Ramen", category: "ramen", price: 120, image: "https://source.unsplash.com/800x600/?ramen" },
    { id: 61, name: "Mixed Chowmein", category: "ramen", price: 90, image: "https://source.unsplash.com/800x600/?chowmein" }
  ],
  social: {
    facebook: "https://facebook.com/JuicyNSmoothie",
    instagram: "https://instagram.com/juicy_nsmoothie",
    twitter: "https://twitter.com/juicynsmoothie"
  },
  sabrware: {
    name: "SabrWare",
    tagline: "Protected by SabrWare",
    website: "https://sabrware.com"
  },
  developer: {
    linkedin: "https://www.linkedin.com/in/salah-uddin-selim-167464257?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    instagram: "https://www.instagram.com/selimsalahuddin/"
  }
}

const DATA_URL_KEY = 'jns_data_url'

export function getData() {
  try {
    const stored = localStorage.getItem('jns_data')
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultData, ...parsed, menu: parsed.menu || defaultData.menu, categories: parsed.categories || defaultData.categories }
    }
  } catch (e) { /* ignore */ }
  return defaultData
}

export function saveData(data) {
  try {
    localStorage.setItem('jns_data', JSON.stringify(data))
    return true
  } catch (e) { return false }
}

export function resetData() {
  localStorage.removeItem('jns_data')
  localStorage.removeItem(DATA_URL_KEY)
}

export function getDataUrl() {
  return localStorage.getItem(DATA_URL_KEY)
}

export function setDataUrl(url) {
  if (url) localStorage.setItem(DATA_URL_KEY, url)
  else localStorage.removeItem(DATA_URL_KEY)
}

export function exportDataAsJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'menu-data.json'
  a.click()
  URL.revokeObjectURL(url)
}

export default defaultData
