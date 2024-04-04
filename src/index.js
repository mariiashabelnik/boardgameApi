const express = require("express");
const PrismaClient = require("@prisma/client");

const prisma = new PrismaClient.PrismaClient();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/gametype", async (req, res) => {
  const games = await prisma.gameType.findMany();
  res.json({ status: true, data: games });
});

app.post("/api/gametype", async (req, res) => {
  try {
    const { gameType } = req.body;
    await prisma.gameType.create({ data: { name: gameType } });
    const games = await prisma.gameType.findMany();
    res.status(201).json({ status: true, data: games });
  } catch (error) {
    res.status(405).json({ status: false, message: "Gametype already exists" });
  }
});

app.patch("/api/gametype/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updateGame = await prisma.gameType.update({
      where: { id },
      data: { name },
    });
    res.json({ updateGame });
  } catch (error) {
    res.json({ msg: "No such gametype", error });
  }
});

app.get("/api/gameround", async (req, res) => {
  const gameRounds = await prisma.gameRound.findMany({
    include: { gameType: true, players: true },
  });
  res.json({ status: true, data: gameRounds });
});

app.post("/api/gameround", async (req, res) => {
  try {
    const { gameTypeId, players } = req.body;
    const gameRound = await prisma.gameRound.create({
      data: {
        gameTypeId: gameTypeId,
        players: { connect: players },
      },
    });
    res.json({ status: true, data: gameRound });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/players", async (req, res) => {
  const players = await prisma.player.findMany({});
  res.json({ status: true, data: players });
});

app.patch("/api/player/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const updateUser = await prisma.player.update({
    where: { id },
    data: { name, email },
  });
  res.json({ updateUser });
});

app.delete("/api/player/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await prisma.player.delete({
      where: { id },
    });
    res.json({ deleteUser });
  } catch (error) {
    res.json({ message: "No such user exists" });
  }
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
