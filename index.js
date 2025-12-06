import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { Card } from "./modelos/Card.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conexión a DB
connectDB();

// Rutas
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

app.post("/cards", async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(201).json({ message: "Card created successfully", data: card });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating card");
  }
});

// Enviar datos
app.post("/send", (req, res) => {
  const { user, email } = req.body;
  console.log(`Datos recibidos: ${user} - ${email}`);
  res.status(200).send("Data recibida correctamente");
});

// Rutas CRUD
app.get("/getAllCards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving cards");
  }
});

app.get("/getCard/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.status(200).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving card");
  }
});

app.put("/updateAllcards/:id", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedCard) return res.status(404).json({ message: "Card not found" });

    res.status(200).json({
      message: "Card updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating card" });
  }
});

app.patch("/updateCard/:id", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCard) return res.status(404).json({ message: "Card not found" });

    res.status(200).json({
      message: "Card updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating card" });
  }
});

app.patch("/updateLike/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    card.like = !card.like;
    await card.save();

    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling like" });
  }
});

app.delete("/delateCards/:id", async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);

    if (!deletedCard) return res.status(404).json({ message: "Card not found" });

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting card" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor ejecutándose en http://localhost:" + PORT);
});
