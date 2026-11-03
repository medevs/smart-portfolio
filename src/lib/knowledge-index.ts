/** Stage the new index before retiring known old rows. Failed writes preserve the old index. */
export async function replaceKnowledgeIndex<T>({
  documents,
  snapshot,
  add,
  remove,
}: {
  documents: T[];
  snapshot: () => Promise<string[]>;
  add: (documents: T[]) => Promise<string[]>;
  remove: (ids: string[]) => Promise<void>;
}) {
  if (!documents.length)
    throw new Error("Refusing to replace the knowledge index with no documents.");
  const previous = await snapshot();
  const created = await add(documents);
  if (
    created.length !== documents.length ||
    new Set(created).size !== created.length ||
    created.some((id) => previous.includes(id))
  ) {
    throw new Error("The new index could not be verified. Existing documents have been kept.");
  }
  if (previous.length) await remove(previous);
  return created;
}
