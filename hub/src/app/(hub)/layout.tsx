import { redirect } from "next/navigation"
import { currentUser } from "@/lib/guard"
import TopNav from "@/components/TopNav"

/** Layout del área autenticada: valida sesión y pinta la barra superior. */
export default async function HubLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  if (!user) redirect("/login")
  return (
    <>
      <TopNav email={user.email} role={user.role} />
      <main className="page">{children}</main>
    </>
  )
}
