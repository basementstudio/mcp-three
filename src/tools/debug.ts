export const schema = {}

export const metadata = {
  name: "debug",
  description: "Log a message to the console",
  annotations: {
    title: "Convert GLTF/GLB to React JSX component",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
}

export default async function debugTool() {
  const result = `Current working directory: ${process.cwd()}`

  return {
    content: [{ type: "text", text: result }],
  }
}