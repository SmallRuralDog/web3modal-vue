<template>
  <div class="prediction-com">
    <div class="prediction-card prediction-later">
      <div class="prediction-panel"
      >
        <div class="card-header">
          <div class="header-left">
            <v-icon class="mr-1" size="20">mdi-clock-time-three-outline</v-icon>
            <span>Later</span>
          </div>
          <div class="header-right">#12345</div>
        </div>


        <div class="card-content">
          <div
              class="up-area"
          >
            <svg height="65px" width="240px" viewBox="0 0 240 65" color="text" xmlns="http://www.w3.org/2000/svg"
                 class="sc-bdnxRM kDWlca">
              <g filter="url(#filter0_i)">
                <path
                    d="M10.0001 49.2757L10.0003 64H234L234 49.2753C234 42.5136 229.749 36.4819 223.381 34.2077L138.48 3.8859C127.823 0.0796983 116.177 0.0796931 105.519 3.8859L20.6188 34.2076C14.2508 36.4819 10.0001 42.5138 10.0001 49.2757Z"
                    fill="currentColor"></path>
              </g>
              <defs>
                <filter id="filter0_i" x="10.0001" y="1.03125" width="224" height="62.9688" filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                 result="hardAlpha"></feColorMatrix>
                  <feOffset></feOffset>
                  <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
                </filter>
              </defs>
            </svg>
            <div class="area-title fc-green">UP</div>
          </div>

          <div class="card-info">

            <div class="later-title">Entry starts</div>
            <div class="later-time">~13:22</div>

          </div>

          <div
              class="down-area"
          >
            <svg height="65px" width="240px" viewBox="0 0 240 65" color="text" xmlns="http://www.w3.org/2000/svg"
                 class="sc-bdnxRM kDWlca">
              <g filter="url(#filter0_i)">
                <path
                    d="M10.0001 15.7243L10.0003 1H234L234 15.7247C234 22.4864 229.749 28.5181 223.381 30.7923L138.48 61.1141C127.823 64.9203 116.177 64.9203 105.519 61.1141L20.6188 30.7924C14.2508 28.5181 10.0001 22.4862 10.0001 15.7243Z"
                    fill="currentColor"></path>
              </g>
              <defs>
                <filter id="filter0_i" x="10.0001" y="1" width="224" height="62.9688" filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                 result="hardAlpha"></feColorMatrix>
                  <feOffset></feOffset>
                  <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
                </filter>
              </defs>
            </svg>
            <div class="area-title fc-red">DOWN</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['round']
}
</script>
