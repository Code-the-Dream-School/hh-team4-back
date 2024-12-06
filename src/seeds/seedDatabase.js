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
        genericName: "Acetaminophen",
        lot: "BX67890",
        expirationDate: new Date("2025-06-30"),
        class: "Antiinflammatory",
        store: "Main Pharmacy",
        ndcNumber: "12345-6789",
        createdBy: "Jay",
        threshold: 50,
        quantity: 200,
      },
      {
        name: "Aspirin",
        genericName: "Acetylsalicylic acid",
        lot: "BX67891",
        expirationDate: new Date("2025-08-15"),
        class: "Analgesic",
        store: "Central Pharmacy",
        ndcNumber: "54321-9876",
        createdBy: "Jay",
        threshold: 30,
        quantity: 150,
      },
      {
        name: "Metformin",
        genericName: "Metformin Hydrochloride",
        lot: "BX67892",
        expirationDate: new Date("2026-02-28"),
        class: "Antidiabetic",
        store: "Downtown Pharmacy",
        ndcNumber: "23456-7890",
        createdBy: "Jay",
        threshold: 60,
        quantity: 120,
      },
      {
        name: "Lisinopril",
        genericName: "Lisinopril",
        lot: "BX67893",
        expirationDate: new Date("2026-01-20"),
        class: "Antihypertensive",
        store: "Health Mart Pharmacy",
        ndcNumber: "34567-1234",
        createdBy: "Jay",
        threshold: 40,
        quantity: 180,
      },
      {
        name: "Amoxicillin",
        genericName: "Amoxicillin",
        lot: "BX67894",
        expirationDate: new Date("2025-12-25"),
        class: "Antibiotic",
        store: "Westside Pharmacy",
        ndcNumber: "45678-2345",
        createdBy: "Jay",
        threshold: 100,
        quantity: 500,
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
