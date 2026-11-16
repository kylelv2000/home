<template>
  <!-- 功能区域 -->
  <div class="function">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="left">
          <Hitokoto />
          <Music v-if="playerHasId" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="right cards">
          <div class="time">
            <div class="date">
              <span>{{ currentTime.year }}&nbsp;年&nbsp;</span>
              <span>{{ currentTime.month }}&nbsp;月&nbsp;</span>
              <span>{{ currentTime.day }}&nbsp;日&nbsp;</span>
              <span class="sm-hidden">{{ currentTime.weekday }}</span>
            </div>
            <div class="text">
              <span> {{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
            </div>
          </div>
          <Weather />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getCurrentTime } from "@/utils/getTime";
import Music from "@/components/Music.vue";
import Hitokoto from "@/components/Hitokoto.vue";
import Weather from "@/components/Weather.vue";

// 当前时间
const currentTime = ref({});
const timeInterval = ref(null);

// 播放器 id
const playerHasId = import.meta.env.VITE_SONG_ID;

// 更新时间
const updateTimeData = () => {
  currentTime.value = getCurrentTime();
};

onMounted(() => {
  updateTimeData();
  timeInterval.value = setInterval(updateTimeData, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.function {
  height: 165px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .el-row {
    height: 100%;
    width: 100%;
    margin: 0 !important;
    .el-col {
      min-width: 0;
      height: 100%;

      &:nth-of-type(1) {
        padding-left: 0 !important;
      }
      &:nth-of-type(2) {
        padding-right: 0 !important;
      }
    }
    .left,
    .right {
      width: 100%;
      height: 100%;
    }
    .right {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      animation: fade 0.5s;
      .time {
        font-size: 1.1rem;
        text-align: center;
        .date {
          text-overflow: ellipsis;
          overflow-x: hidden;
          white-space: nowrap;
        }
        .text {
          margin-top: 10px;
          font-size: 3.25rem;
          letter-spacing: 2px;
          font-family: "UnidreamLED";
        }
        @media (min-width: 1201px) and (max-width: 1280px) {
          font-size: 1rem;
        }
        @media (min-width: 911px) and (max-width: 992px) {
          font-size: 1rem;
          .text {
            font-size: 2.75rem;
          }
        }
      }
      .weather {
        text-align: center;
        width: 100%;
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
      }
    }
  }

  @media (max-width: 910px) {
    .el-row .el-col {
      &:nth-of-type(1) {
        padding-right: 5px !important;
      }
      &:nth-of-type(2) {
        padding-left: 5px !important;
      }
    }

    .el-row .right {
      padding: 12px 8px;

      .time {
        font-size: 0.875rem;

        .text {
          font-size: clamp(1.9rem, 4vw, 2.6rem);
          letter-spacing: 1px;
        }
      }

      .weather {
        font-size: 0.8125rem;
      }
    }

    :deep(.sm-hidden) {
      display: none;
    }
  }

  @media (max-width: 720px) and (max-height: 660px),
    (min-width: 721px) and (max-height: 560px) {
    height: 124px;

    .el-row .time .text {
      margin-top: 6px;
    }
  }

  @media (min-width: 911px) and (max-height: 560px) {
    .el-row .right {
      padding-block: 12px;

      .time .text {
        font-size: 2.6rem;
      }
    }
  }
}
</style>
