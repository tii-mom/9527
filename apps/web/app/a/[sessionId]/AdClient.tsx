"use client";

import { useEffect, useState } from "react";

export default function AdClient({ session, claimToken, apiBaseUrl }: { session: any; claimToken: string; apiBaseUrl: string }) {
  const [left, setLeft] = useState(20);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${apiBaseUrl}/v1/ad-sessions/${session.id}/viewed`, {
      method: "POST",
      headers: { "x-9527-claim-token": claimToken },
    }).catch(() => {});
    const timer = setInterval(() => setLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [apiBaseUrl, claimToken, session.id]);

  async function complete() {
    const response = await fetch(`${apiBaseUrl}/v1/ad-sessions/${session.id}/completed`, {
      method: "POST",
      headers: { "x-9527-claim-token": claimToken },
    });
    const json = await response.json();
    setMessage(json.ok ? `Rewarded +${json.data.points} points. Balance: ${json.data.balance.availablePoints}` : json.error.message);
  }

  async function clickSponsor() {
    await fetch(`${apiBaseUrl}/v1/ad-sessions/${session.id}/clicked`, {
      method: "POST",
      headers: { "x-9527-claim-token": claimToken },
    }).catch(() => {});
  }

  return (
    <main>
      <p>Sponsored</p>
      <h1>{session.campaign.sponsorName}</h1>
      <h2>{session.campaign.headline}</h2>
      <p>{session.campaign.body}</p>
      <p>Reward: +{session.rewardPoints} points</p>
      <p>
        <a onClick={clickSponsor} href={session.campaign.targetUrl} target="_blank" rel="noreferrer">
          Visit sponsor
        </a>
      </p>
      <button disabled={left > 0 || !claimToken} onClick={complete}>
        {left > 0 ? `Complete in ${left}s` : "Complete and claim points"}
      </button>
      {!claimToken ? <p>Missing secure session claim token. Please open the full landing URL from the CLI.</p> : null}
      <p>{message}</p>
    </main>
  );
}
