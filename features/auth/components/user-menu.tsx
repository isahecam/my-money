import { NavUser } from "@/features/auth/components/nav-user";
import { getSession } from "@/features/auth/dal";

export async function UserMenu() {
  const session = await getSession();
  // Pages handle the redirect; this only renders.
  if (!session) return null;

  // Only what the UI needs reaches the client.
  const { name, email } = session.user;

  return <NavUser user={{ name, email }} />;
}
