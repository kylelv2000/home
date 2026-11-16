<template>
  <div id="mobile-sites" :class="store.mobileOpenState ? 'right' : 'right hidden'">
    <!-- 移动端 Logo -->
    <div class="logo">
      <span class="bg">{{ siteUrl[0] }}</span>
      <span class="sm">.{{ siteUrl[1] }}</span>
    </div>
    <!-- 功能区 -->
    <Func />
    <!-- 网站链接 -->
    <Link />
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import Func from "@/views/Func/index.vue";
import Link from "@/components/Links.vue";
const store = mainStore();

// 站点链接
const siteUrl = computed(() => {
  const url = import.meta.env.VITE_SITE_URL;
  if (!url) return "kylelv.com".split(".");
  // 判断协议前缀
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const urlFormat = url.replace(/^(https?:\/\/)/, "");
    return urlFormat.split(".");
  }
  return url.split(".");
});
</script>

<style lang="scss" scoped>
.right {
  // flex: 1 0 0%;
  width: 50%;
  margin-left: 0.75rem;
  .logo {
    display: none;
  }
  @media (max-width: 720px) {
    margin-left: 0;
    width: 100%;
    max-width: 460px;

    .logo {
      display: block;
      margin: 0 auto 1.25rem;
      font: 2.25rem "Pacifico-Regular";
      text-align: center;

      @media (max-height: 660px) {
        margin-bottom: 0.75rem;
        font-size: 1.9rem;
      }
    }

    &.hidden {
      display: none;
    }
  }
}
</style>
