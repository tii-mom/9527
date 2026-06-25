async function getItems() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/v1/shop/items`, { cache: "no-store" });
    return (await response.json()).data.items;
  } catch {
    return [];
  }
}

export default async function Rewards() {
  const items = await getItems();
  return (
    <main>
      <h1>Rewards shop</h1>
      <ul>
        {items.map((item: any) => (
          <li key={item.id}>
            <b>{item.name}</b> — {item.pointsPrice} pts {item.requiresReview ? "(manual review)" : ""}
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
