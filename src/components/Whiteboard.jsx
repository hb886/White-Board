import React, { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [selectedColor, setSelectedColor] = useState('#000000')


   useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = selectedColor
    }
  }, [selectedColor])

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 80;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 3;
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    if (selectedTool === "eraser") {
      ctxRef.current.globalCompositeOperation = "destination-out";
    } else {
      ctxRef.current.globalCompositeOperation = "source-over";
    }

    const pos = getMousePos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    ctxRef.current.lineTo(pos.x, pos.y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleToolChange = (tool) => {
    setSelectedTool(tool);
    console.log("Tool changed to:", tool); // Could add extra logic here
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div style={containerStyle}>
      <Toolbar 
      selectedTool={selectedTool} 
      onToolChange={handleToolChange}
      selectedColor={selectedColor}
      onColorChange={setSelectedColor}
      />

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
        onMouseUp={stopDrawing}
        style={{ flex: 1, display: "block" }}
      />
    </div>
  );
};

export default Whiteboard;

const containerStyle = {
  width: "100vw",
  height: "100vh",
  backgroundColor: "white",
  backgroundImage: `
      linear-gradient(#eee 1px, transparent 1px),
      linear-gradient(90deg, #eee 1px, transparent 1px)
    `,
  backgroundSize: "100px 100px",
  display: "flex",
};
