import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  ArrowRight,
  ChevronDown,
  Circle,
  Eraser,
  Pencil,
  Square,
  Star,
  Triangle,
  Copy,
  Users,
} from "lucide-react";
import Toolbar from "./Toolbar";

const SOCKET_SERVER = "http://localhost:3001"; 
let socket;

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [startPos, setStartPos] = useState(null);
  const [savedCanvas, setSavedCanvas] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const isDrawingRef = useRef(false);

  // Initialize room ID from URL or create new one
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let room = urlParams.get("room");

    if (!room) {
      room = generateRoomId();
      window.history.pushState({}, "", `?room=${room}`);
    }

    setRoomId(room);
  }, []);

  // Socket connection and listeners
  useEffect(() => {
    if (!roomId) return;

    socket = io(SOCKET_SERVER);

    socket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      socket.emit("join-room", roomId);
    });

    socket.on("user-count", (count) => {
      setConnectedUsers(count);
    });

    socket.on("canvas-state", (imageData) => {
      if (imageData && ctxRef.current && canvasRef.current) {
        const img = new Image();
        img.onload = () => {
          ctxRef.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctxRef.current.drawImage(img, 0, 0);
        };
        img.src = imageData;
      }
    });

    socket.on("draw-start", (data) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      if (data.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.brushSize;
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
    });

    socket.on("drawing", (data) => {
      const ctx = ctxRef.current;
      if (!ctx || isDrawingRef.current) return;

      if (data.tool === "brush" || data.tool === "eraser") {
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
      }
    });

    socket.on("draw-end", () => {
      // Drawing ended by another user
    });

    socket.on("draw-shape", (data) => {
      const ctx = ctxRef.current;
      if (!ctx || isDrawingRef.current) return;

      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.brushSize;
      drawShapeFromData(data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = selectedColor;
    }
  }, [selectedColor]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 80;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctxRef.current = ctx;

    saveToHistory();  
  }, []);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const copyRoomLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const emitCanvasState = () => {
    if (canvasRef.current && socket) {
      const imageData = canvasRef.current.toDataURL();
      socket.emit("canvas-state", { roomId, imageData });
    }
  };

  const saveToHistory = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const imageData = canvas.toDataURL();
  setHistory((prev) => {
    const newHistory = prev.slice(0, historyStep + 1);
    return [...newHistory, imageData];
  });
  setHistoryStep((prev) => prev + 1);
};

const undo = () => {
  if (historyStep > 0) {
    const newStep = historyStep - 1;
    setHistoryStep(newStep);
    restoreFromHistory(history[newStep]);
  }
};

const redo = () => {
  if (historyStep < history.length - 1) {
    const newStep = historyStep + 1;
    setHistoryStep(newStep);
    restoreFromHistory(history[newStep]);
  }
};

const restoreFromHistory = (imageData) => {
  const canvas = canvasRef.current;
  const ctx = ctxRef.current;
  if (!canvas || !ctx) return;

  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    emitCanvasState();
  };
  img.src = imageData;
};

  const startDrawing = (e) => {
    const pos = getMousePos(e);
    isDrawingRef.current = true;

    if (selectedTool === "brush" || selectedTool === "eraser") {
      if (selectedTool === "eraser") {
        ctxRef.current.globalCompositeOperation = "destination-out";
      } else {
        ctxRef.current.globalCompositeOperation = "source-over";
      }

      ctxRef.current.beginPath();
      ctxRef.current.moveTo(pos.x, pos.y);
      setIsDrawing(true);

      if (socket) {
        socket.emit("draw-start", {
          roomId,
          x: pos.x,
          y: pos.y,
          tool: selectedTool,
          color: selectedColor,
          brushSize: brushSize,
        });
      }
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

      if (socket) {
        socket.emit("drawing", {
          roomId,
          x: pos.x,
          y: pos.y,
          tool: selectedTool,
          color: selectedColor,
          brushSize: brushSize,
        });
      }
      return;
    }

    if (!startPos) return;
    ctxRef.current.putImageData(savedCanvas, 0, 0);
    drawShape(startPos, pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    isDrawingRef.current = false;

    if (selectedTool === "brush" || selectedTool === "eraser") {
      if (socket) {
        socket.emit("draw-end", { roomId });
        emitCanvasState();
      }
      saveToHistory();
    }

    if (selectedTool !== "brush" && selectedTool !== "eraser" && startPos) {
      const pos = getMousePos(event);
      if (socket) {
        socket.emit("draw-shape", {
          roomId,
          tool: selectedTool,
          startX: startPos.x,
          startY: startPos.y,
          endX: pos.x,
          endY: pos.y,
          color: selectedColor,
          brushSize: brushSize,
        });
      }
      setStartPos(null);
      saveToHistory();
    }
  };

  const handleToolChange = (tool) => {
    setSelectedTool(tool);
  };

  const drawShape = (start, end) => {
    const ctx = ctxRef.current;
    ctx.beginPath();

    switch (selectedTool) {
      case "rectangle":
        ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
        break;
      case "circle":
        const radius = Math.hypot(end.x - start.x, end.y - start.y);
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
        break;
      case "triangle":
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineTo(start.x * 2 - end.x, end.y);
        ctx.closePath();
        break;
      case "arrow":
        drawArrow(ctx, start.x, start.y, end.x, end.y);
        break;
      case "star":
        drawStar(ctx, start.x, start.y, end.x - start.x);
        break;
      default:
        break;
    }

    ctx.stroke();
  };

  const drawShapeFromData = (data) => {
    const ctx = ctxRef.current;
    ctx.beginPath();

    const start = { x: data.startX, y: data.startY };
    const end = { x: data.endX, y: data.endY };

    switch (data.tool) {
      case "rectangle":
        ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
        break;
      case "circle":
        const radius = Math.hypot(end.x - start.x, end.y - start.y);
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
        break;
      case "triangle":
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineTo(start.x * 2 - end.x, end.y);
        ctx.closePath();
        break;
      case "arrow":
        drawArrow(ctx, start.x, start.y, end.x, end.y);
        break;
      case "star":
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
      <Toolbar
        selectedTool={selectedTool}
        onToolChange={handleToolChange}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        onUndo={undo} 
        onRedo={redo} 
        canUndo={historyStep > 0} 
        canRedo={historyStep < history.length - 1} 
      />

      <div style={{ flex: 1, position: "relative" }}>
        <div style={headerStyle}>
          <div style={connectionStatusStyle}>
            <div
              style={{
                ...statusDotStyle,
                backgroundColor: isConnected ? "#10b981" : "#ef4444",
              }}
            />
            <span style={statusTextStyle}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div style={usersCountStyle}>
            <Users size={18} color="#666" />
            <span>{connectedUsers} online</span>
          </div>

          <button onClick={copyRoomLink} style={copyButtonStyle}>
            <Copy size={18} />
            {showCopied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onMouseUp={stopDrawing}
          style={{
            display: "block",
            width: "100%",
            height: "calc(100% - 60px)",
          }}
        />
      </div>
    </div>
  );
};

export default Whiteboard;

// All styles remain exactly the same
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

const headerStyle = {
  height: "60px",
  backgroundColor: "#f9fafb",
  borderBottom: "2px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 20px",
  gap: "20px",
};

const connectionStatusStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const statusDotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  animation: "pulse 2s infinite",
};

const statusTextStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
};

const usersCountStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#666",
};

const copyButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s",
};