import { Connection } from "mongoose"

declare global{
    var mongoose:{
      conn:Connection | null,
      promise:Promise<Connection> | null
    }
}

declare module "*.css" {
  const content: string;
  export default content;
}

export {}