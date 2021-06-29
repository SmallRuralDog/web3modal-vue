<template>
  <transition name="fade">
    <SLightbox
        :class="MODAL_LIGHTBOX_CLASSNAME"
        :offset="lightboxOffset"
        :opacity="lightboxOpacity"
        :show="show"
        ref="lightboxRef"
        v-show="show"
    >
      <SModalContainer :class="MODAL_CONTAINER_CLASSNAME" :show="show">
        <SHitbox :class="MODAL_HITBOX_CLASSNAME" @click="onClose"/>
        <SModalCard
            :class="MODAL_CARD_CLASSNAME"
            :show="show"
            :themeColors="themeColors"
            :maxWidth="userOptions.length < 3 ? 500 : 800"
        >
          <template v-for="(provider,index) in userOptions">
            <Provider
                v-if="provider"
                :key="index"
                :name="provider.name"
                :logo="provider.logo"
                :description="provider.description"
                :theme-colors="themeColors"
                @onClick="provider.onClick"
            />
          </template>
        </SModalCard>
      </SModalContainer>
    </SLightbox>
  </transition>
</template>

<script>
import styled from 'vue-styled-components'
import {
  MODAL_LIGHTBOX_CLASSNAME,
  MODAL_CONTAINER_CLASSNAME,
  MODAL_HITBOX_CLASSNAME,
  MODAL_CARD_CLASSNAME
} from "../constants";
import Provider from "./Provider.vue";

const SLightbox = styled('div', {offset: Number, opacity: Number, show: Boolean})`
  text-align: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  margin-left: -50vw;
  top: ${({offset}) => (offset ? `-${offset}px` : 0)};
  left: 50%;
  z-index: 2;
  will-change: opacity;
  background-color: ${({opacity}) => {
    let alpha = 0.4;
    if (typeof opacity === "number") {
      alpha = opacity;
    }
    return `rgba(0, 0, 0, ${alpha})`;
  }};

  pointer-events: ${({show}) => (show ? "auto" : "none")};
  display: flex;
  justify-content: center;
  align-items: center;

  & * {
    box-sizing: border-box !important;
  }
`;
const SModalContainer = styled('div', {show: Boolean})`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: ${({show}) => (show ? "auto" : "none")};
`;
const SHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const SModalCard = styled('div', {themeColors: Object, show: Boolean, maxWidth: Number})`
  position: relative;
  width: 100%;
  background-color: ${({themeColors}) => themeColors.background};
  border-radius: 12px;
  margin: 10px;
  padding: 0;

  pointer-events: ${({show}) => (show ? "auto" : "none")};

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  max-width: ${({maxWidth}) => (maxWidth ? `${maxWidth}px` : "800px")};
  min-width: fit-content;
  max-height: 100%;
  overflow: auto;
  @media screen and (max-width: 768px) {
    max-width: ${({maxWidth}) => (maxWidth ? `${maxWidth}px` : "500px")};
    grid-template-columns: 1fr;
  }

}
`;
export default {
  name: "Modal",
  props: ["show", "themeColors", "userOptions", "lightboxOpacity"],
  components: {SModalCard, SHitbox, SModalContainer, SLightbox, Provider},
  data() {
    return {
      lightboxOffset: 0,
      MODAL_LIGHTBOX_CLASSNAME,
      MODAL_CONTAINER_CLASSNAME,
      MODAL_HITBOX_CLASSNAME,
      MODAL_CARD_CLASSNAME
    }
  },
  mounted() {
    window.updateWeb3Modal = this
  },
  updated() {
    if (this.$refs.lightboxRef) {
      const lightboxRect = this.$refs.lightboxRef;
      const lightboxOffset = lightboxRect.top > 0 ? lightboxRect.top : 0;

      if (lightboxOffset !== this.lightboxOffset && lightboxOffset !== this.state.lightboxOffset
      ) {
        this.lightboxOffset = lightboxOffset
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    }
  }
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>