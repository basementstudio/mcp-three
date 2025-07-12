# MCP Three - 3D Model Processing Server

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=mcp-three&config=eyJ0eXBlIjoic3RkaW8iLCJjb21tYW5kIjoibnB4IC15IG1jcC10aHJlZSJ9)

A Model Context Protocol (MCP) server specialized for working with 3D models, specifically GLTF/GLB files. This server provides tools to convert 3D models into React Three Fiber JSX components and analyze model structures.

## Features

- **GLTF/GLB to JSX Conversion**: Convert 3D models into reusable React Three Fiber components
- **Model Structure Analysis**: Inspect and debug 3D model hierarchies and properties
- **Performance Optimization**: Support for instancing, mesh simplification, and texture optimization
- **TypeScript Support**: Generate type-safe React components with proper TypeScript definitions

## Tools Available

### 1. `gltfjsx`
Converts GLTF/GLB 3D model files into declarative React (react-three-fiber) JSX components.

**Features:**
- TypeScript definitions generation
- Mesh and material instancing for performance
- Texture format conversion and optimization
- Mesh simplification
- Shadow casting/receiving setup
- Bone layout for animations
- Metadata preservation


### 2. `get-model-structure`
Analyzes and returns the structure of a GLTF/GLB model file as JSON. Useful for debugging complex models and understanding their hierarchy before conversion.

## Getting Started

Add this server to your MCP client configuration:

```json
{
  "mcpServers": {
    "mcp-three": {
      "command": "npx",
      "args": ["mcp-three"]
    }
  }
}
```

## Supported File Formats

- `.gltf` - GLTF JSON format
- `.glb` - GLTF Binary format

## Common Use Cases

1. **Converting 3D Models for Web Apps**: Transform GLTF/GLB files into optimized React components
2. **Model Debugging**: Inspect model structure and properties before integration
3. **Performance Optimization**: Generate instanced meshes and optimized textures
4. **Animation Setup**: Prepare models with proper bone layouts for animations



> This project is built using the [xmcp](https://xmcp.dev) framework.
