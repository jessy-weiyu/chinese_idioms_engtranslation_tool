import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "petci-main/data/json/filtered.json");
const outputPath = path.join(root, "public/data/idioms.json");

function uniq(values) {
  return Array.from(
    new Set(
      values
        .filter(Boolean)
        .map((item) => String(item).trim())
        .filter(Boolean)
    )
  );
}

function normalizeSearchText(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\u4e00-\u9fff]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const raw = JSON.parse(await readFile(sourcePath, "utf8"));

const data = raw.map((item) => {
  const literalTranslations = uniq(item.machine ?? []);
  const literaryTranslations = uniq([item.gold, ...(item.human ?? [])]);
  const proverbTranslations = uniq(
    [...literaryTranslations, ...literalTranslations].filter((entry) =>
      /as |like |proverb|saying|idiom|than|when|where|who|that/i.test(entry)
    )
  ).slice(0, 4);
  const allTranslations = uniq([
    ...literalTranslations,
    ...literaryTranslations,
    ...proverbTranslations
  ]);

  return {
    id: Number(item.id),
    idiom: String(item.chinese),
    literalTranslations,
    literaryTranslations,
    proverbTranslations:
      proverbTranslations.length > 0 ? proverbTranslations : literaryTranslations.slice(0, 3),
    searchTextZh: String(item.chinese),
    searchTextEn: normalizeSearchText(allTranslations.join(" "))
  };
});

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

console.log(`Prepared ${data.length} idiom records -> ${path.relative(root, outputPath)}`);
