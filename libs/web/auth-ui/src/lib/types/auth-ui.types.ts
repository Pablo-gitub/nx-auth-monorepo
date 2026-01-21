export type AuthShellProps = {
  title: string;
  subtitle?: string;
  logo?: React.ReactNode;
  children: React.ReactNode;
};

export type LoginFormValues = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};
