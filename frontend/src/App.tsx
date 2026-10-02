import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type Result = Record<string, unknown> | null;

function App() {
  const [result, setResult] = useState<Result>(null);
  const [token, setToken] = useState("");

  async function requestPublic() {
    try {
      const response = await fetch(`${API_URL}/public`);
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ success: false, message: "Не удалось подключиться к Backend." });
    }
  }

  async function login() {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "student",
          password: "123456"
        })
      });

      const data = await response.json();

      if (data.token) {
        setToken(data.token);
      }

      setResult(data);
    } catch {
      setResult({ success: false, message: "Не удалось подключиться к Backend." });
    }
  }

  async function requestPrivate() {
    try {
      const response = await fetch(`${API_URL}/private`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ success: false, message: "Не удалось подключиться к Backend." });
    }
  }

  return (
    <main className="container">
      <h1>React + Backend API</h1>
      <p className="subtitle">
        Контрольная точка: связываем Frontend и Backend
      </p>

      <section className="card">
        <h2>1. Публичные данные</h2>
        <p>Проверяет обычный запрос Frontend → Backend.</p>
        <button onClick={requestPublic}>Получить публичные данные</button>
      </section>

      <section className="card">
        <h2>2. Авторизация</h2>
        <p>Используются тестовые данные: student / 123456.</p>
        <button onClick={login}>Войти</button>
        {token && <p className="success">✓ Токен получен</p>}
      </section>

      <section className="card">
        <h2>3. Защищённые данные</h2>
        <p>Доступны после успешной авторизации.</p>
        <button onClick={requestPrivate} disabled={!token}>
          Получить защищённые данные
        </button>
      </section>

      <section className="result">
        <h2>Ответ сервера</h2>
        <pre>{result ? JSON.stringify(result, null, 2) : "Здесь появится ответ API..."}</pre>
      </section>
    </main>
  );
}

export default App;
