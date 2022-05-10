export default interface Credentials {
  accessToken: string;
  refreshToken: string;
  expires: number;
  tokenType: string;
  scope: string[];
}
