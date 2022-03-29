<template >
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
  setup() {
    return {};
  },
});
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.inline-block {
  display: inline-block;
  vertical-align: top;
}
.inputNoB {
  border: 0;
  outline: none;
  background-color: rgba(0, 0, 0, 0);
}
.textNoclick {
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

.mouseHand {
  cursor: pointer;
}

.router-link-active {
  text-decoration: none;
}

.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
</style>