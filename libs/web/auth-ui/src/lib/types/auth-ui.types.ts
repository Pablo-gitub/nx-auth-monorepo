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
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string; // ISO date string from <input type="date">
  password: string;
  confirmPassword: string;
};
