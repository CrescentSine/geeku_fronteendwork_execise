
import { editor } from "monaco-editor"

const editorElement = document.getElementById("editor-container");
const webEditor = editor.create(editorElement, {
    language: "javascript",

});

async function OpenFile() {
    try {
        const [selected] = await showOpenFilePicker({
            multiple: false,
            types: [
                {
                    description: 'JavaScript脚本文件',
                    accept: {
                        'application/javascript': '.js',
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
                    description: 'JavaScript脚本文件',
                    accept: {
                        'application/javascript': '.js',
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
            let codeTests = webEditor.getValue();
            await writeSteam.write(codeTests);
            await writeSteam.close();
        }
    }
    catch (e) {
        console.error(e);
        alert("保存文件失败：" + e);
    }
}

const allInputs = document.getElementsByTagName("input");

const btnOpenFile = allInputs.namedItem("selectFile");
btnOpenFile.addEventListener("click", OpenFile);

const btnSaveFile = allInputs.namedItem("saveFile");
btnSaveFile.addEventListener("click", SaveFile);