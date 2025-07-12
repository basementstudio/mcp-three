import { InferSchema } from "xmcp"
import { z } from "zod"
import { GLTFStructureLoader } from 'gltfjsx'
import fs from 'fs/promises'

export const schema = {
  model: z.string().describe("The path to the GLTF/GLB model file to get the structure of"),
}

export const metadata = {
  name: "get-model-structure",
  description: "Get the structure of a GLTF/GLB model file. This tool loads the file and returns the parsed scene structure as JSON, using GLTFStructureLoader from gltfjsx. Useful for inspecting the hierarchy and contents of a 3D model without loading all binary data or textures.",
}

export default async function getModelStructureTool({ model }: InferSchema<typeof schema>) {
  // Read the model file as a buffer
  const data = await fs.readFile(model)
  // Parse the structure using GLTFStructureLoader
  const loader = new GLTFStructureLoader()
  const structure = await new Promise<{ scene: any }>(resolve => {
    loader.parse(data, '', resolve)
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