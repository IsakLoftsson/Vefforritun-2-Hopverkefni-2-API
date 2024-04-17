import { User } from '../types.js';

export function UserMapper(potentialUser: unknown): User | null {
  const user = potentialUser as Partial<User> | null;

  if (!user || !user.id || !user.name || !user.password) {
    return null;
  }

  const mapped: User = {
    id: user.id,
    name: user.name,
    password: user.password,
    admin: user.admin ?? false // þarf að breyta ef vesen ??????
  };

  return mapped;
}


export function UsersMapper(potentialUsers: unknown): Array<User> {
  const users = potentialUsers as Array<unknown> | null;

  if (!users || !Array.isArray(users)) {
    return [];
  }

  const mapped = users.map(UserMapper);

  return mapped.filter((i): i is User => Boolean(i));
}