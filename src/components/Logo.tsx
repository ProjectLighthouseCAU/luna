export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <img
      src={`${process.env.PUBLIC_URL}/logo-dark.svg`}
      alt="The Project Lighthouse logo"
      className={className}
    />
  );
}
