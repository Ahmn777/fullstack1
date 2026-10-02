import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/public", (req, res) => {
  res.json({
    success: true,
    message: "Публичные данные успешно получены!",
    source: "Backend API"
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "student" && password === "123456") {
    return res.json({
      success: true,
      token: "demo-token-123456",
      user: {
        username: "student",
        role: "student"
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Неверный логин или пароль"
  });
});

app.get("/api/private", (req, res) => {
  const auth = req.headers.authorization;

  if (auth !== "Bearer demo-token-123456") {
    return res.status(401).json({
      success: false,
      message: "Нет авторизации. Сначала выполните вход."
    });
  }

  res.json({
    success: true,
    message: "Защищённые данные успешно получены!",
    secret: "Это данные, доступные только авторизованному пользователю.",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Backend API запущен: http://localhost:${PORT}`);
});
