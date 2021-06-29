<template>
  <Modal
      :show="show"
      :theme-colors="themeColors"
      :user-options="userOptions"
      :lightbox-opacity="lightboxOpacity"
      @onClose="_toggleModal"
  />
</template>

<script>

import {ProviderController, EventController} from './controllers'
import {CLOSE_EVENT, CONNECT_EVENT, ERROR_EVENT} from "./constants";
import {getThemeColors} from "./helpers";

import {themesList} from "./themes";
import Modal from "./components/Modal.vue";

export default {
  name: "Web3ModalVue",
  components: {Modal},
  props: {
    lightboxOpacity: {
      type: Number,
      default: 0.4,
    },
    theme: {
      type: String,
      default: themesList.default.name,
    },
    cacheProvider: {
      type: Boolean,
      default: false,
    },
    disableInjectedProvider: {
      type: Boolean,
      default: false,
    },
    providerOptions: {
      default: () => {
        return {}
      }
    },
    network: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false,
      themeColors: null,
      eventController: null,
      providerController: null,
      userOptions: [],
    }
  },
  mounted() {
    this.eventController = new EventController();

    this.themeColors = getThemeColors(this.theme);

    this.providerController = new ProviderController({
      disableInjectedProvider: this.disableInjectedProvider,
      cacheProvider: this.cacheProvider,
      providerOptions: this.providerOptions,
      network: this.network
    })

    this.providerController.on(CONNECT_EVENT, provider =>
        this.onConnect(provider)
    );
    this.providerController.on(ERROR_EVENT, error => this.onError(error));

    this.userOptions = this.providerController.getUserOptions();


  },
  computed: {
    cachedProvider() {
      return this.providerController.cachedProvider;
    },
  },
  methods: {
    connect() {
      return new Promise((resolve, reject) => {
        this.on(CONNECT_EVENT, provider => resolve(provider));
        this.on(ERROR_EVENT, error => reject(error));
        this.on(CLOSE_EVENT, () => reject("Modal closed by user"));
        this.toggleModal();
      });
    },
    connectTo(id) {
      return new Promise((resolve, reject) => {
        this.on(CONNECT_EVENT, provider => resolve(provider));
        this.on(ERROR_EVENT, error => reject(error));
        this.on(CLOSE_EVENT, () => reject("Modal closed by user"));
        const provider = this.providerController.getProvider(id);
        if (!provider) {
          return reject(
              new Error(
                  `Cannot connect to provider (${id}), check provider options`
              )
          );
        }
        resolve(this.providerController.connectTo(provider.id, provider.connector));
      });
    },
    toggleModal() {
      if (this.cachedProvider) {
        this.providerController.connectToCachedProvider();
        return;
      }
      /*if (this.userOptions && this.userOptions.length === 1 && this.userOptions[0].name) {
        this.userOptions[0].onClick();
        return;
      }*/
      this._toggleModal();
    },
    on(event, callback) {
      this.eventController.on({event, callback});
      return () => this.eventController.off({event, callback});
    },
    off(event, callback) {
      this.eventController.off({event, callback});
    },
    clearCachedProvider() {
      this.providerController.clearCachedProvider();
    },
    setCachedProvider(id) {
      this.providerController.setCachedProvider(id);
    },
    updateTheme(theme) {
      this.themeColors = getThemeColors(theme);
    },
    _toggleModal() {
      const d = typeof window !== "undefined" ? document : "";
      const body = d ? d.body || d.getElementsByTagName("body")[0] : "";
      if (body) {
        if (this.show) {
          body.style.overflow = "";
        } else {
          body.style.overflow = "hidden";
        }
      }
      this.show = !this.show;
    },
    onError(error) {
      if (this.show) {
        this._toggleModal();
      }
      this.eventController.trigger(ERROR_EVENT, error);
    },
    onConnect(provider) {
      if (this.show) {
        this._toggleModal();
      }
      this.eventController.trigger(CONNECT_EVENT, provider);
    },
    onClose() {
      if (this.show) {
        this._toggleModal();
      }
      this.eventController.trigger(CLOSE_EVENT);
    }
  }
}
</script>