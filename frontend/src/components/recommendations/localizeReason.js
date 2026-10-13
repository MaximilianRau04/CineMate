// The backend builds recommendation reasons as German sentences
// (see RecommendationService). Translate the known patterns so the reason
// follows the selected UI language; unknown text is shown unchanged.
const PATTERNS = [
  [/^Du magst (.+)$/, "youLike", ["items"]],
  [/^Filme von (.+)$/, "moviesBy", ["items"]],
  [/^Weitere Serien von (.+)$/, "moreSeriesBy", ["items"]],
  [/^Beliebter Film mit ([\d.,]+)\/5/, "popularMovie", ["rating"]],
  [/^Beliebte Serie mit ([\d.,]+)\/5/, "popularSeries", ["rating"]],
  [/^Empfohlen für (.+) fans$/i, "forGenreFans", ["genre"]],
  [/^Von (\d+) ähnlichen Benutzern empfohlen$/, "similarUsers", ["count"]],
  [
    /^(Basierend auf deinen Vorlieben|Based on your preferences)$/,
    "basedOnPrefs",
    [],
  ],
  [/^Perfekt für den Start in den Tag$/, "moodMorning", []],
  [/^Ideal für den Feierabend$/, "moodEvening", []],
  [/^Spannend für späte Stunden$/, "moodNight", []],
  [/^Community recommendation$/, "community", []],
];

const translatePart = (part, t) => {
  for (const [regex, key, names] of PATTERNS) {
    const match = regex.exec(part.trim());
    if (match) {
      const params = {};
      names.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      if (params.count !== undefined) params.count = Number(params.count);
      return t(`recommendations.reasons.${key}`, params);
    }
  }
  return part.trim();
};

export const localizeReason = (reason, t) => {
  if (!reason) return "";
  const text = reason.replace(
    /^(Content-based|Community-based|Hybrid):\s*/i,
    "",
  );
  return text
    .split(/\s+(?:und|and|\+)\s+/)
    .map((part) => translatePart(part, t))
    .join(" · ");
};
