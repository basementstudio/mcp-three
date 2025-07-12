// Utility function to suppress stdio output
export function suppressStdio<T>(fn: () => T): T {
  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug,
    trace: console.trace,
    table: console.table,
    dir: console.dir,
    dirxml: console.dirxml,
    group: console.group,
    groupCollapsed: console.groupCollapsed,
    groupEnd: console.groupEnd,
    count: console.count,
    countReset: console.countReset,
    time: console.time,
    timeEnd: console.timeEnd,
    timeLog: console.timeLog,
    clear: console.clear,
    profile: console.profile,
    profileEnd: console.profileEnd,
    timeStamp: console.timeStamp,
  }

  // Store original process methods
  const originalStdout = process.stdout.write
  const originalStderr = process.stderr.write

  try {
    // Override console methods with no-op functions
    Object.keys(originalConsole).forEach(key => {
      // @ts-ignore
      console[key] = () => { }
    })

    // Override process stdout and stderr
    process.stdout.write = (() => true) as any
    process.stderr.write = (() => true) as any

    // Execute the function
    return fn()
  } finally {
    // Restore original console methods
    Object.keys(originalConsole).forEach(key => {
      // @ts-ignore
      console[key] = originalConsole[key]
    })

    // Restore original process methods
    process.stdout.write = originalStdout
    process.stderr.write = originalStderr
  }
}

// Async utility function to suppress stdio output
export async function suppressStdioAsync<T>(fn: () => Promise<T>): Promise<T> {
  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug,
    trace: console.trace,
    table: console.table,
    dir: console.dir,
    dirxml: console.dirxml,
    group: console.group,
    groupCollapsed: console.groupCollapsed,
    groupEnd: console.groupEnd,
    count: console.count,
    countReset: console.countReset,
    time: console.time,
    timeEnd: console.timeEnd,
    timeLog: console.timeLog,
    clear: console.clear,
    profile: console.profile,
    profileEnd: console.profileEnd,
    timeStamp: console.timeStamp,
  }

  // Store original process methods
  const originalStdout = process.stdout.write
  const originalStderr = process.stderr.write

  // Override console methods with no-op functions
  Object.keys(originalConsole).forEach(key => {
    // @ts-ignore
    console[key] = () => { }
  })

  // Override process stdout and stderr
  process.stdout.write = (() => true) as any
  process.stderr.write = (() => true) as any

  // Execute the async function
  return await fn().finally(() => {

    // Restore original console methods
    Object.keys(originalConsole).forEach(key => {
      // @ts-ignore
      console[key] = originalConsole[key]
    })

    // Restore original process methods
    process.stdout.write = originalStdout
    process.stderr.write = originalStderr
  })
} 