const WEATHER_KEY = "wallpaper-weather";
const WEATHER_TTL = 30 * 60 * 1000;

export function wallpaperPeriod(date) {
  const minute = date.getHours() * 60 + date.getMinutes();
  if (minute < 5 * 60 || minute >= 20 * 60 + 30) return "night";
  if (minute < 9 * 60) return "dawn";
  if (minute < 16 * 60) return "day";
  if (minute < 18 * 60 + 30) return "sunset";
  return "blue";
}

export function pickWallpaper(wallpapers, date, weather) {
  const period = wallpapers.filter((image) => image.period === wallpaperPeriod(date));
  const match = weather ? period.filter((image) => image.weather === weather) : [];
  const pool = match.length ? match : period;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function wallpaperResolution(width, height, pixelRatio) {
  if (width <= 720 && height > width) return "mobile";
  return width >= 1440 && width * pixelRatio > 2560 ? "4k" : "qhd";
}

export function readWallpaperWeather() {
  try {
    const { kind, time } = JSON.parse(sessionStorage.getItem(WEATHER_KEY));
    const age = Date.now() - time;
    if (age >= 0 && age < WEATHER_TTL) return kind;
  } catch {
    // 访问受限或没有缓存时，按时段选图。
  }
}

export function rememberWallpaperWeather(text) {
  const kind = /雨/.test(text) ? "rain" : /阴|多云|雾/.test(text) ? "cloudy"
    : /晴/.test(text) ? "clear" : null;
  try {
    if (kind) sessionStorage.setItem(WEATHER_KEY, JSON.stringify({ kind, time: Date.now() }));
    else sessionStorage.removeItem(WEATHER_KEY);
  } catch {
    // 壁纸不依赖浏览器存储。
  }
}
