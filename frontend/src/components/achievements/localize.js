// The backend ships achievement titles in German. Map the known ones to
// translation keys so they follow the selected UI language.
const TITLE_KEYS = {
  "Erster Kritiker": "firstCritic",
  Kritiker: "critic",
  Meisterkritiker: "masterCritic",
  CineGuru: "cineGuru",
  Filmfan: "filmFan",
  Kinogänger: "moviegoer",
  "Movie Buff": "movieBuff",
  "Serien Starter": "seriesStarter",
  "Serien Binger": "seriesBinger",
  "Serien Addict": "seriesAddict",
  Diskutant: "debater",
  Moderator: "moderator",
  Gesellig: "sociable",
  "Social Butterfly": "socialButterfly",
  Marathoner: "marathoner",
  Zeitreisender: "timeTraveler",
};

export const achievementTitle = (achievement, t) => {
  const key = TITLE_KEYS[achievement?.title];
  return key ? t(`achievements.catalog.${key}`) : achievement?.title;
};

export const achievementDescription = (achievement, t, has) => {
  const key = `achievements.goals.${achievement?.type}`;
  if (achievement?.threshold && has(key)) {
    return t(key, { count: achievement.threshold });
  }
  return achievement?.description;
};
