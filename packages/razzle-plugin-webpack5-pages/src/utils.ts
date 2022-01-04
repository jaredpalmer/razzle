import { recursiveReadDir } from './recursive-readdir.js'

export function collectPages(
    directory: string,
    pageExtensions: string[]
  ): Promise<string[]> {
    return recursiveReadDir(
      directory,
      new RegExp(`\\.(?:${pageExtensions.join('|')})$`)
    )
  }
  