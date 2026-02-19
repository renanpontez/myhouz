import { Card, CardContent, CardFooter, CardHeader } from "@home/ui";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">MyHouz</h1>
            <h2 className="mt-2 text-xl font-semibold">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer && (
            <CardFooter className="justify-center">{footer}</CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
