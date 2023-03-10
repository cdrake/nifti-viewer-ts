// declare module "*.txt" {
//   export const plainText: string;
// }
declare module "*.txt" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
