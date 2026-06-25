import AdClient from "./AdClient";

async function getSession(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/v1/ad-sessions/${id}`, {
      cache: "no-store",
    });
    const json = await response.json();
    return json.data.session;
  } catch {
    return null;
  }
}

export default async function Page({ params, searchParams }: { params: { sessionId: string }; searchParams: { ct?: string } }) {
  const session = await getSession(params.sessionId);
  if (!session) return <main><h1>Ad session not found</h1></main>;
  return <AdClient session={session} claimToken={searchParams.ct || ""} apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"} />;
}
