import express from "express";

const app = express();
app.use(express.json());

// Enable CORS for development so the frontend can call this mock server
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  // simple demo credential - accept demo/demo or any email with demo password
  if ((username === "demo" && password === "demo") || password === "demo") {
    return res.json({ token: "fake.jwt.token" });
  }

  return res.status(401).send("Invalid credentials");
});

app.get("/", (_req, res) => res.send("Mock auth server running"));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock auth server listening on http://localhost:${port}`);
});
