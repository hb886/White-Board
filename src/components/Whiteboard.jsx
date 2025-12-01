import React, { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(3)
  const [startPos, setStartPos] = useState(null)
  const [savedCanvas, setSavedCanvas] = useState(null)


   useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = selectedColor
    }
  }, [selectedColor])

  useEffect(() => {
    if(ctxRef.current){
      ctxRef.current.lineWidth = brushSize
    }
  },[brushSize])

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 80;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
  const pos = getMousePos(e);

  // If brush or eraser
  if (selectedTool === "brush" || selectedTool === "eraser") {
    if (selectedTool === "eraser") {
      ctxRef.current.globalCompositeOperation = "destination-out";
    } else {
      ctxRef.current.globalCompositeOperation = "source-over";
    }

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    return;
  }

  // SHAPE MODE
  setStartPos(pos);

  // Save canvas before shape preview
  const canvas = canvasRef.current;
  const ctx = ctxRef.current;
  setSavedCanvas(ctx.getImageData(0, 0, canvas.width, canvas.height));
};

  const draw = (e) => {
  const pos = getMousePos(e);

  // BRUSH / ERASER
  if (selectedTool === "brush" || selectedTool === "eraser") {
    if (!isDrawing) return;
    ctxRef.current.lineTo(pos.x, pos.y);
    ctxRef.current.stroke();
    return;
  }

  // SHAPES
  if (!startPos) return;

  ctxRef.current.putImageData(savedCanvas, 0, 0);
  drawShape(startPos, pos);
};


const stopDrawing = () => {
  setIsDrawing(false);

  if (selectedTool !== "brush" && selectedTool !== "eraser") {
    setStartPos(null);
  }
};


  const handleToolChange = (tool) => {
    setSelectedTool(tool);
    console.log("Tool changed to:", tool); // Could add extra logic here
  };

  const drawShape = (start, end) => {
    const ctx = ctxRef.current
    ctx.beginPath()

    switch (selectedTool) {
      case 'rectangle':
        ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y)
        break

      case 'circle':
        const radius = Math.hypot(end.x - start.x, end.y - start.y)
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2)
        break

      case 'triangle':
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.lineTo(start.x * 2 - end.x, end.y)
        ctx.closePath()
        break

      case 'arrow':
        drawArrow(ctx, start.x, start.y, end.x, end.y)
        break

      case 'star':
        drawStar(ctx, start.x, start.y, end.x - start.x)
        break

      default:
        break
    }

    ctx.stroke()
  }

  const drawArrow = (ctx, x1, y1, x2, y2) => {
    const headlen = 15
    const angle = Math.atan2(y2 - y1, x2 - x1)

    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)

    ctx.lineTo(
      x2 - headlen * Math.cos(angle - Math.PI / 6),
      y2 - headlen * Math.sin(angle - Math.PI / 6)
    )

    ctx.moveTo(x2, y2)
    ctx.lineTo(
      x2 - headlen * Math.cos(angle + Math.PI / 6),
      y2 - headlen * Math.sin(angle + Math.PI / 6)
    )
  }

  const drawStar = (ctx, cx, cy, size) => {
    const spikes = 5
    const outerRadius = Math.abs(size)
    const innerRadius = outerRadius / 2

    let rot = (Math.PI / 2) * 3
    let step = Math.PI / spikes

    ctx.moveTo(cx, cy - outerRadius)

    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerRadius
      let y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }

    ctx.closePath()
  }

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
      brushSize={brushSize}
      onBrushSizeChange={setBrushSize}
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
