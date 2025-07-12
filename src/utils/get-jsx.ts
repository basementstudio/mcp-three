import { GLTFLoader, DRACOLoader } from 'three-stdlib'
import { parse, ParseOptions } from 'gltfjsx'
import { readFileSync } from 'fs'

export async function getJsxFromFile(glbFilePath: string, options: ParseOptions = {}) {
  let glbBuffer: Buffer

  try {
    glbBuffer = readFileSync(glbFilePath)
  } catch (error) {
    throw new Error(`Failed to load file at ${glbFilePath}`)
  }

  const gltfLoader = new GLTFLoader()
  const dracoloader = new DRACOLoader()
  dracoloader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  gltfLoader.setDRACOLoader(dracoloader)

  // Convert Node.js Buffer to ArrayBuffer (needed for three.js loaders)
  const arrayBuffer = glbBuffer.buffer.slice(glbBuffer.byteOffset, glbBuffer.byteOffset + glbBuffer.byteLength)

  const jsx = await new Promise((resolve, reject) => {

    gltfLoader.parse(arrayBuffer, '', (gltf) => {
      try {
        const jsx = parse(gltf, {
          ...options,
          console: false,
          debug: false,
        })
        resolve(jsx)
      } catch (error) {
        reject(error)
      }
    }, (error) => {
      reject(error)
    })
  })

  return jsx;
}