export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join MyHouz to manage your household
          </p>
        </div>
        {/* SignupForm + SocialLoginButtons will go here */}
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          Signup form placeholder
        </div>
      </div>
    </div>
  );
}
