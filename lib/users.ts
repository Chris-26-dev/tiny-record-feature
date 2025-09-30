export type User = {
  email: string;
  password: string;
};

export const users: User[] = [
  { email: "demo@sma.local", password: "demo123" },
  { email: "admin@sma.local", password: "admin123" },
];
