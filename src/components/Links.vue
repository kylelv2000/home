<template>
  <div v-if="siteLinks[0]" class="links">
    <div class="line">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title">网站列表</span>
    </div>
    <!-- 网站列表 -->
    <Swiper
      v-if="siteLinks[0]"
      :modules="[Pagination, Mousewheel]"
      :slides-per-view="1"
      :space-between="40"
      :pagination="siteLinksList.length > 1 && {
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }"
      :mousewheel="siteLinksList.length > 1"
    >
      <SwiperSlide v-for="site in siteLinksList" :key="site">
        <el-row class="link-all" :gutter="20">
          <el-col v-for="(item, index) in site" :span="8" :key="item">
            <a
              class="item cards"
              :href="item.link"
              target="_blank"
              rel="noopener"
              :style="index < 3 ? 'margin-bottom: 20px' : null"
              @click="maybeOpenMusic($event, item)"
            >
              <Icon size="26">
                <component :is="siteIcon[item.icon]" />
              </Icon>
              <span class="name">{{ item.name }}</span>
            </a>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div v-if="siteLinksList.length > 1" class="swiper-pagination" />
    </Swiper>
  </div>
</template>

<script setup>
import { Icon } from "@vicons/utils";
// 可前往 https://www.xicons.org 自行挑选并在此处引入
import { Link, Blog, CompactDisc, Cloud, Compass, Book, Fire, LaptopCode,BookOpen } from "@vicons/fa"; // 注意使用正确的类别
import { DownloadSharp, LiveTvFilled } from "@vicons/material"; 
import { ApiApp } from "@vicons/tabler"; 
import { ChatBubblesQuestion24Filled, Person32Filled } from "@vicons/fluent"; 

import { mainStore } from "@/store";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Mousewheel } from "swiper/modules";
import siteLinks from "@/assets/siteLinks.json";

const store = mainStore();

// 计算网站链接
const siteLinksList = computed(() => {
  const result = [];
  for (let i = 0; i < siteLinks.length; i += 6) {
    const subArr = siteLinks.slice(i, i + 6);
    result.push(subArr);
  }
  return result;
});

// 网站链接图标
const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
  BookOpen,
  LiveTvFilled,
  ChatBubblesQuestion24Filled,
  ApiApp,
  DownloadSharp,
  Person32Filled,
};

// 链接跳转
const maybeOpenMusic = (event, data) => {
  if (data.name === "音乐" && store.musicClick && typeof $openList === "function") {
    event.preventDefault();
    $openList();
  }
};

onMounted(() => {
  console.log(siteLinks);
});
</script>

<style lang="scss" scoped>
.links {
  .line {
    margin: 2rem 0.25rem 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    animation: fade 0.5s;
    .title {
      margin-left: 8px;
      font-size: 1.15rem;
      text-shadow: 0 0 5px #00000050;
    }
  }
  .swiper {
    left: -10px;
    width: calc(100% + 20px);
    padding: 5px 10px 0;
    z-index: 0;
    .swiper-slide {
      height: 100%;
    }
    .swiper-pagination {
      margin-top: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      :deep(.swiper-pagination-bullet) {
        background-color: #fff;
        width: 20px;
        height: 4px;
        margin: 0 4px;
        border-radius: 4px;
        opacity: 0.2;
        transition: opacity 0.3s;
        &.swiper-pagination-bullet-active {
          opacity: 1;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .link-all {
    height: 220px;
    .item {
      background-color: var(--link-fill);
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      animation: fade 0.5s;

      &:hover {
        color: inherit;
        text-decoration: none;
        transform: scale(1.02);
        background: rgb(0 0 0 / 40%);
        transition: 0.3s;
      }

      &:active {
        transform: scale(1);
      }

      .name {
        font-size: 1.1rem;
        margin-left: 8px;
        text-align: center;
        line-height: 1.25;
      }

      &:focus-visible {
        outline: 2px solid rgb(255 255 255 / 75%);
        outline-offset: -2px;
      }
      @media (max-width: 720px) {
        height: 80px;
      }
      @media (max-width: 460px), (min-width: 721px) and (max-width: 820px) {
        flex-direction: column;
        .name {
          font-size: 0.875rem;
          margin-left: 0;
          margin-top: 8px;
        }
      }
    }
    @media (max-width: 720px) {
      height: 180px;
    }
  }

  @media (max-width: 720px) and (max-height: 660px),
    (min-width: 721px) and (max-height: 560px) {
    .line {
      margin: 1rem 0.25rem 0.625rem;
    }
    .link-all {
      height: 148px;

      .item {
        height: 64px;
      }
    }
  }
}
</style>
