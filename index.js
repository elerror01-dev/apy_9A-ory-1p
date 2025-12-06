import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { cards } from "./models/cards.js";
import cors from "cors";

app.use(cors({
  origin: "*", // O si quieres limitarlo: ["http://localhost:5173"]
  methods: "GET,POST,PUT,PATCH,DELETE",
  allowedHeaders: "Content-Type, Authorization",
}));

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.post("/createCard", async (req, res) => {
  try {
    const card = await cards.create(req.body);
    res.status(201).json({
      message: "Card created successfully!",
      data: card,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/addCard", async (req, res) => {
  try {
    const newCard = new cards(req.body);
    await newCard.save();
    res.status(201).json({
      message: "Card added successfully!",
      data: newCard,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/getAllCards", async (req, res) => {
  try {
    const data = await cards.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/getCard/:id", async (req, res) => {
  try {
    const cardData = await cards.findById(req.params.id);
    if (!cardData) return res.status(404).send("Card not found");
    res.status(200).json(cardData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/deleteCard/:id", async (req, res) => {
  try {
    const deletedCard = await cards.findByIdAndDelete(req.params.id);
    if (!deletedCard) return res.status(404).send("Card not found");
    res.status(200).send("Card deleted successfully!");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/updateCard/:id", async (req, res) => {
  try {
    const updatedCard = await cards.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      overwrite: true,
    });
    if (!updatedCard) return res.status(404).send("Card not found");
    res.status(200).json({
      message: "Card updated (PUT) successfully!",
      data: updatedCard,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch("/updateCard/:id", async (req, res) => {
  try {
    const updatedCard = await cards.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCard) return res.status(404).send("Card not found");
    res.status(200).json({
      message: "Card updated (PATCH) successfully!",
      data: updatedCard,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/review", (req, res) => {
  const endpoints = `
GemPoints API Endpoints:
-------------------------------------
POST   /createCard
POST   /addCard
GET    /getAllCards
GET    /getCard/:id
PUT    /updateCard/:id
PATCH  /updateCard/:id
DELETE /deleteCard/:id
GET    /review
-------------------------------------
`;
  res.type("text/plain").send(endpoints);
});

app.get("/hola", (req, res) => res.status(200).send("Hello world from the server!"));
app.get("/adios", (req, res) => res.status(200).send("Goodbye world from the server!"));
app.post("/send", (req, res) => {
  const { user, email } = req.body;
  console.log("Datos recibidos:", user, email);
  res.status(200).send("Data received successfully!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));
