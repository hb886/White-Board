// import React, { useEffect, useRef, useState } from "react";
// import Toolbar from "./Toolbar";

// const Whiteboard = () => {
//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);

//   const [isDrawing, setIsDrawing] = useState(false);
//   const [selectedTool, setSelectedTool] = useState("brush");
//   const [selectedColor, setSelectedColor] = useState('#000000')
//   const [brushSize, setBrushSize] = useState(3)
//   const [startPos, setStartPos] = useState(null)
//   const [savedCanvas, setSavedCanvas] = useState(null)
//   const [showShapes, setShowShapes] = useState(false);


//    useEffect(() => {
//     if (ctxRef.current) {
//       ctxRef.current.strokeStyle = selectedColor
//     }
//   }, [selectedColor])

//   useEffect(() => {
//     if(ctxRef.current){
//       ctxRef.current.lineWidth = brushSize
//     }
//   },[brushSize])

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     canvas.width = window.innerWidth - 80;
//     canvas.height = window.innerHeight;

//     const ctx = canvas.getContext("2d");
//     ctx.lineCap = "round";
//     ctx.strokeStyle = selectedColor;
//     ctx.lineWidth = brushSize;
//     ctxRef.current = ctx;
//   }, []);

//   const startDrawing = (e) => {
//   const pos = getMousePos(e);

//   // If brush or eraser
//   if (selectedTool === "brush" || selectedTool === "eraser") {
//     if (selectedTool === "eraser") {
//       ctxRef.current.globalCompositeOperation = "destination-out";
//     } else {
//       ctxRef.current.globalCompositeOperation = "source-over";
//     }

//     ctxRef.current.beginPath();
//     ctxRef.current.moveTo(pos.x, pos.y);
//     setIsDrawing(true);
//     return;
//   }

//   // SHAPE MODE
//   setStartPos(pos);

//   // Save canvas before shape preview
//   const canvas = canvasRef.current;
//   const ctx = ctxRef.current;
//   setSavedCanvas(ctx.getImageData(0, 0, canvas.width, canvas.height));
// };

//   const draw = (e) => {
//   const pos = getMousePos(e);

//   // BRUSH / ERASER
//   if (selectedTool === "brush" || selectedTool === "eraser") {
//     if (!isDrawing) return;
//     ctxRef.current.lineTo(pos.x, pos.y);
//     ctxRef.current.stroke();
//     return;
//   }

//   // SHAPES
//   if (!startPos) return;

//   ctxRef.current.putImageData(savedCanvas, 0, 0);
//   drawShape(startPos, pos);
// };


// const stopDrawing = () => {
//   setIsDrawing(false);

//   if (selectedTool !== "brush" && selectedTool !== "eraser") {
//     setStartPos(null);
//   }
// };


//   const handleToolChange = (tool) => {
//     setSelectedTool(tool);
//     console.log("Tool changed to:", tool); // Could add extra logic here
//   };

//   const drawShape = (start, end) => {
//     const ctx = ctxRef.current
//     ctx.beginPath()

//     switch (selectedTool) {
//       case 'rectangle':
//         ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y)
//         break

//       case 'circle':
//         const radius = Math.hypot(end.x - start.x, end.y - start.y)
//         ctx.arc(start.x, start.y, radius, 0, Math.PI * 2)
//         break

//       case 'triangle':
//         ctx.moveTo(start.x, start.y)
//         ctx.lineTo(end.x, end.y)
//         ctx.lineTo(start.x * 2 - end.x, end.y)
//         ctx.closePath()
//         break

//       case 'arrow':
//         drawArrow(ctx, start.x, start.y, end.x, end.y)
//         break

//       case 'star':
//         drawStar(ctx, start.x, start.y, end.x - start.x)
//         break

//       default:
//         break
//     }

//     ctx.stroke()
//   }

//   const drawArrow = (ctx, x1, y1, x2, y2) => {
//     const headlen = 15
//     const angle = Math.atan2(y2 - y1, x2 - x1)

//     ctx.moveTo(x1, y1)
//     ctx.lineTo(x2, y2)

//     ctx.lineTo(
//       x2 - headlen * Math.cos(angle - Math.PI / 6),
//       y2 - headlen * Math.sin(angle - Math.PI / 6)
//     )

//     ctx.moveTo(x2, y2)
//     ctx.lineTo(
//       x2 - headlen * Math.cos(angle + Math.PI / 6),
//       y2 - headlen * Math.sin(angle + Math.PI / 6)
//     )
//   }

//   const drawStar = (ctx, cx, cy, size) => {
//     const spikes = 5
//     const outerRadius = Math.abs(size)
//     const innerRadius = outerRadius / 2

//     let rot = (Math.PI / 2) * 3
//     let step = Math.PI / spikes

//     ctx.moveTo(cx, cy - outerRadius)

//     for (let i = 0; i < spikes; i++) {
//       let x = cx + Math.cos(rot) * outerRadius
//       let y = cy + Math.sin(rot) * outerRadius
//       ctx.lineTo(x, y)
//       rot += step

//       x = cx + Math.cos(rot) * innerRadius
//       y = cy + Math.sin(rot) * innerRadius
//       ctx.lineTo(x, y)
//       rot += step
//     }

//     ctx.closePath()
//   }

//   const getMousePos = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     return {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };
//   };

//   return (
//     <div style={containerStyle}>
//       <Toolbar 
//       selectedTool={selectedTool} 
//       onToolChange={handleToolChange}
//       selectedColor={selectedColor}
//       onColorChange={setSelectedColor}
//       brushSize={brushSize}
//       onBrushSizeChange={setBrushSize}
//       />

//       <canvas
//         ref={canvasRef}
//         onMouseDown={startDrawing}
//         onMouseMove={draw}
//         onMouseLeave={stopDrawing}
//         onMouseUp={stopDrawing}
//         style={{ flex: 1, display: "block" }}
//       />
//     </div>
//   );
// };

// export default Whiteboard;

// const containerStyle = {
//   width: "100vw",
//   height: "100vh",
//   backgroundColor: "white",
//   backgroundImage: `
//       linear-gradient(#eee 1px, transparent 1px),
//       linear-gradient(90deg, #eee 1px, transparent 1px)
//     `,
//   backgroundSize: "100px 100px",
//   display: "flex",
// };


import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Circle, Eraser, Pencil, Square, Star, Triangle, ChevronDown } from 'lucide-react';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [startPos, setStartPos] = useState(null);
  const [savedCanvas, setSavedCanvas] = useState(null);
  const [showShapes, setShowShapes] = useState(false);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = selectedColor;
    }
  }, [selectedColor]);

  useEffect(() => {
    if(ctxRef.current){
      ctxRef.current.lineWidth = brushSize;
    }
  },[brushSize]);

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

    setStartPos(pos);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    setSavedCanvas(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const draw = (e) => {
    const pos = getMousePos(e);

    if (selectedTool === "brush" || selectedTool === "eraser") {
      if (!isDrawing) return;
      ctxRef.current.lineTo(pos.x, pos.y);
      ctxRef.current.stroke();
      return;
    }

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
  };

  const drawShape = (start, end) => {
    const ctx = ctxRef.current;
    ctx.beginPath();

    switch (selectedTool) {
      case 'rectangle':
        ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
        break;

      case 'circle':
        const radius = Math.hypot(end.x - start.x, end.y - start.y);
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
        break;

      case 'triangle':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineTo(start.x * 2 - end.x, end.y);
        ctx.closePath();
        break;

      case 'arrow':
        drawArrow(ctx, start.x, start.y, end.x, end.y);
        break;

      case 'star':
        drawStar(ctx, start.x, start.y, end.x - start.x);
        break;

      default:
        break;
    }

    ctx.stroke();
  };

  const drawArrow = (ctx, x1, y1, x2, y2) => {
    const headlen = 15;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.lineTo(
      x2 - headlen * Math.cos(angle - Math.PI / 6),
      y2 - headlen * Math.sin(angle - Math.PI / 6)
    );

    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headlen * Math.cos(angle + Math.PI / 6),
      y2 - headlen * Math.sin(angle + Math.PI / 6)
    );
  };

  const drawStar = (ctx, cx, cy, size) => {
    const spikes = 5;
    const outerRadius = Math.abs(size);
    const innerRadius = outerRadius / 2;

    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerRadius;
      let y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.closePath();
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
      <div style={toolbarStyle}>
        <h3 style={titleStyle}>Tools</h3>

        <button
          onClick={() => handleToolChange("brush")}
          style={{
            ...toolButtonStyle,
            backgroundColor: selectedTool === "brush" ? "#3b82f6" : "white",
            color: selectedTool === "brush" ? "white" : "#333",
          }}
          title="Brush"
        >
          <Pencil size={24} />
        </button>

        <button
          onClick={() => handleToolChange("eraser")}
          style={{
            ...toolButtonStyle,
            backgroundColor: selectedTool === "eraser" ? "#3b82f6" : "white",
            color: selectedTool === "eraser" ? "white" : "#333",
          }}
          title="Eraser"
        >
          <Eraser size={24} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowShapes(!showShapes)}
            style={{
              ...toolButtonStyle,
              backgroundColor: ['rectangle', 'circle', 'triangle', 'arrow', 'star'].includes(selectedTool) ? "#3b82f6" : "white",
              color: ['rectangle', 'circle', 'triangle', 'arrow', 'star'].includes(selectedTool) ? "white" : "#333",
              position: 'relative',
              flexDirection: 'column',
              padding: '4px',
            }}
            title="Shapes"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              {selectedTool === 'rectangle' && <Square size={20} />}
              {selectedTool === 'circle' && <Circle size={20} />}
              {selectedTool === 'triangle' && <Triangle size={20} />}
              {selectedTool === 'arrow' && <ArrowRight size={20} />}
              {selectedTool === 'star' && <Star size={20} />}
              {!['rectangle', 'circle', 'triangle', 'arrow', 'star'].includes(selectedTool) && (
                <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', width: '32px' }}>
                  <Square size={8} />
                  <Circle size={8} />
                  <Triangle size={8} />
                  <Star size={8} />
                </div>
              )}
            </div>
            <ChevronDown size={10} style={{ marginTop: '2px' }} />
          </button>

          {showShapes && (
            <div style={dropdownStyle} onMouseLeave={() => setShowShapes(false)}>
              <button
                onClick={() => {
                  handleToolChange('rectangle');
                  setShowShapes(false);
                }}
                style={{
                  ...dropdownItemStyle,
                  backgroundColor: selectedTool === 'rectangle' ? '#3b82f6' : 'white',
                  color: selectedTool === 'rectangle' ? 'white' : '#333',
                }}
                title="Rectangle"
              >
                <Square size={24} />
              </button>

              <button
                onClick={() => {
                  handleToolChange('circle');
                  setShowShapes(false);
                }}
                style={{
                  ...dropdownItemStyle,
                  backgroundColor: selectedTool === 'circle' ? '#3b82f6' : 'white',
                  color: selectedTool === 'circle' ? 'white' : '#333',
                }}
                title="Circle"
              >
                <Circle size={24} />
              </button>

              <button
                onClick={() => {
                  handleToolChange('triangle');
                  setShowShapes(false);
                }}
                style={{
                  ...dropdownItemStyle,
                  backgroundColor: selectedTool === 'triangle' ? '#3b82f6' : 'white',
                  color: selectedTool === 'triangle' ? 'white' : '#333',
                }}
                title="Triangle"
              >
                <Triangle size={24} />
              </button>

              <button
                onClick={() => {
                  handleToolChange('arrow');
                  setShowShapes(false);
                }}
                style={{
                  ...dropdownItemStyle,
                  backgroundColor: selectedTool === 'arrow' ? '#3b82f6' : 'white',
                  color: selectedTool === 'arrow' ? 'white' : '#333',
                }}
                title="Arrow"
              >
                <ArrowRight size={24} />
              </button>

              <button
                onClick={() => {
                  handleToolChange('star');
                  setShowShapes(false);
                }}
                style={{
                  ...dropdownItemStyle,
                  backgroundColor: selectedTool === 'star' ? '#3b82f6' : 'white',
                  color: selectedTool === 'star' ? 'white' : '#333',
                }}
                title="Star"
              >
                <Star size={24} />
              </button>
            </div>
          )}
        </div>

        <div style={dividerStyle}></div>

        <div style={colorPickerContainerStyle}>
          <input
            type="color"
            value={selectedColor}
            title="Choose Color"
            style={colorInputStyle}
            onChange={(e) => setSelectedColor(e.target.value)}
          />
        </div>

        <div style={dividerStyle}></div>
        <label style={labelStyle}>Size: {brushSize}px</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          style={sliderStyle}
        />
      </div>

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

const toolbarStyle = {
  width: "80px",
  backgroundColor: "#f3f4f6",
  borderRight: "2px solid #e5e7eb",
  padding: "20px 10px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  alignItems: "center",
};

const titleStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#374151",
  marginBottom: "10px",
};

const toolButtonStyle = {
  width: "50px",
  height: "50px",
  border: "2px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
  backgroundColor: "white",
};

const dividerStyle = {
  width: "60px",
  height: "2px",
  backgroundColor: "#d1d5db",
  margin: "10px 0",
};

const colorPickerContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

const colorInputStyle = {
  width: "50px",
  height: "50px",
  border: "2px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  padding: "5px",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#374151",
};

const sliderStyle = {
  width: "50px",
  cursor: "pointer",
  accentColor: "#3b82f6",
};

const dropdownStyle = {
  position: 'absolute',
  left: '60px',
  top: '0',
  backgroundColor: '#f3f4f6',
  border: '2px solid #d1d5db',
  borderRadius: '8px',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  zIndex: 1000,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const dropdownItemStyle = {
  width: "50px",
  height: "50px",
  border: "2px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
  backgroundColor: "white",
};