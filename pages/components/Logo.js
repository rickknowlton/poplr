import React, { useEffect, useState } from "react";

function AsciiLogo({ darkMode }) {
  const [logo, setLogo] = useState("");

  useEffect(() => {
    fetch("/logo.txt")
      .then((response) => response.text())
      .then((data) => {
        setLogo(data);
      });
  }, []);

  return (
    <pre
      style={{
        fontFamily: "Courier New",
        fontSize: "2px",
        fontWeight: "bold",
        color: darkMode ? "cyan" : "black",
      }}
    >
      {logo}
      <p
        style={{
          fontFamily: "Courier New",
          fontSize: "22px",
          textAlign: "center",
          color: darkMode ? "cyan" : "black",
        }}
      ></p>
    </pre>
  );
}

export default AsciiLogo;
