import { InferSchema } from "xmcp"
import { z } from "zod"
import { GLTFStructureLoader } from 'gltfjsx'
import fs from 'fs/promises'
import { getModelBuffer, loadGltf } from "../utils/get-jsx"

export const schema = {
  modelPath: z.string().describe("The path to the GLTF/GLB model file to get the structure of. The path should be absolute on the file system. Do not use relative paths."),
}

export const metadata = {
  name: "get-model-structure",
  description: "Get the structure of a GLTF/GLB model file. This tool loads the file and returns the parsed scene structure as JSON, using GLTFStructureLoader from gltfjsx. Useful for inspecting the hierarchy and contents of a 3D model without loading all binary data or textures.",
  annotations: {
    title: "Get the structure of a GLTF/GLB model file",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
}

export default async function getModelStructureTool({ modelPath }: InferSchema<typeof schema>) {
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

  const model = getModelBuffer(modelPath)

  // Parse the structure using GLTFStructureLoader
  const loader = new GLTFStructureLoader()
  const structure = await new Promise<{ scene: any }>(resolve => {
    loader.parse(model, '', resolve)
  })

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(structure.scene, null, 2),
      },
    ],
  }
}