export function SignInMethodDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-brand_primary px-2 text-brand_tertiary/50">
          Or continue with
        </span>
      </div>
    </div>
  );
}