require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Medication = require("../models/Medication");

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");

    // Clear existing data
    await User.deleteMany({});
    await Medication.deleteMany({});
    console.log("Existing data cleared!");

    // Seed Users
    const users = [
      {
        name: "Admin",
        email: "admin@example.com",
        password: "Admin123!",
        role: "admin",
        store: "Main Clinic",
      },
      {
        name: "Manager",
        email: "manager@example.com",
        password: "Manager123!",
        role: "inventoryManager",
        store: "Main Clinic",
      },
      {
        name: "Clerk",
        email: "clerk@example.com",
        password: "Clerk123!",
        role: "clerk",
        store: "Main Clinic",
      },
    ];

    await User.create(users);
    console.log("Users seeded!");

    // Seed Medications
    const medications = [
      {
        name: "Ibuprofen",
        batchCode: "AX12345",
        expirationDate: new Date("2024-12-31"),
        type: "Antiinflammatory",
      },
      {
        name: "Amoxicillin",
        batchCode: "BX67890",
        expirationDate: new Date("2025-06-30"),
        type: "Antibiotic",
      },
      {
        name: "Acetaminophen",
        batchCode: "CX13579",
        expirationDate: new Date("2024-03-15"),
        type: "Analgesic",
      },
    ];

    await Medication.create(medications);
    console.log("Medications seeded!");

    // Close
    mongoose.connection.close();
    console.log("Database seeding completed and connection closed!");
  } catch (error) {
    console.error("Error seeding the database:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
