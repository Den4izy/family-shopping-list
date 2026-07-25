"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import { shoppingItems } from "../db/schema";

function normalizeValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function addShoppingItem(formData: FormData) {
  const name = normalizeValue(formData.get("name"));
  const quantity = normalizeValue(formData.get("quantity")) || "1 шт";

  if (!name) return;

  const db = getDb();
  await db.insert(shoppingItems).values({
    name,
    quantity,
    status: "active",
  });

  revalidatePath("/shopping");
}

export async function markShoppingItemPurchased(formData: FormData) {
  const idValue = normalizeValue(formData.get("id"));
  const id = Number(idValue);

  if (!Number.isInteger(id)) return;

  const db = getDb();
  await db
    .update(shoppingItems)
    .set({
      status: "purchased",
      purchasedAt: sql`CURRENT_TIMESTAMP`,
    })
    .where(and(eq(shoppingItems.id, id), eq(shoppingItems.status, "active")));

  revalidatePath("/shopping");
}

export async function deletePurchasedItem(formData: FormData) {
  const idValue = normalizeValue(formData.get("id"));
  const id = Number(idValue);

  if (!Number.isInteger(id)) return;

  const db = getDb();
  await db
    .delete(shoppingItems)
    .where(and(eq(shoppingItems.id, id), eq(shoppingItems.status, "purchased")));

  revalidatePath("/shopping");
}
