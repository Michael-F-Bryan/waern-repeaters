import { VueConstructor } from "vue";
import { API } from './Api';

declare module 'vue/types/vue' {
    interface Vue {
        $api: API;
    }
}

export default {
    install(v: VueConstructor) {
        v.mixin({
            beforeCreate(this: any) {
                const options = this.$options as any;

                if (options.api) {
                    this.$api = options.api;
                }
                else if (options.parent && options.parent.$api) {
                    this.$api = options.parent.$api;
                }
            }
        })
    }
};
