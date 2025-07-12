import fs from 'fs/promises'
import path from 'path'

const LOG_FILE = path.join(process.cwd(), 'app.log')

export async function log(message: string): Promise<void> {
  const timestamp = new Date().toISOString()
  const logEntry = `[${timestamp}] ${message}\n`

  try {
    await fs.appendFile(LOG_FILE, logEntry)
  } catch (error) {
    // If file doesn't exist, create it
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      await fs.writeFile(LOG_FILE, logEntry)
    } else {
      throw error
    }
  }
}

export default log 