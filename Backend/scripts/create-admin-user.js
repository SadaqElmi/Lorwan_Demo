// Script to create an admin user in the database
// Run this after Keycloak setup to create the initial admin user

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    keycloak_id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    first_name: String,
    last_name: String,
    roles: [String],
    organization_ids: [String],
    is_active: { type: Boolean, default: true },
    metadata: Object,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URL ||
        "mongodb://admin:password@localhost:27017/chirpstack_backend?authSource=admin"
    );

    console.log("Connected to MongoDB");

    // Create admin user
    const adminUser = new User({
      keycloak_id: "admin-keycloak", // Replace with actual Keycloak user ID
      username: "admin",
      email: "admin@example.com",
      first_name: "Admin",
      last_name: "User",
      roles: ["admin"],
      organization_ids: [], // Admin has access to all organizations
      is_active: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    if (error.code === 11000) {
      console.log("Admin user already exists");
    } else {
      console.error("Error creating admin user:", error);
    }
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

createAdminUser();
