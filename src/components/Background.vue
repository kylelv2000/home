<template>
  <div class="cover" :class="{ show: store.backgroundShow, bright: brightWallpaper }">
    <img
      v-show="store.imgLoadStatus"
      :src="bgUrl"
      class="bg"
      alt=""
      @load="imgLoadComplete"
      @error="imgLoadError"
      @animationend="imgAnimationEnd"
    />
    <div class="gray" :class="{ hidden: store.backgroundShow }" />
    <Transition name="fade" mode="out-in">
      <a
        v-if="store.backgroundShow && bgUrl && store.coverType != '3'"
        class="down"
        :href="bgUrl"
        target="_blank"
        rel="noopener"
      >
        下载壁纸
      </a>
    </Transition>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import { Error } from "@icon-park/vue-next";
import wallpapers from "@/assets/wallpapers.json";
import { pickWallpaper, readWallpaperWeather, wallpaperResolution } from "@/utils/wallpaper";

const store = mainStore();
const bgUrl = ref(null);
const brightWallpaper = ref(false);
let selectedWallpaper;
const imgTimeout = ref(null);
const emit = defineEmits(["loadComplete"]);

// 默认壁纸失败时，沿用模板随附的 JPG。
const legacyWallpaper = `/images/background2${Math.floor(Math.random() * 3 + 1)}.jpg`;

const updateWallpaperSize = () => {
  if (!selectedWallpaper) return;
  const size = wallpaperResolution(window.innerWidth, window.innerHeight, window.devicePixelRatio);
  bgUrl.value = `/images/wallpapers-v1/${size}/${selectedWallpaper.file}.webp`;
};

const changeBg = (type) => {
  brightWallpaper.value = false;
  selectedWallpaper = undefined;
  if (type == 0) {
    selectedWallpaper = pickWallpaper(wallpapers, new Date(), readWallpaperWeather());
    if (!selectedWallpaper) {
      bgUrl.value = legacyWallpaper;
      return;
    }
    brightWallpaper.value = Boolean(selectedWallpaper.bright);
    updateWallpaperSize();
  } else if (type == 1) {
    bgUrl.value = "https://api.dujin.org/bing/1920.php";
  } else if (type == 2) {
    bgUrl.value = "https://api.vvhan.com/api/wallpaper/views";
  } else if (type == 3) {
    bgUrl.value = "https://api.vvhan.com/api/wallpaper/acg";
  } else if (type == 4 && store.customUrl) {
    bgUrl.value = store.customUrl;
  }
};

// 图片加载完成
const imgLoadComplete = () => {
  if (store.imgLoadStatus) return;
  imgTimeout.value = setTimeout(
    () => {
      store.setImgLoadStatus(true);
    },
    Math.floor(Math.random() * (600 - 300 + 1)) + 300,
  );
};

// 图片动画完成
const imgAnimationEnd = () => {
  console.log("壁纸加载且动画完成");
  // 加载完成事件
  emit("loadComplete");
};

// 图片显示失败
const imgLoadError = () => {
  if (!bgUrl.value) return;
  if (bgUrl.value === legacyWallpaper) {
    bgUrl.value = null;
    store.setImgLoadStatus(true);
    emit("loadComplete");
    return;
  }
  brightWallpaper.value = false;
  selectedWallpaper = undefined;
  console.error("壁纸加载失败：", bgUrl.value);
  ElMessage({
    message: "壁纸加载失败，已临时切换回默认",
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  bgUrl.value = legacyWallpaper;
};

// 监听壁纸切换
watch(
  () => [store.coverType, store.customUrl],
  ([value]) => changeBg(value),
);

onMounted(() => {
  // 加载壁纸
  changeBg(store.coverType);
  window.addEventListener("resize", updateWallpaperSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWallpaperSize);
  clearTimeout(imgTimeout.value);
});
</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s;
  z-index: -1;

  &.show {
    z-index: 1;
  }
  &.bright .gray {
    background-color: rgb(15 27 43 / 16%);
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    filter: blur(20px) brightness(0.3);
    transition:
      filter 0.3s,
      transform 0.3s;
    animation: fade-blur-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.45s;
  }
  .gray {
    opacity: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);

    transition: 1.5s;
    &.hidden {
      opacity: 0;
      transition: 1.5s;
    }
  }
  .down {
    font-size: 16px;
    color: white;
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    padding: 20px 26px;
    border-radius: 8px;
    background-color: #00000030;
    width: 120px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      transform: scale(1.05);
      background-color: #00000060;
    }
    &:active {
      transform: scale(1);
    }
  }
}
</style>
