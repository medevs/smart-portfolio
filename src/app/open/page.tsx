import { formatMoney, shop } from "@/config/shop";
import { fundRaised, fundSpent, loadFarm } from "@/farm/loadFarm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dream Home Fund",
  description: "Public ledger of money in and what it was spent on.",
};

export default async function OpenPage() {
  const farm = await loadFarm();
  const raised = fundRaised(farm.fund);
  const spent = fundSpent(farm.fund);

  return (
    <main className="paper-page">
      <div className="wrap">
        <p>
          <Link href="/">← Farm</Link>
        </p>
        <h1>Dream Home Fund</h1>
        <p>
          Money in, and what it was spent on. The figures are the public ledger in the site data file — nothing here
          is estimated. Currency: {shop.currency}.
        </p>
        <p>
          In: <strong>{formatMoney(raised)}</strong>
          <br />
          Spent: <strong>{formatMoney(spent)}</strong>
          <br />
          Left: <strong>{formatMoney(raised - spent)}</strong>
        </p>

        <h2>Money in</h2>
        {farm.fund.entries.length === 0 ? (
          <p>Nothing recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Source</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {farm.fund.entries.map((entry) => (
                <tr key={`${entry.date}-${entry.source}-${entry.amount}`}>
                  <td>{entry.date}</td>
                  <td>{formatMoney(entry.amount)}</td>
                  <td>{entry.source}</td>
                  <td>{entry.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Spent on</h2>
        {farm.fund.spent.length === 0 ? (
          <p>Nothing recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Item</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {farm.fund.spent.map((entry) => (
                <tr key={`${entry.date}-${entry.item}-${entry.amount}`}>
                  <td>{entry.date}</td>
                  <td>{formatMoney(entry.amount)}</td>
                  <td>{entry.item}</td>
                  <td>{entry.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
