require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Seed Admin User if not exists
    let adminUser = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Created admin user successfully: admin@gmail.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }

    // Read the products.json file
    const filePath = path.join(__dirname, '../src/products.json');
    console.log(`Reading products from: ${filePath}`);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Invalid products.json structure. Expected a "products" array.');
    }

    console.log(`Found ${data.products.length} products to process.`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const p of data.products) {
      const categoryName = p.category;
      if (!categoryName) {
        console.warn(`Product "${p.title}" has no category. Skipping.`);
        skippedCount++;
        continue;
      }

      // Find or create the category in the database
      let categoryDoc = await Category.findOne({ name: categoryName });
      if (!categoryDoc) {
        categoryDoc = await Category.create({ name: categoryName });
        console.log(`Created new category: "${categoryName}"`);
      }

      // Check if product already exists by title
      const existingProduct = await Product.findOne({ title: p.title });
      if (existingProduct) {
        skippedCount++;
        continue;
      }

      // Prepare the product object matching Product.js model
      const newProduct = {
        title: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        thumbnail: p.thumbnail,
        category: categoryDoc._id
      };

      await Product.create(newProduct);
      addedCount++;
    }

    console.log('Seeding completed!');
    console.log(`Added: ${addedCount} products.`);
    console.log(`Skipped (already exists or invalid): ${skippedCount} products.`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
