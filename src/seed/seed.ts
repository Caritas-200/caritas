import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { BeneficiaryForm } from "@/app/lib/definitions";

// Initialize Firebase Admin SDK
const serviceAccount = require("./path/to/your/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com",
});

const db = admin.firestore();

// Function to generate random data
const generateRandomBeneficiary = (): BeneficiaryForm => ({
  id: uuidv4(),
  firstName: "John",
  middleName: "Doe",
  lastName: "Smith",
  mobileNumber: "123-456-7890",
  age: "30",
  address: "123 Main St, Anytown, USA",
  gender: "Male",
  work: "Engineer",
  status: "Unclaimed",
  language: "English",
  religion: "None",
  email: "john.smith@example.com",
  housingCondition: ["Own"],
  casualty: ["None"],
  healthCondition: ["Good"],
  ownershipRentalType: ["Owned"],
  vulnerableGroup: ["None"],
});

const seedDatabase = async () => {
  try {
    const brgyName = "yourBarangayName"; // Adjust as needed
    const beneficiariesCollection = db.collection(
      `barangay/${brgyName}/recipients`
    );

    for (let i = 0; i < 10; i++) {
      const beneficiary = generateRandomBeneficiary();
      await beneficiariesCollection.doc(beneficiary.id).set(beneficiary);
      console.log(`Beneficiary ${beneficiary.id} added successfully.`);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase().then(() => {
  console.log("Database seeding completed.");
  process.exit();
});
