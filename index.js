import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { Card } from "./models/Card.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conectar BD
connectDB();

// ------------------------------
// TEST ROUTES
// ------------------------------
app.get("/hola", (req, res) => {
  res.status(200).send("hello world from server!");
});

app.post("/send", (req, res) => {
  const { user, email } = req.body;
  console.log("Datos recibidos:", user, email);
  res.status(200).send("Data received successfully");
});

// ------------------------------
// CRUD PRINCIPAL
// ------------------------------

// CREATE
app.post("/createCard", async (req, res) => {
  try {
    const card = await Card.create(req.body);
    console.log(card);
    res.status(201).json({
      message: "Card created successfully",
      data: card,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error creating card" });
  }
});

// CREATE (por compatibilidad con tu ruta anterior)
app.post("/cards", async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(201).json({
      message: "Card created successfully",
      data: card,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL
app.get("/getAllCards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving cards");
  }
});

// READ BY ID
app.get("/getCard/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving card");
  }
});

// UPDATE FULL
app.put("/updateAllcards/:id", async (req, res) => {
  try {
    const updated = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({
      message: "Card updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating card" });
  }
});

// UPDATE PARTIAL
app.patch("/updateCard/:id", async (req, res) => {
  try {
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updated = await Card.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({
      message: "Card updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating card",
      error: error.message,
    });
  }
});

// DELETE (CORREGIDO)
app.delete("/deleteCard/:id", async (req, res) => {
  try {
    const deleted = await Card.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting card" });
  }
});

// LIKE TOGGLE
app.patch("/updateLike/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    card.like = !card.like;
    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE INFO
app.get("/review", (req, res) => {
  res.status(200).send(`
    Endpoints disponibles:
    - POST /cards → Crear tarjeta
    - POST /createCard → Crear tarjeta
    - GET /getAllCards → Obtener todas las tarjetas
    - GET /getCard/:id → Obtener tarjeta por ID
    - PUT /updateAllcards/:id → Actualización completa
    - PATCH /updateCard/:id → Actualización parcial
    - PATCH /updateLike/:id → Cambiar like
    - DELETE /deleteCard/:id → Eliminar tarjeta
  `);
});

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

