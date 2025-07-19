// App.jsx
import React, { useState } from "react";
import SchemaBuilder from "./SchemaBuilder";
import "./styles.css";

function App() {
  const [scopes, setScopes] = useState([0]);

  const addScope = () => {
    setScopes((prev) => [...prev, prev.length]);
  };

  return (
    <div>
      <h1 className="title">JSON Schema Builder</h1>
      {scopes.map((id) => (
        <div key={id} className="container">
          <SchemaBuilder />
        </div>
      ))}
      <button className="add-scope-btn" onClick={addScope}>
        ➕ Add Another JSON Scope
      </button>
    </div>
  );
}

export default App;