interface RootState {
  user: {
    token: string;
    refreshToken: string;
    expiresAt: string;
  };
}

export type { RootState };