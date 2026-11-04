import { redirect } from "next/navigation"
import { currentUser } from "@/lib/guard"
import { listUsers, recentActivity } from "@/lib/db"
import UsersAdmin from "@/components/UsersAdmin"

export const dynamic = "force-dynamic"

export default async function UsuariosPage() {
  const user = await currentUser()
  if (!user || user.role !== "admin") redirect("/")
  const users = listUsers()
  const activity = recentActivity(100)
  return (
    <div className="narrow">
      <h1>Usuarios y actividad</h1>
      <UsersAdmin users={users} activity={activity} me={user.email} />
    </div>
  )
}
