import { useState } from "react";
import "./App.css";

function App() {

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Updated Submit (CONNECTED TO BACKEND)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.username || !form.password || (!isLogin && !form.email)) {
      setError("All fields are required!");
      return;
    }

    if (!isLogin && !form.email.includes("@")) {
      setError("Enter valid email!");
      return;
    }

    if (form.password.length < 5) {
      setError("Password must be at least 5 characters!");
      return;
    }

    setError("");

    try {
      const url = isLogin
        ? "http://localhost:5000/login"
        : "http://localhost:5000/signup";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.text();

      // ✅ Proper response handling
      if (data === "Login Successful") {
        alert("✅ Welcome " + form.username);
      } 
      else if (data === "Signup Successful") {
        alert("🎉 Signup Successful! Now Login");
        setIsLogin(true); // switch to login after signup
      } 
      else {
        alert("❌ " + data);
      }

    } catch (err) {
      alert("❌ Server Error");
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />

          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p onClick={() => setIsLogin(!isLogin)} className="toggle">
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>

      </div>
    </div>
  );
}

export default App;
