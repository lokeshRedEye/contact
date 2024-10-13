const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize the app
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (replace '<your_connection_string>' with your actual MongoDB connection string)
mongoose.connect(
  "mongodb+srv://lokesh78531:Ri8XRP8IAscId2C3@cluster0.kecdd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((error) => console.log("Failed to connect to MongoDB:", error));

// Define the schema
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Create the model
const Contact = mongoose.model("Contact", contactSchema);

// Routes
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/add-contact", async (req, res) => {
  const { name, number } = req.body;
  try {
    const newContact = new Contact({ name, number });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/delete-contact/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Contact.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/update-contact/:id", async (req, res) => {
  const { id } = req.params;
  const { name, number } = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, number },
      { new: true }
    );
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
