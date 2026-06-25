import AdminClient from "./components/AdminClient";

async function get(path: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}${path}`, {
      headers: { authorization: `Bearer ${process.env.ADMIN_TOKEN || "dev-admin-token"}` },
      cache: "no-store",
    });
    return (await response.json()).data?.items || [];
  } catch {
    return [];
  }
}

export default async function Admin() {
  const [campaigns, items, redemptions, users, ledger] = await Promise.all([
    get("/admin/campaigns"),
    get("/admin/shop/items"),
    get("/admin/redemptions"),
    get("/admin/users"),
    get("/admin/ledger"),
  ]);

  return <AdminClient apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"} initial={{ campaigns, items, redemptions, users, ledger }} />;
}
