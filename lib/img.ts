export const sanityImg = (url?: string | null, w = 1200) =>
  url && url.includes("cdn.sanity.io") ? `${url}?w=${w}&auto=format&q=80` : url ?? undefined;
