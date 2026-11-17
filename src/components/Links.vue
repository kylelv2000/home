<template>
  <div v-if="siteLinks[0]" class="links">
    <div class="line">
      <Icon size="20" aria-hidden="true"><Link /></Icon>
      <span class="title">网站列表</span>
    </div>
    <Swiper
      :modules="[A11y, Pagination, Mousewheel]"
      :space-between="40"
      :pagination="pages.length > 1 && { clickable: true }"
      :mousewheel="pages.length > 1 && { releaseOnEdges: true }"
      :a11y="{ paginationBulletMessage: '第 {{index}} 页' }"
    >
      <SwiperSlide v-for="page in pages" :key="page[0].name">
        <div class="link-all">
          <component
            v-for="item in page"
            :is="item.link ? 'a' : 'div'"
            :key="item.link || item.name"
            class="item cards"
            :href="item.link"
            :target="item.link ? '_blank' : undefined"
            :rel="item.link ? 'noopener' : undefined"
            :role="item.link ? undefined : 'link'"
            :aria-disabled="item.link ? undefined : 'true'"
            @click="item.link && maybeOpenMusic($event, item)"
          >
            <Icon size="24" aria-hidden="true">
              <component :is="siteIcon[item.icon] || Link" />
            </Icon>
            <span class="name">{{ item.name }}</span>
          </component>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Icon } from "@vicons/utils";
import { Activity, ApiApp, News, Book2, Compass, DeviceTv, Link, Lock, Movie, Receipt, School } from "@vicons/tabler";
import { Swiper, SwiperSlide } from "swiper/vue";
import { A11y, Mousewheel, Pagination } from "swiper/modules";
import { mainStore } from "@/store";
import siteLinks from "@/assets/siteLinks.json";

const store = mainStore();
const siteIcon = { Activity, ApiApp, News, Book2, Compass, DeviceTv, Lock, Movie, Receipt, School };
const cardsPerPage = 6;
const pages = [];
for (let index = 0; index < siteLinks.length; index += cardsPerPage) {
  pages.push(siteLinks.slice(index, index + cardsPerPage));
}

// 链接跳转
const maybeOpenMusic = (event, data) => {
  if (data.name === "音乐" && store.musicClick && typeof $openList === "function") {
    event.preventDefault();
    $openList();
  }
};
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
    :deep(.swiper-pagination) {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      justify-content: center;
    }

    :deep(.swiper-pagination-bullet) {
      width: 20px;
      height: 8px;
      border: 0;
      border-radius: 5px;
      background: rgb(255 255 255 / 34%);
      cursor: pointer;
    }

    :deep(.swiper-pagination-bullet-active) {
      background: #fff;
    }
  }

  .link-all {
    --card-gap: 20px;
    --card-height: 100px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(2, var(--card-height));
    gap: var(--card-gap);

    .item {
      background-color: var(--link-fill);
      min-width: 0;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      animation: fade 0.5s;

      &[aria-disabled="true"] {
        opacity: 0.65;
        cursor: default;
        transform: none;
      }

      &:any-link:hover {
        color: inherit;
        text-decoration: none;
        transform: scale(1.02);
        background: rgb(0 0 0 / 40%);
        transition: 0.3s;
      }

      &:any-link:active {
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
      @media (max-width: 460px), (min-width: 721px) and (max-width: 960px) {
        flex-direction: column;
        padding-inline: 6px;
        .name {
          font-size: 0.875rem;
          margin-left: 0;
          margin-top: 8px;
        }
      }
    }
    @media (max-width: 720px) {
      --card-gap: 12px;
      --card-height: 80px;
    }
  }

  @media (max-width: 720px) and (max-height: 660px),
    (min-width: 721px) and (max-height: 560px) {
    .line {
      margin: 1rem 0.25rem 0.625rem;
    }
    .link-all {
      --card-height: 64px;
    }
  }
}
</style>
