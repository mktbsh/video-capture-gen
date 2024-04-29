const toBuffer = async (source: string | File): Promise<ArrayBuffer> => {
  if (typeof source === "string") {
    return new TextEncoder().encode(source).buffer;
  }
  return await source.arrayBuffer();
};

export async function sha256(source: string | File) {
  const buffer = await toBuffer(source);
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(digest));
  const hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
}
