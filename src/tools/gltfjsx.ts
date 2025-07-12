import { z } from "zod"
import { type InferSchema } from "xmcp"
import { parse, type ParseOptions } from "gltfjsx"

// Define the schema for tool parameters
export const schema = {
  /** The path to the GLTF/GLB model file */
  model: z.string().describe("The path to the GLTF/GLB model file to convert to JSX"),
  /** Options for the gltfjsx parser */
  options: z.object({
    types: z.boolean().optional().describe("Add Typescript definitions to the output"),
    keepnames: z.boolean().optional().describe("Keep original node names from the GLTF file"),
    keepgroups: z.boolean().optional().describe("Keep (empty) groups, disable pruning of empty transforms"),
    bones: z.boolean().optional().describe("Lay out bones declaratively (default: false)"),
    meta: z.boolean().optional().describe("Include metadata (as userData) in the output"),
    shadows: z.boolean().optional().describe("Let meshes cast and receive shadows"),
    printwidth: z.number().optional().describe("Prettier printWidth (default: 120)"),
    precision: z.number().optional().describe("Number of fractional digits for floats (default: 3)"),
    draco: z.string().optional().describe("Draco binary path for mesh compression"),
    root: z.string().optional().describe("Sets directory from which .gltf file is served"),
    instance: z.boolean().optional().describe("Instance re-occurring geometry for cheaper re-use"),
    instanceall: z.boolean().optional().describe("Instance every geometry (for maximum re-use)"),
    exportdefault: z.boolean().optional().describe("Use default export for the generated component"),
    transform: z.boolean().optional().describe("Transform the asset for the web (draco, prune, resize)"),
    resolution: z.number().optional().describe("Resolution for texture resizing (default: 1024)"),
    keepmeshes: z.boolean().optional().describe("Do not join compatible meshes"),
    keepmaterials: z.boolean().optional().describe("Do not palette join materials"),
    format: z.string().optional().describe("Texture format for output textures (default: 'webp')"),
    simplify: z.boolean().optional().describe("Enable mesh simplification (default: false)"),
    ratio: z.number().optional().describe("Simplifier ratio (default: 0)"),
    error: z.number().optional().describe("Simplifier error threshold (default: 0.0001)"),
    console: z.boolean().optional().describe("Log JSX to console, won't produce a file"),
    debug: z.boolean().optional().describe("Enable debug output"),
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
  // Call the gltfjsx parse function with the provided model and options
  const jsx = parse(model, options as ParseOptions)
  return {
    content: [{ type: "text", text: jsx }],
  }
}
