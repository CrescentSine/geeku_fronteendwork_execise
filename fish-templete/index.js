import NetEastNews from "./src/NetEastNews";

const comp = new NetEastNews();
comp.mounted().then(() => {
    const root = document.getElementById("app");
    root.appendChild(comp.$el);
})