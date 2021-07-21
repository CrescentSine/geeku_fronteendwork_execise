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
            <div class="${classes["news-item"]}" v-for="item in newsList">
                {{item.title}}
            </div>
            <div class="img" v-if="info.showImage"><img src="{{image}}"/></div>
            <div class="date" v-if="info.showDate">{{info.name}}</div>
            <div class="img">{{info.name}}</div>
        </div>`, {
            newsList: [
                { title: "a" },
                { title: "b" },
            ],
            image: "some img",
            info: {
                showImage: true,
                showDate: false,
                name: "aaa"
            }
        });
    }
}