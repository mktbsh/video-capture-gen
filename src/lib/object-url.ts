
export const objectURL = Object.freeze({
  create: (obj: Blob | MediaSource) => URL.createObjectURL(obj),
  revoke: (url: string) => URL.revokeObjectURL(url)
});
