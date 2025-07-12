declare module "gltfjsx" {
  export interface ParseOptions {
    /** Add Typescript definitions to the output */
    types?: boolean
    /** Keep original node names from the GLTF file */
    keepnames?: boolean
    /** Keep (empty) groups, disable pruning of empty transforms */
    keepgroups?: boolean
    /** Lay out bones declaratively (default: false) */
    bones?: boolean
    /** Include metadata (as userData) in the output */
    meta?: boolean
    /** Let meshes cast and receive shadows */
    shadows?: boolean
    /** Prettier printWidth (default: 120) */
    printwidth?: number
    /** Number of fractional digits for floats (default: 3) */
    precision?: number
    /** Draco binary path for mesh compression */
    draco?: string
    /** Sets directory from which .gltf file is served */
    root?: string
    /** Instance re-occurring geometry for cheaper re-use */
    instance?: boolean
    /** Instance every geometry (for maximum re-use) */
    instanceall?: boolean
    /** Use default export for the generated component */
    exportdefault?: boolean
    /** Transform the asset for the web (draco, prune, resize) */
    transform?: boolean
    /** Resolution for texture resizing (default: 1024) */
    resolution?: number
    /** Do not join compatible meshes */
    keepmeshes?: boolean
    /** Do not palette join materials */
    keepmaterials?: boolean
    /** Texture format for output textures (default: "webp") */
    format?: string
    /** Enable mesh simplification (default: false) */
    simplify?: boolean
    /** Simplifier ratio (default: 0) */
    ratio?: number
    /** Simplifier error threshold (default: 0.0001) */
    error?: number
    /** Log JSX to console, won't produce a file */
    console?: boolean
    /** Enable debug output */
    debug?: boolean
  }

  export function parse(model: any, options?: ParseOptions): Promise<string>

  /**
   * Loader for extracting the structure of a GLTF/GLB file without loading binaries or textures.
   * Usage:
   *   const loader = new GLTFStructureLoader()
   *   loader.parse(data, '', callback)
   */
  export class GLTFStructureLoader {
    constructor()
    /**
     * Parses a GLTF/GLB buffer and calls the callback with the result.
     * @param data The GLTF/GLB file data as a Buffer or ArrayBuffer
     * @param path The file path (can be empty string)
     * @param callback Callback receiving the parsed structure (e.g., { scene })
     */
    parse(
      data: Buffer | ArrayBuffer,
      path: string,
      callback: (result: { scene: any }) => void
    ): void
  }
}