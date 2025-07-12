import { z } from "zod"
import { type InferSchema } from "xmcp"
import fs from 'fs/promises'
import { getJsx, loadGltf } from "../utils/get-jsx"

// Define the schema for tool parameters
export const schema = {
  /** The path to the GLTF/GLB model file */
  modelPath: z.string().describe("The path to the GLTF/GLB model file to convert to JSX. The path should be absolute. The path should be absolute on the file system. Do not use relative paths."),
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
export default async function gltfjsxTool({ modelPath, options }: InferSchema<typeof schema>) {

  // Check if file exists before reading
  const exists = await fs.access(modelPath).then(() => true).catch(() => false)
  if (!exists)
    return {
      content: [{
        type: "text",
        text: `Model file not found at path: ${modelPath}`,
      },
      ],
      isError: true
    }

  const model = await loadGltf(modelPath)

  const jsx = await getJsx(model, options)

  if (typeof jsx !== "string") {
    return {
      content: [{
        type: "text",
        text: "Failed to generate JSX",
      }],
      isError: true
    }
  }


  const result = [
    { type: "text", text: "Generated JSX:" },
    { type: "text", text: jsx },
    { type: "text", text: "Implementation instructions:" },
    {
      type: "text", text: `Whenever you find any "as GLTFResult", replace it with "as any as GLTFResult"
      This will fix type errors on the application.
      For example:
      useGLTF('*') as GLTFResult REPLACE WITH useGLTF('*') as any as GLTFResult
      useGraph(clone) as GLTFResult REPLACE WITH useGraph(clone) as any as GLTFResult
      ` },
    {
      type: "text", text: `
      For better type safety, when using refs, use the following syntax:
      const ref = useRef<GLTFResult>(null)

      For example:
      const group = useRef<GLTFResult>() REPLACE WITH const group = useRef<GLTFResult|null>(null)
      `
    },
    { type: "text", text: "Make sure to add the correct path to useGLTF('*')" }
  ]

  if (model.animations.length === 0) {
    result.push({ type: "text", text: "No animations found in the model. Remove the from the type declaration if present." })
  }


  return {
    content: result,
  }
}
