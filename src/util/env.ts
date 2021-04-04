export default function getEnvVar(name: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return window?.__env__?.[name] || process.env[name];
}
