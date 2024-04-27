export interface IUser {
  id: string | number;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;

  // is_sysadmin?: boolean;
  role?: string | number;
};
