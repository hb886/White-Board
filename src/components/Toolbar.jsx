import {
  ArrowRight,
  ChevronDown,
  Circle,
  Eraser,
  Palette,
  Pencil,
  Square,
  Star,
  Triangle,
} from "lucide-react";
import React, { useState } from "react";

const Toolbar = ({
  onToolChange,
  selectedTool,
  selectedColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
}) => {
  const [showShapes, setShowShapes] = useState(false);

  const shapes = [
    { name: "circle", icon: Circle, label: "Circle" },
    { name: "rectangle", icon: Square, label: "Rectangle" },
    { name: "arrow", icon: ArrowRight, label: "Arrow" },
    { name: "triangle", icon: Triangle, label: "Triangle" },
    { name: "star", icon: Star, label: "Star" },
  ];

  const isShapeSelected = shapes.some((shape) => shape.name === selectedTool);
  const selectedShape = shapes.find((shape) => shape.name === selectedTool);

  return (
    <div style={toolbarStyle}>
      <h3 style={titleStyle}>Tools</h3>

      <button
        onClick={() => onToolChange("brush")}
        style={{
          ...toolButtonStyle,
          backgroundColor: selectedTool === "brush" ? "#3b82f6" : "white",
          color: selectedTool === "brush" ? "white" : "#333",
          padding: "8px",
        }}
        title="Brush"
      >
        <Pencil size={22} strokeWidth={1.5} />
      </button>

      <button
        onClick={() => onToolChange("eraser")}
        style={{
          ...toolButtonStyle,
          backgroundColor: selectedTool === "eraser" ? "#3b82f6" : "white",
          color: selectedTool === "eraser" ? "white" : "#333",
          padding: "8px",
        }}
        title="Eraser"
      >
        <Eraser size={22} strokeWidth={1.5} />
      </button>

      <div style={dropdownContainerStyle}>
        <button
          onClick={() => setShowShapes(!showShapes)}
          style={{
            ...toolButtonStyle,
            backgroundColor: isShapeSelected ? "#3b82f6" : "white",
            color: isShapeSelected ? "white" : "#333",
            position: "relative",
            flexDirection: "column",
            padding: "5px",
          }}
          title="Shapes"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {selectedShape ? (
              <selectedShape.icon size={24} />
            ) : (
              <Square size={24} />
            )}
          </div>
          <ChevronDown size={14} style={{ marginTop: "2px" }} />
        </button>

        {showShapes && (
          <div style={dropdownMenuStyle}>
            {shapes.map((shape) => {
              const Icon = shape.icon;
              return (
                <button
                  key={shape.name}
                  onClick={() => {
                    onToolChange(shape.name);
                    setShowShapes(false);
                  }}
                  style={{
                    ...dropdownItemStyle,
                    backgroundColor:
                      selectedTool === shape.name ? "#3b82f6" : "white",
                    color: selectedTool === shape.name ? "white" : "#333",
                  }}
                  title={shape.label}
                >
                  <Icon size={24} />
                  <span style={shapeLabelStyle}>{shape.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={dividerStyle}></div>
      <label style={labelStyle}>Pencil & Eraser Size: {brushSize}px</label>
      <input
        type="range"
        min="1"
        max="50"
        value={brushSize}
        onChange={(e) => onBrushSizeChange(Number(e.target.value))}
        style={sliderStyle}
      />

      <div style={dividerStyle}></div>

      <div style={colorPickerContainerStyle}>
        {/* <Palette size={20} color="#666" /> */}
        <input
          type="color"
          value={selectedColor}
          title="Choose Color"
          style={colorInputStyle}
          onChange={(e) => onColorChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Toolbar;

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

const sliderContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  width: "100%",
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: "700",
  color: "#374151",
};

const sliderStyle = {
  width: "60px",
  cursor: "pointer",
  accentColor: "#3b82f6",
};

const dropdownContainerStyle = {
  position: "relative",
};

const dropdownMenuStyle = {
  position: "absolute",
  left: "65px",
  top: "0",
  backgroundColor: "white",
  border: "2px solid #d1d5db",
  borderRadius: "8px",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: 1000,
  minWidth: "140px",
};

const dropdownItemStyle = {
  width: "100%",
  height: "45px",
  border: "2px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "10px",
  padding: "0 12px",
  transition: "all 0.2s",
  fontSize: "14px",
  fontWeight: "500",
};

const shapeLabelStyle = {
  fontSize: "14px",
  fontWeight: "500",
};
