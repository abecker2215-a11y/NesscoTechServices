import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { NewTicketClient } from "@/components/portal/NewTicketClient";
import { TicketCategory } from "@prisma/client";

export default async function NewTicketPage() {
  const session = await auth();
  
  if (!session?.user?.clientId) {
    redirect("/portal/login");
  }

  const categories = Object.values(TicketCategory).map((value) => ({
    value,
    label: value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  }));

  return (
    <NewTicketClient
      initialData={{
        clientId: session.user.clientId,
        userId: session.user.id,
        categories,
      }}
    />
  );
}