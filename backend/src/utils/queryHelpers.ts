import type { Model, QueryFilter } from 'mongoose'

interface ListOptions {
  page: number
  limit: number
  sort: Record<string, 1 | -1>
}

/** Shared list logic for every "public, published-only, paginated" resource. */
export async function listPublished<T>(model: Model<T>, filter: QueryFilter<T>, opts: ListOptions) {
  const query = { isPublished: true, ...filter } as QueryFilter<T>
  const [items, total] = await Promise.all([
    model
      .find(query)
      .sort(opts.sort)
      .skip((opts.page - 1) * opts.limit)
      .limit(opts.limit),
    model.countDocuments(query),
  ])
  return { items, total }
}

/** Shared "list everything published, no pagination" logic for small collections (ministries, leadership). */
export async function listAllPublished<T>(
  model: Model<T>,
  filter: QueryFilter<T>,
  sort: Record<string, 1 | -1>,
) {
  const query = { isPublished: true, ...filter } as QueryFilter<T>
  return model.find(query).sort(sort)
}

export async function getPublishedBySlug<T>(model: Model<T>, slug: string) {
  return model.findOne({ slug, isPublished: true } as QueryFilter<T>)
}
