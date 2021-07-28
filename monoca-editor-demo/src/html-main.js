
import { editor } from "monaco-editor"
import { createApp } from 'vue'

const editorElement = document.getElementById("editor-container");
const webEditor = editor.create(editorElement, {
    language: "html",

});

async function OpenFile() {
    try {
        const [selected] = await showOpenFilePicker({
            multiple: false,
            types: [
                {
                    description: 'Vue单文件组件',
                    accept: {
                        'text/vue-sfc': '.vue',
                    },
                },
            ],
            excludeAcceptAllOption: true,
        });

        if (selected) {
            let status = await selected.queryPermission({ mode: "read" });
            if (status == "prompt") {
                status = await selected.requestPermission({ mode: "read" });
            }
            if (status != "granted") {
                alert("已取消打开脚本文件。");
                return;
            }

            const codeFile = await selected.getFile();
            const codeTexts = await codeFile.text();
            
            webEditor.setValue(codeTexts);
        }
    }
    catch (e) {
        console.error(e);
        alert("打开文件失败：" + e);
    }
}

async function SaveFile() {
    try {
        const selected = await showSaveFilePicker({
            multiple: false,
            types: [
                {
                    description: 'Vue单文件组件',
                    accept: {
                        'text/vue-sfc': '.vue',
                    },
                },
            ],
        });

        if (selected) {
            let status = await selected.queryPermission({ mode: "readwrite" });
            if (status == "prompt") {
                status = await selected.requestPermission({ mode: "readwrite" });
            }
            if (status != "granted") {
                alert("已取消保存脚本文件。");
                return;
            }

            const writeSteam = await selected.createWritable();
            let codeTexts = webEditor.getValue();
            await writeSteam.write(codeTexts);
            await writeSteam.close();
        }
    }
    catch (e) {
        console.error(e);
        alert("保存文件失败：" + e);
    }
}

async function previewSFC(filename) {
    let component = await import(`./${filename}.vue`);
    createApp(component.default).currentComponent.mount("#preview-root");
}

async function previewFile() {
    let codeTexts = webEditor.getValue();
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let resp = xhr.response;
                previewSFC(resp);
            }
            else {
                alert("预览失败");
            }
        }
    };
    xhr.open("POST", "/api/preview", true);
    xhr.setRequestHeader("Content-Type", "text/vue-sfc");
    xhr.send(codeTexts);
}

const allInputs = document.getElementsByTagName("input");

const btnOpenFile = allInputs.namedItem("selectFile");
btnOpenFile.addEventListener("click", OpenFile);

const btnSaveFile = allInputs.namedItem("saveFile");
btnSaveFile.addEventListener("click", SaveFile);

const btnPreviewFile = allInputs.namedItem("previewFile");
btnPreviewFile.addEventListener("click", previewFile);