import Vnode from "./vnode";
export default class Engine {
    constructor() {
        this.nodes = new Map();
    }

    createNodeOnMatch(tag, attrStr, contentStr) {
        let attrs = this.parseAttribute(attrStr);
        let node = new Vnode(tag, attrs, [], null, contentStr);
        this.nodes.set(node.uuid, node);
        return `(${node.uuid})`;
    }

    render(template, data) {
        const rePaired = /<(\w+)\s*([^>]*)>([^<]*)<\/\1>/gm; //匹配配对的标签
        const reClosed = /<(\w+)\s*([^(/>)]*)\/>/gm; //匹配自闭合标签
        template = template.replace(/\n/gm, "");
        let createOnMatch = (_, tag, attr, content = "") =>
            this.createNodeOnMatch(tag, attr, content);

        while (rePaired.test(template) || reClosed.test(template)) {
            //配对标签生成节点
            template = template.replace(rePaired, createOnMatch);
            //自闭合标签生成节点
            template = template.replace(reClosed, createOnMatch);
        }
        console.log("第一阶段|解析创建node>>>", this.nodes);
        let rootNode = this.parseToNode(template);
        console.log("第二阶段|构建nodeTree>>>", rootNode);
        let dom = this.parseNodeToDom(rootNode, data);
        console.log("第三阶段|nodeTree To DomTree>>>", dom);
        return dom;
    }

    parseAttribute(attrStr) {
        let attrMap = new Map();
        attrStr = attrStr.trim();
        attrStr.replace(/(\w+)\s*=['"](.*?)['"]/gm, (matched, key, value) => {
            attrMap.set(key, value);
            return matched;
        });
        return attrMap;
    }

    parseToNode(template) {
        let reNodeId = /\((.*?)\)/g;
        let stack = [];
        let vroot = new Vnode("root", null, [], null, template);
        stack.push(vroot);
        //转成成node节点
        while (stack.length > 0) {
            let parent = stack.pop();
            let contentStr = parent.childrenTemplate.trim();
            reNodeId.lastIndex = 0;
            [...contentStr.matchAll(reNodeId)].forEach((item) => {
                let node = this.nodes.get(item[1]);
                node.parent = parent
                parent.children.push(node);
                stack.push(node);
            });
        }
        return vroot.children[0];
    }

    appendForListNodesToDom(node, pdom, forExpr, globalScope, curentScope) {
        let stack = [];
        let [key, prop] = forExpr.split("in");
        key = key.trim();
        prop = prop.trim();
        for (let i = 0; i < curentScope[prop].length; i++) {
            let itemScope = { [key]: curentScope[prop][i] };
            let newAppend = this.appendNodeToDom(node, pdom, globalScope, itemScope);
            stack = stack.concat(newAppend);
        }
        return stack;
    }

    appendNodeToDom(node, pdom, globalScope, curentScope) {
        let html = this.scopehtmlParse(node, globalScope, curentScope);
        let ele = this.createElement(node, html);
        this.scopeAtrrParse(ele, node, globalScope, curentScope);
        pdom.appendChild(ele);
        return node.children.map(item => [item, ele, curentScope]);
    }

    parseNodeToDom(root, data) {
        let fragment = document.createDocumentFragment();
        let stack = [[root, fragment, data]];
        //转成成node节点
        while (stack.length > 0) {
            let [node, pdom, scope] = stack.pop();
            if (node.attr.has("for")) {
                let forExpr = node.attr.get("for")
                let newAppend = this.appendForListNodesToDom(node, pdom, forExpr, data, scope);
                stack = stack.concat(newAppend);
            }
            else {
                let newAppend = this.appendNodeToDom(node, pdom, data, scope);
                stack = stack.concat(newAppend);
            }
        }
        return fragment;
    }

    getValueInScope(globalScope, curentScope, propPath) {
        let props = propPath.split(".");
        let val = curentScope[props[0]] || globalScope[props[0]];
        props.slice(1).forEach((field) => {
            val = val[field];
        });
        return val;
    }

    scopehtmlParse(node, globalScope, curentScope) {
        return node.childrenTemplate.replace(/\{\{(.*?)\}\}/g, (_, propPath) =>
            this.getValueInScope(globalScope, curentScope, propPath));
    }

    createElement(node, html) {
        let ignoreAttr = ["for", "click"];
        let dom = document.createElement(node.tag);
        for (let [key, val] of node.attr) {
            if (!ignoreAttr.includes(key)) {
                dom.setAttribute(key, val);
            }
        }
        if (node.children.length === 0) {
            dom.innerHTML = html;
        }
        return dom;
    }

    scopeAtrrParse(ele, node, globalScope, curentScope) {
        console.log(node.attr);
        for (let [key, value] of node.attr) {
            let result = /\{\{(.*?)\}\}/.exec(value);
            if (result && result.length > 0) {
                let val = this.getValueInScope(globalScope, curentScope, result[1]);
                ele.setAttribute(key, val);
            }
        }
    }
}