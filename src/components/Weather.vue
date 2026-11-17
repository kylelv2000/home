<template>
  <div class="weather" aria-live="polite">
    <form v-if="choosingCity" class="city-form" @submit.prevent="saveCity">
      <div class="city-field">
        <input
          v-model.trim="cityName"
          ref="cityInput"
          aria-label="天气城市"
          placeholder="城市名"
          maxlength="30"
          :disabled="loading"
          @keydown.esc="cancelCity"
        />
        <button type="submit" :disabled="!cityName || loading">确定</button>
        <button type="button" :disabled="loading" @click="cancelCity">取消</button>
      </div>
      <span v-if="cityError" class="city-error">{{ cityError }}</span>
    </form>
    <button v-else-if="weather" type="button" class="weather-action" title="更改天气城市" @click="openCity">
      <span>{{ weather.city }}&nbsp;</span>
      <span>{{ weather.description }}&nbsp;</span>
      <span>{{ weather.temperature }}℃</span>
      <span v-if="weather.windDirection && weather.windPower" class="sm-hidden">
        &nbsp;{{ windDirection }}&nbsp;{{ weather.windPower }}&nbsp;级
      </span>
    </button>
    <button v-else-if="missingCity" type="button" class="weather-action" @click="openCity">选择天气城市</button>
    <span v-else>{{ loading ? "天气加载中…" : "天气暂不可用" }}</span>
  </div>
</template>

<script setup>
import { findWeatherCity, getLocalWeather } from "@/api/weather";
import { rememberWallpaperWeather } from "@/utils/wallpaper";

const key = import.meta.env.VITE_WEATHER_KEY;
const cityStorageKey = "weather-city";
const weather = ref(null);
const loading = ref(true);
const missingCity = ref(false);
const choosingCity = ref(false);
const cityName = ref("");
const cityError = ref("");
const cityInput = ref(null);

const windDirection = computed(() => {
  const direction = weather.value?.windDirection;
  return direction?.endsWith("风") ? direction : `${direction}风`;
});

async function openCity() {
  cityName.value = weather.value?.city ?? "";
  cityError.value = "";
  choosingCity.value = true;
  await nextTick();
  cityInput.value?.select();
}

function cancelCity() {
  if (!loading.value) choosingCity.value = false;
}

async function saveCity() {
  if (loading.value || !cityName.value) return;
  loading.value = true;
  cityError.value = "";
  try {
    const code = await findWeatherCity(key, cityName.value);
    if (!code) {
      cityError.value = "请填写完整城市名";
      return;
    }
    weather.value = await getLocalWeather(key, code);
    rememberWallpaperWeather(weather.value.description);
    choosingCity.value = false;
    try {
      localStorage.setItem(cityStorageKey, code);
    } catch {
      // 浏览器可能禁止本地存储。
    }
  } catch {
    cityError.value = "天气暂不可用";
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    let cityCode;
    try {
      cityCode = localStorage.getItem(cityStorageKey);
    } catch {
      // 浏览器可能禁止本地存储。
    }
    weather.value = await getLocalWeather(key, cityCode);
    missingCity.value = weather.value === null;
    if (weather.value) rememberWallpaperWeather(weather.value.description);
  } catch {
    // 接口失败时保留时钟。
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.weather-action {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: none;
  border: 0;
  font: inherit;
  cursor: pointer;
}

.weather-action:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.city-field {
  display: flex;
  justify-content: center;
  gap: 3px;
}

.city-field input,
.city-field button {
  min-width: 0;
  padding: 3px;
  border: 1px solid #ffffff50;
  border-radius: 4px;
  background: #00000030;
  font: inherit;
}

.city-field input {
  width: 6em;
}

.city-field input::placeholder {
  color: #ffffffb0;
}

.city-field button {
  flex: 0 0 auto;
  cursor: pointer;
}

.city-error {
  display: block;
  margin-top: 3px;
}
</style>
