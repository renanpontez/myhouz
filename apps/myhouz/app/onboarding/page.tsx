import Link from "next/link";
import { Home, UserPlus } from "lucide-react";
import { Card, CardContent } from "@home/ui";
import { JoinByCodeForm } from "@/components/auth/JoinByCodeForm";
import { OrDivider } from "@/components/auth/OrDivider";

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Bem-vindo ao MyHouz</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie uma nova casa ou entre em uma existente
        </p>
      </div>

      <div className="space-y-3">
        <Link href="/onboarding/create">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Criar uma casa</p>
                <p className="text-sm text-muted-foreground">
                  Comece do zero com uma nova casa
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <OrDivider />

        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Tenho um convite</p>
                <p className="text-sm text-muted-foreground">
                  Cole o codigo do convite abaixo
                </p>
              </div>
            </div>
            <JoinByCodeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
