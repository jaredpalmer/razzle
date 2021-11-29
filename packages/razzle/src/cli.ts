import loadConfig from "./loaders/config";

export async function cli(): Promise<void>;
export async function cli() {
  const config = await loadConfig();
}
