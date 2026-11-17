const endpoint = "https://restapi.amap.com/v3";
const isCityCode = (code) => typeof code === "string" && /^\d{6}$/.test(code);

async function getAmap(path, params) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${endpoint}/${path}?${new URLSearchParams(params)}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`高德 HTTP ${response.status}`);
    const result = await response.json();
    if (result.infocode !== "10000") throw new Error(`高德接口错误 ${result.infocode}`);
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getLocalWeather(key, cityCode) {
  if (!key) throw new Error("未配置高德天气 Key");
  if (!isCityCode(cityCode)) {
    const location = await getAmap("ip", { key });
    if (!isCityCode(location.adcode)) return null;
    cityCode = location.adcode;
  }

  const { lives } = await getAmap("weather/weatherInfo", { key, city: cityCode });
  const live = lives?.[0];
  if (!live?.city || !live.weather || !live.temperature) {
    throw new Error("高德没有返回当前天气");
  }
  return {
    city: live.city,
    description: live.weather,
    temperature: live.temperature,
    windDirection: live.winddirection,
    windPower: live.windpower,
  };
}

export async function findWeatherCity(key, name) {
  if (!key) throw new Error("未配置高德天气 Key");
  const result = await getAmap("config/district", { key, keywords: name, subdistrict: 0 });
  const matches = (result.districts ?? []).filter((district) =>
    ["city", "district", "province"].includes(district.level) && isCityCode(district.adcode),
  );
  const normalizedName = name.replace(/市$/, "");
  const exact = matches.filter((district) => district.name.replace(/市$/, "") === normalizedName);
  if (exact.length === 1) return exact[0].adcode;
  if (matches.length === 1) return matches[0].adcode;
  return null;
}
