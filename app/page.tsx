import { desc, eq } from "drizzle-orm";
import {
  addShoppingItem,
  deletePurchasedItem,
  markShoppingItemPurchased,
} from "./actions";
import { getDb } from "../db";
import { shoppingItems } from "../db/schema";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "Тепер";
  const date = new Date(value.replace(" ", "T") + "Z");
  if (Number.isNaN(date.getTime())) return "Тепер";
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function Home() {
  const db = getDb();

  const currentItems = await db
    .select()
    .from(shoppingItems)
    .where(eq(shoppingItems.status, "active"))
    .orderBy(desc(shoppingItems.createdAt));

  const historyItems = await db
    .select()
    .from(shoppingItems)
    .where(eq(shoppingItems.status, "purchased"))
    .orderBy(desc(shoppingItems.purchasedAt), desc(shoppingItems.id));

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Сімейний список покупок</p>
        <h1>Що треба купити</h1>
        <p className="subtitle">
          Додавайте нові товари, позначайте куплене, і воно автоматично
          переходить в історію.
        </p>
      </header>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-head">
            <h2>Що треба купити</h2>
          </div>

          <div className="list-stack">
            {currentItems.length === 0 ? (
              <div className="empty-state">Поки що список порожній.</div>
            ) : (
              currentItems.map((item) => (
                <div className="list-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.quantity}</p>
                  </div>
                  <form action={markShoppingItemPurchased}>
                    <input type="hidden" name="id" value={String(item.id)} />
                    <button className="purchase-button" type="submit">
                      Куплено
                    </button>
                  </form>
                </div>
              ))
            )}

            <form action={addShoppingItem} className="add-form">
              <div className="add-fields">
                <input
                  aria-label="Назва товару"
                  className="add-input"
                  name="name"
                  placeholder="Новий товар"
                  required
                />
                <input
                  aria-label="Кількість товару"
                  className="add-input quantity"
                  name="quantity"
                  placeholder="Кількість"
                  defaultValue="1 шт"
                />
              </div>
              <button className="add-submit" type="submit" aria-label="Додати товар">
                +
              </button>
            </form>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h2>Історія</h2>
          </div>

          <div className="history-stack">
            {historyItems.length === 0 ? (
              <div className="empty-state">Поки що немає куплених товарів.</div>
            ) : (
              historyItems.map((item) => (
                <div className="history-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.quantity}</p>
                  </div>
                  <div className="history-actions">
                    <span>{formatDate(item.purchasedAt)}</span>
                    <form action={deletePurchasedItem}>
                      <input type="hidden" name="id" value={String(item.id)} />
                      <button className="delete-button" type="submit" aria-label={`Видалити ${item.name}`}>
                        ×
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
