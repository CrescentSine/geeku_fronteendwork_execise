import NetEastNews from "./src/NetEastNews";

const root = document.getElementById("app");
const comp = new NetEastNews(root);
comp.mounted()