export default class Engine {
    render(template, data) {
        let html = template.replace(/\{\{(.*?)\}\}/gm, (s0, s1) => {
            return s1
        })
        console.log(html);
    }
}