const express = require("express");
const PrismaClient = require("@prisma/client");

const prisma = new PrismaClient.PrismaClient();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/games", async (req, res) => {
  const games = await prisma.game.findMany();
  res.json({ status: true, data: games });
});

app.post("/api/games", async (req, res) => {
  try {
    const { game } = req.body;
    await prisma.game.create({ data: { name: game } });
    const games = await prisma.game.findMany();
    res.status(201).json({ status: true, data: games });
  } catch (error) {
    res.status(405).json({ status: false, message: "Game already exists" });
  }
});

app.get("/api/gamerounds", async (req, res) => {
  const games = await prisma.game.findMany();
  res.json({ status: true, data: games });
});

app.post("/api/gamerounds", async (req, res) => {
  try {
    const { game } = req.body;
    await prisma.game.create({ data: { name: game } });
    const games = await prisma.game.findMany();
    res.status(201).json({ status: true, data: games });
  } catch (error) {
    res.status(405).json({ status: false, message: "Game already exists" });
  }
});

app.get("/api/players", async (req, res) => {
  const players = await prisma.player.findMany();
  res.json(players);
});

app.post("/api/players", async (req, res) => {
  try {
    const { email, name } = req.body;
    await prisma.player.create({ data: { email, name } });
    const players = await prisma.player.findMany();
    res.status(201).json({ status: true, data: players });
  } catch (error) {
    res.status(405).json({ status: false, message: "Player already exists" });
  }
});

app.get("/api/player/:id", async (req, res) => {
  const { id } = req.params;
  const player = await prisma.player.findFirst({ where: { id } });
  if (player) {
    res.json({ status: true, data: player });
  } else {
    res.status(404).json({ message: "No such player exists" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
