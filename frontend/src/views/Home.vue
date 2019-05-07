<template>
  <div class="home">
    <RepeaterTable :repeaters="repeaters"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RepeaterTable from "@/components/RepeaterTable.vue";
import Repeater from "@/api/Repeater";

@Component({
  components: {
    RepeaterTable
  }
})
export default class Home extends Vue {
  public get repeaters(): Repeater[] {
    return this.$store.state.repeaters;
  }
}
</script>
