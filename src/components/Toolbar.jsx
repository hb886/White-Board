import { Eraser, Palette, Pencil } from 'lucide-react'
import React from 'react'

const Toolbar = ({onToolChange, selectedTool, selectedColor, onColorChange}) => {
  return (
    <div style={toolbarStyle}>
        <h3 style={titleStyle}>Tools</h3>

        <button
        onClick={() => onToolChange('brush')}
        style={{
            ...toolButtonStyle,
            backgroundColor: selectedTool === "brush" ? '#3b82f6' : 'white',
            color: selectedTool === 'brush' ? 'white' : '#333',
        }}
        title="Brush"
        >
            <Pencil size={54} />
        </button>

        <button
        onClick={() => onToolChange('eraser')}
        style={{
          ...toolButtonStyle,
          backgroundColor: selectedTool === 'eraser' ? '#3b82f6' : 'white',
          color: selectedTool === 'eraser' ? 'white' : '#333',
        }}
        title="Eraser"
        >
        <Eraser size={24} />
      </button>


      <div style={dividerStyle}></div>

      <div style={colorPickerContainerStyle}>
        <Palette size={20} color="#666" />
        <input
          type="color"
          value={selectedColor}
          title="Choose Color"
          style={colorInputStyle}
          onChange={(e) => onColorChange(e.target.value)}
        />
      </div>
    

    </div>
  )
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