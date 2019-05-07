<template>
  <div class="home">
    <RepeaterTable/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RepeaterTable from "@/components/RepeaterTable.vue";

@Component({
  components: {
    RepeaterTable
  }
})
export default class Home extends Vue {}
</script>
