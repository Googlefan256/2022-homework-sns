declare module NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "production" | "development";
    readonly HOSTNAME: string;
    readonly PORT: string;
  }
}

declare module Express {
  interface Request {
    user: import("./db").UserType;
  }
}
