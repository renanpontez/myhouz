import { Card, CardContent, CardFooter, CardHeader } from "@home/ui";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex flex-row min-h-screen items-center justify-center">
      <div className="w-1/3">
        <img src="/myhouz-logo.svg" alt="myhouz" className="mx-auto h-32 w-auto" />
      </div>

      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="text-center">
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
