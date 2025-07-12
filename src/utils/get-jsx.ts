import { GLTFLoader, DRACOLoader, GLTF } from 'three-stdlib'
import { parse, ParseOptions } from 'gltfjsx'
import { readFileSync } from 'fs'
import { suppressStdioAsync } from './suppress-stdio'

export async function getJsx(model: GLTF, options: ParseOptions = {}): Promise<string> {
  return await suppressStdioAsync(async () => {
    const jsx = await parse(model, {
      ...options,
      console: false,
      debug: false,
    })

    return processJsx(jsx, options)
  })
}

function processJsx(jsx: string, options: ParseOptions): string {

  jsx = `/* eslint-disable @typescript-eslint/no-explicit-any */\n` + jsx

  if (options.types) {
    jsx = jsx.replace(
      /import React from 'react'/g,
      "import React, { JSX } from 'react'\n"
    )
  }

  // Replace import { GLTF } from 'three-stdlib' with import { GLTF } from "three/examples/jsm/Addons.js";
  jsx = jsx.replace(
    /import\s*\{\s*GLTF\s*\}\s*from\s*['"]three-stdlib['"]\s*;?/g,
    'import { GLTF } from "three/examples/jsm/Addons.js";\n'
  )

  return jsx
}


export async function loadGltf(glbFilePath: string): Promise<GLTF> {

  const arrayBuffer = getModelBuffer(glbFilePath)

  const gltfLoader = new GLTFLoader()
  const dracoloader = new DRACOLoader()
  dracoloader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  gltfLoader.setDRACOLoader(dracoloader)

  // Convert Node.js Buffer to ArrayBuffer (needed for three.js loaders)

  return new Promise<GLTF>((resolve, reject) => {
    gltfLoader.parse(arrayBuffer, '', (gltf) => {
      resolve(gltf)
    }, (error) => {
      reject(error)
    })
  })
}

export function getModelBuffer(glbFilePath: string): ArrayBuffer {
  let glbBuffer: Buffer

  try {
    glbBuffer = readFileSync(glbFilePath)
  } catch (error) {
    throw new Error(`Failed to load file at ${glbFilePath}`)
  }
  const arrayBuffer = glbBuffer.buffer.slice(glbBuffer.byteOffset, glbBuffer.byteOffset + glbBuffer.byteLength)

  return arrayBuffer
}