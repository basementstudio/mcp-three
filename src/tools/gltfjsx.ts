import { z } from "zod"
import { type InferSchema } from "xmcp"
import fs from 'fs/promises'
import { getJsxFromFile } from "../utils/get-jsx"

// Define the schema for tool parameters
export const schema = {
  /** The path to the GLTF/GLB model file */
  model: z.string().describe("The path to the GLTF/GLB model file to convert to JSX. The path should be absolute. The path should be absolute on the file system. Do not use relative paths."),
  /** Options for the gltfjsx parser */
  options: z.object({
    types: z.boolean().optional().describe("Add Typescript definitions to the output"),
    keepnames: z.boolean().optional().describe("Keep original node names from the GLTF file"),
    keepgroups: z.boolean().optional().describe("Keep (empty) groups, disable pruning of empty transforms"),
    bones: z.boolean().optional().describe("Lay out bones declaratively (default: false)"),
    meta: z.boolean().optional().describe("Include metadata (as userData) in the output"),
    shadows: z.boolean().optional().describe("Let meshes cast and receive shadows"),
    precision: z.number().optional().describe("Number of fractional digits for floats (default: 3)"),
    instance: z.boolean().optional().describe("Instance re-occurring geometry for cheaper re-use"),
    instanceall: z.boolean().optional().describe("Instance every geometry (for maximum re-use)"),
    exportdefault: z.boolean().optional().describe("Use default export for the generated component"),
    resolution: z.number().optional().describe("Resolution for texture resizing (default: 1024)"),
    keepmeshes: z.boolean().optional().describe("Do not join compatible meshes"),
    keepmaterials: z.boolean().optional().describe("Do not palette join materials"),
    format: z.string().optional().describe("Texture format for output textures (default: 'webp')"),
    simplify: z.boolean().optional().describe("Enable mesh simplification (default: false)"),
    ratio: z.number().optional().describe("Simplifier ratio (default: 0)"),
    error: z.number().optional().describe("Simplifier error threshold (default: 0.0001)"),
    // printwidth: z.number().optional().describe("Prettier printWidth (default: 120)"),
    // draco: z.string().optional().describe("Draco binary path for mesh compression"),
    // root: z.string().optional().describe("Sets directory from which .gltf file is served"),
    // transform: z.boolean().optional().describe("Transform the asset for the web (draco, prune, resize)"),
    // console: z.boolean().optional().describe("Log JSX to console, won't produce a file"),
    // debug: z.boolean().optional().describe("Enable debug output"),
  }).partial(),
}

// Define tool metadata
export const metadata = {
  name: "gltfjsx",
  description:
    "Converts a GLTF/GLB 3D model file into a reusable, declarative React (react-three-fiber) JSX component. Supports options for TypeScript output, mesh/material instancing, pruning, compression, texture format, mesh simplification, and more. Useful for integrating 3D assets into React apps with optimal performance and flexibility.",
  annotations: {
    title: "Convert GLTF/GLB to React JSX component",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
}

// Tool implementation
export default async function gltfjsxTool({ model, options }: InferSchema<typeof schema>) {

  // Check if file exists before reading
  const exists = await fs.access(model).then(() => true).catch(() => false)
  if (!exists)
    return {
      content: [{
        type: "text",
        text: `Model file not found at path: ${model}`,
      },
      ],
      isError: true
    }

  const jsx = await getJsxFromFile(model)
  return {
    content: [{ type: "text", text: JSON.stringify(jsx, null, 2) }],
  }
}
