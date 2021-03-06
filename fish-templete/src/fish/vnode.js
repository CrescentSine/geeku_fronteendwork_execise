import { v4 as uuid } from "uuid"
export default class Vnode {
    constructor(tag, attr, children, parent, childrenTemplate) {
        this.tag = tag;
        this.attr = attr;
        this.children = children;
        this.parent = parent;
        if (childrenTemplate === 127) {
            debugger;
        }
        this.childrenTemplate = childrenTemplate;
        this.uuid = uuid();
    }
}
