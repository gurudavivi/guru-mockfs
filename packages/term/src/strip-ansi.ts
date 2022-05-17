export function stripAnsi(str: string): string {
  return str.replace(
    /\033(\[(\[H\033\[2J|\d+;\d+H|\d+(;\d+;\d+(;\d+;\d+)?m|[mABCDFGd])|[HJK]|1K)|[78]|\d*[PMX]|\(B\033\[m)/g,
    ''
  )
}

export default stripAnsi
