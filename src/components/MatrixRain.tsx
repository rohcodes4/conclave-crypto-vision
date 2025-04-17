import React, { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");

    c.height = window.innerHeight;
    c.width = window.innerWidth;

    const matrix =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split(
        ""
      );

    const font_size = 14;
    const columns = c.width / font_size;
    const drops = [];

    // Start all at 0 (top), but delay start randomly
    for (let x = 0; x < columns; x += 3) {
      drops[x] = null; // null = not started yet
    }

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.fillStyle = "#00ff00";
      ctx.font = font_size + "px arial";

      for (let i = 0; i < drops.length; i++) {
        // skip unused columns
        if (typeof drops[i] === "undefined") continue;

        // Start a drop randomly
        if (drops[i] === null && Math.random() > 0.975) {
          drops[i] = 0;
        }

        if (drops[i] !== null) {
          const text = matrix[Math.floor(Math.random() * matrix.length)];
          ctx.fillText(text, i * font_size, drops[i] * font_size);

          if (drops[i] * font_size > c.height && Math.random() > 0.975) {
            drops[i] = null;
          } else {
            drops[i]++;
          }
        }
      }
    }

    const interval = setInterval(draw, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        background: "black",
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        position: "fixed",
        zIndex:0
      }}
    />
  );
};

export default MatrixRain;
