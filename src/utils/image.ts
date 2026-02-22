import { File } from "expo-file-system";

export async function uriToArrayBuffer(uri: string): Promise<ArrayBuffer> {
  const file = new File(uri);
  return file.arrayBuffer();
}
