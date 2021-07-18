import { fish } from "./fish"

export default class NetEastNews {
    constructor() {
        this.$el = document.createElement("div");
    }

    async mounted() {
        const v = new fish().mounted(this.$el);
        v.render(`
        <div clsss="list">
            {{hello}}
        </div>`, {
            hello: "hello,world",
        });
    }
}