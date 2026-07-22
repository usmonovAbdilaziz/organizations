const fs = require("fs");

const data = JSON.parse(fs.readFileSync("district.json", "utf8"));

const cleaned = data.map((item) => {
  const clean = (value) =>
    String(value ?? "").replace(/^="/, "").replace(/"$/, "").trim();

  return {
    regionId: clean(item['="region_id"']),
    nameUz: clean(item['="name_uz"']),
    nameRu: clean(item['="faktura_district_name"']),
    nameEn: clean(item['="name_en"']),
    slug: clean(item['="slug"']),
  };
});

fs.writeFileSync(
  "district-clean.json",
  JSON.stringify(cleaned, null, 2),
  "utf8"
);

console.log("✅ district-clean.json yaratildi");