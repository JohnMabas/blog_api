const express = require("express");
const prisma = require("./lib/prisma");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: " Blog API is running",
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({ data: { name, email } });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create user" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not get users" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not get user" });
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not update user",
    });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not delete user" });
  }
});
