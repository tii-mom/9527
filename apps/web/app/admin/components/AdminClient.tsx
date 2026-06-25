"use client";

import { FormEvent, useState } from "react";

async function adminFetch(apiBaseUrl: string, token: string, path: string, init: RequestInit = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: { "content-type": "application/json", authorization: `Bearer ${token}`, ...(init.headers || {}) },
  });
  return response.json();
}

export default function AdminClient({ apiBaseUrl, initial }: { apiBaseUrl: string; initial: any }) {
  const [token, setToken] = useState("dev-admin-token");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>, handler: (data: FormData) => Promise<any>) {
    event.preventDefault();
    const json = await handler(new FormData(event.currentTarget));
    setMessage(JSON.stringify(json, null, 2));
  }

  return (
    <main>
      <h1>Admin</h1>
      <label>
        Admin token <input value={token} onChange={(event) => setToken(event.target.value)} />
      </label>
      <p>{message}</p>

      <h2>Create campaign</h2>
      <form onSubmit={(event) => submit(event, (data) => adminFetch(apiBaseUrl, token, "/admin/campaigns", { method: "POST", body: JSON.stringify({ sponsorName: data.get("sponsorName"), headline: data.get("headline"), body: data.get("body"), targetUrl: data.get("targetUrl"), rewardPoints: Number(data.get("rewardPoints") || 8), status: "active" }) }))}>
        <input name="sponsorName" placeholder="Sponsor" required />
        <input name="headline" placeholder="Headline" required />
        <input name="body" placeholder="Body" required />
        <input name="targetUrl" placeholder="https://example.com" required />
        <input name="rewardPoints" placeholder="8" type="number" />
        <button>Create</button>
      </form>

      <h2>Campaigns</h2>
      <ul>{initial.campaigns.map((campaign: any) => <li key={campaign.id}>{campaign.sponsorName} · {campaign.status} <button onClick={() => adminFetch(apiBaseUrl, token, `/admin/campaigns/${campaign.id}/pause`, { method: "POST" }).then((json) => setMessage(JSON.stringify(json, null, 2)))}>Pause</button></li>)}</ul>

      <h2>Create shop item</h2>
      <form onSubmit={(event) => submit(event, (data) => adminFetch(apiBaseUrl, token, "/admin/shop/items", { method: "POST", body: JSON.stringify({ category: data.get("category"), name: data.get("name"), description: data.get("description"), pointsPrice: Number(data.get("pointsPrice") || 1000), deliveryType: data.get("deliveryType") || "manual", requiresReview: data.get("requiresReview") === "on", status: "active" }) }))}>
        <input name="category" placeholder="Category" required />
        <input name="name" placeholder="Name" required />
        <input name="description" placeholder="Description" />
        <input name="pointsPrice" type="number" placeholder="1000" required />
        <input name="deliveryType" placeholder="manual" />
        <label><input type="checkbox" name="requiresReview" /> Requires review</label>
        <button>Create</button>
      </form>

      <h2>Shop items</h2>
      <ul>{initial.items.map((item: any) => <li key={item.id}>{item.name} · {item.pointsPrice} pts</li>)}</ul>

      <h2>Redemptions</h2>
      <ul>{initial.redemptions.map((order: any) => <li key={order.id}>{order.id} · {order.status} · {order.pointsCost} pts <button onClick={() => adminFetch(apiBaseUrl, token, `/admin/redemptions/${order.id}/approve`, { method: "POST" }).then((json) => setMessage(JSON.stringify(json, null, 2)))}>Approve</button> <button onClick={() => adminFetch(apiBaseUrl, token, `/admin/redemptions/${order.id}/reject`, { method: "POST" }).then((json) => setMessage(JSON.stringify(json, null, 2)))}>Reject</button></li>)}</ul>

      <h2>Users</h2><pre>{JSON.stringify(initial.users, null, 2)}</pre>
      <h2>Point Ledger</h2><pre>{JSON.stringify(initial.ledger, null, 2)}</pre>
    </main>
  );
}
