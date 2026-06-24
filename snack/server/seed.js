/**
 * Seed script for Snack Point
 * Run: node seed.js
 */

const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')

dotenv.config({ path: path.join(__dirname, '.env') })

const User = require('./models/User')
const MenuItem = require('./models/MenuItem')
const Order = require('./models/Order')

const users = [
  { name: 'Admin User', email: 'admin@snackpoint.com', password: 'admin123', role: 'admin' },
  { name: 'Chef Rajan', email: 'cook@snackpoint.com', password: 'cook123', role: 'cook' },
  { name: 'Demo Customer', email: 'customer@snackpoint.com', password: 'customer123', role: 'customer' },
]

const menuItems = [
  // Burgers
  { name: 'Classic Beef Burger', description: 'Juicy beef patty with fresh lettuce, tomato, and our secret sauce', category: 'Burgers', price: 199, image: '/images/burger-classic.png', isVeg: false, isBestseller: true, quantity: 50 },
  { name: 'Spicy Chicken Burger', description: 'Crispy fried chicken with jalapeños, cheese, and sriracha mayo', category: 'Burgers', price: 219, image: '/images/burger-spicy.png', isVeg: false, isBestseller: true, quantity: 40 },
  { name: 'Paneer Tikka Burger', description: 'Grilled paneer tikka with mint chutney and crispy onions', category: 'Burgers', price: 179, image: '/images/burger-veggie.png', isVeg: true, quantity: 35 },
  { name: 'Double Smash Burger', description: 'Double smashed patties with American cheese, pickles, and mustard', category: 'Burgers', price: 269, image: '/images/burger-double.png', isVeg: false, isBestseller: true, quantity: 30 },
  // Wraps
  { name: 'Crispy Chicken Wrap', description: 'Crispy chicken strips, coleslaw, and chipotle sauce in a soft tortilla', category: 'Wraps', price: 189, image: '/images/wrap-chicken.png', isVeg: false, quantity: 40 },
  { name: 'Paneer Tikka Wrap', description: 'Spiced paneer, bell peppers, onions, and mint yogurt in a whole wheat wrap', category: 'Wraps', price: 169, image: '/images/wrap-paneer.png', isVeg: true, quantity: 35 },
  // Fries
  { name: 'Loaded Cheese Fries', description: 'Crispy fries loaded with melted cheddar, jalapeños, and sour cream', category: 'Fries', price: 149, image: '/images/fries-loaded.png', isVeg: true, isBestseller: true, quantity: 60 },
  { name: 'Masala Fries', description: 'Golden fries tossed with Indian spices and tangy chaat masala', category: 'Fries', price: 119, image: '/images/fries-loaded.png', isVeg: true, quantity: 60 },
  { name: 'Peri Peri Fries', description: 'Crispy fries dusted with fiery peri peri seasoning', category: 'Fries', price: 129, image: '/images/fries-peri.png', isVeg: true, quantity: 55 },
  // Drinks
  { name: 'Classic Cola', description: 'Refreshing chilled cola with ice', category: 'Drinks', price: 49, image: '/images/drinks-shake.png', isVeg: true, quantity: 100 },
  { name: 'Mango Shake', description: 'Thick creamy mango milkshake made with real Alphonso mangoes', category: 'Drinks', price: 89, image: '/images/drinks-shake.png', isVeg: true, isBestseller: true, quantity: 50 },
  { name: 'Oreo Shake', description: 'Creamy vanilla shake blended with Oreo cookies and whipped cream', category: 'Drinks', price: 99, image: '/images/drinks-shake.png', isVeg: true, quantity: 40 },
  // Snacks
  { name: 'Crispy Samosa', description: 'Golden crispy samosas stuffed with spiced potatoes and served with mint chutney', category: 'Snacks', price: 49, image: '/images/snacks-samosa.png', isVeg: true, isBestseller: true, quantity: 60 },
  { name: 'Grilled Sandwich', description: 'Toasted sandwich with cheese, veggies, and herb butter', category: 'Snacks', price: 99, image: '/images/snacks-sandwich.jpg', isVeg: true, quantity: 40 },
  { name: 'Chicken Nuggets', description: '8 pieces of golden crispy chicken nuggets with dipping sauce', category: 'Snacks', price: 159, image: '/images/burger-classic.png', isVeg: false, quantity: 45 },
  // Desserts
  { name: 'Chocolate Lava Brownie', description: 'Warm gooey chocolate brownie with vanilla ice cream', category: 'Desserts', price: 119, image: '/images/drinks-shake.png', isVeg: true, quantity: 30 },
  { name: 'Ice Cream Sundae', description: 'Three scoops of premium ice cream with chocolate syrup and cherries', category: 'Desserts', price: 99, image: '/images/drinks-shake.png', isVeg: true, quantity: 35 },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      MenuItem.deleteMany({}),
      Order.deleteMany({}),
    ])
    console.log('Cleared existing data')

    // Create users
    const createdUsers = await User.insertMany(
      await Promise.all(users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 12),
      })))
    )
    console.log(`Created ${createdUsers.length} users`)

    // Create menu items
    const createdItems = await MenuItem.insertMany(menuItems)
    console.log(`Created ${createdItems.length} menu items`)

    console.log('\n✅ Database seeded successfully!')
    console.log('\n📋 Test Accounts:')
    console.log('  Admin:    admin@snackpoint.com    / admin123')
    console.log('  Cook:     cook@snackpoint.com     / cook123')
    console.log('  Customer: customer@snackpoint.com / customer123')

    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  }
}

seed()
