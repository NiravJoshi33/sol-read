import { useState, useEffect } from "react";

export default () => {
  const [count, setCount] = useState(1);
  const increment = () => setCount((count) => count + 1);

  useEffect(() => {
    console.log("SolRead content mounted");
  }, []);

  return (
    <div id="solread-content">
      <p style={{ marginBottom: "8px" }}>This is React. {count}</p>
      <button
        onClick={increment}
        style={{
          padding: "8px 16px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Increment
      </button>
    </div>
  );
};
