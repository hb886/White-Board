import { ArrowRight, Circle, Eraser, Palette, Pencil, Square, Star, Triangle } from 'lucide-react'
import React from 'react'

const Toolbar = ({onToolChange, selectedTool, selectedColor, onColorChange, brushSize, onBrushSizeChange}) => {
  return (
    <div style={toolbarStyle}>
      <h3 style={titleStyle}>Tools</h3>

      <button
        onClick={() => onToolChange("brush")}
        style={{
          ...toolButtonStyle,
          backgroundColor: selectedTool === "brush" ? "#3b82f6" : "white",
          color: selectedTool === "brush" ? "white" : "#333",
        }}
        title="Brush"
      >
        <Pencil size={54} />
      </button>
      

      <button
        onClick={() => onToolChange("eraser")}
        style={{
          ...toolButtonStyle,
          backgroundColor: selectedTool === "eraser" ? "#3b82f6" : "white",
          color: selectedTool === "eraser" ? "white" : "#333",
        }}
        title="Eraser"
      >
        <Eraser size={24} />
      </button>

       <button
        onClick={() => onToolChange('rectangle')}
        style={{
          ...toolButtonStyle,
          backgroundColor: selectedTool === 'rectangle' ? '#3b82f6' : 'white',
          color: selectedTool === 'rectangle' ? 'white' : '#333',
        }}
        title="Rectangle"
      >
        <Square size={24} />
      </button>

      <button
        onClick={() => onToolChange('circle')}
        style={{
          ...toolButtonStyle,
          backgroundColor: selectedTool === 'circle' ? '#3b82f6' : 'white',
          color: selectedTool === 'circle' ? 'white' : '#333',
        }}
        title="Circle"
      >
        <Circle size={24} />
      </button>

      <button
        onClick={() => onToolChange('triangle')}
        style={{
          ...toolButtonStyle,
          backgroundColor: selectedTool === 'triangle' ? '#3b82f6' : 'white',
          color: selectedTool === 'triangle' ? 'white' : '#333',
        }}
        title="Triangle"
      >
        <Triangle size={24} />
      </button>

      <button
        onClick={() => onToolChange('arrow')}
        style={{
          ...toolButtonStyle,
          backgroundColor: selectedTool === 'arrow' ? '#3b82f6' : 'white',
          color: selectedTool === 'arrow' ? 'white' : '#333',
        }}
        title="Arrow"
      >
        <ArrowRight size={24} />
      </button>

      <button
        onClick={() => onToolChange('star')}
        style={{
          ...toolButtonStyle,
          backgroundColor: selectedTool === 'star' ? '#3b82f6' : 'white',
          color: selectedTool === 'star' ? 'white' : '#333',
        }}
        title="Star"
      >
        <Star size={24} />
      </button>

      <div style={dividerStyle}></div>

      

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

      <div style={dividerStyle}></div>
      <label style={labelStyle}>Size: {brushSize}px</label>
      <input
        type="range"
        min="1"
        max="50"
        value={brushSize}
        onChange={(e) => onBrushSizeChange(Number(e.target.value))}
        style={sliderStyle}
      />
    </div>
  );
}

export default Toolbar


const toolbarStyle = {
  width: "80px",
  backgroundColor: "#f3f4f6",
  borderRight: "2px solid #e5e7eb",
  padding: "20px 10px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  alignItems: "center",
}

const titleStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#374151",
  marginBottom: "10px",
}

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
}

const dividerStyle = {
  width: "60px",
  height: "2px",
  backgroundColor: "#d1d5db",
  margin: "10px 0",
}

const colorPickerContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
}

const colorInputStyle = {
  width: "50px",
  height: "50px",
  border: "2px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  padding: "5px",
}


const sliderContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  width: "100%",
}

const labelStyle = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#374151",
}

const sliderStyle = {
  width: "50px",
  cursor: "pointer",
  accentColor: "#3b82f6",
}