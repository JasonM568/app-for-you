import SignupClient from "./SignupClient";

export default function SignupPage({
  searchParams,
}: {
  searchParams?: { returnTo?: string };
}) {
  const returnTo = searchParams?.returnTo ?? "";

  return <SignupClient returnTo={returnTo} />;
}

