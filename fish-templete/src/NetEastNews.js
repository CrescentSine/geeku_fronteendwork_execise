import { fish } from "./fish"
import classes from "./NetEastNews.module.less"

export default class NetEastNews {
    constructor(ele) {
        this.$el = ele;
    }

    async mounted() {
        const v = new fish().mounted(this.$el);
        v.render(`
        <div clsss="list">
            <div class="${classes["news-item"]}" for="item in newsList">
                {{item.title}}
            </div>
        </div>`, {
            newsList: [
                { title: "a" },
                { title: "b" },
            ]
        });
    }
}