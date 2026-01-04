import * as vscode from 'vscode';
import { highlightCats, showCaptureInfo } from './GUI';

// 这个函数将在 activate 后被持续触发
export function activate(context: vscode.ExtensionContext) {
    // 注册命令 cato.captre => 在右下角显示弹窗
    vscode.commands.registerCommand('cato.capture', (catIndex: number) => {
        showCaptureInfo(catIndex);
    });

    // 防抖操作的更新函数
    function updateDecoration(): void {
        const editor = vscode.window.activeTextEditor;
        if (editor) highlightCats(editor); 
    }

    // 防抖定时器
    let debouncer: NodeJS.Timeout | undefined = undefined;

    // 监听文档修改事件
    vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document) {
            if (debouncer) { clearTimeout(debouncer); }
            debouncer = setTimeout(() => {
                updateDecoration();
                debouncer = undefined;
            }, 50);  // 50ms
        }
    }, null, context.subscriptions);

    // 初始加载和切换编辑器的逻辑保持不变
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) updateDecoration();
    }, null, context.subscriptions);

    // 立即高亮打开的文件
    if (vscode.window.activeTextEditor) updateDecoration();
}

export function deactivate() {}

// const path = require('path');
// const fs = require('fs');
// Cato Main Page
// const disposable = vscode.commands.registerCommand('cato.helloWorld', () => {
// 		// 创建或显示 Webview 面板
//         const panel = vscode.window.createWebviewPanel(
//             'catWelcomePage', // 内部标识符
//             'Your Cat Welcome!', // 面板标题
//             vscode.ViewColumn.One, // 在第一个编辑器列打开
//             {
//                 enableScripts: true, // 允许 Webview 中的 JavaScript
//                 localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'webview'))]
//             }
//         );

//         // 加载 webview/index.html 的内容
//         const htmlPath = path.join(context.extensionPath, 'webview', 'index.html');
//         let htmlContent = fs.readFileSync(htmlPath, 'utf8');

//         // 将 ASCII 猫咪内容注入到 HTML 中 (这里只是示例，实际猫咪内容会更复杂)
//         const asciiCat = `
// <pre style="font-family: monospace; white-space: pre;">
//    |\\__/,|   (\\  
//  _.|o o  |_   ) ) 
// -(((---(((--------
// </pre>
// `;
//         // 你可能需要更复杂的占位符替换，这里只是一个简单示例
//         htmlContent = htmlContent.replace('', asciiCat);


//         panel.webview.html = htmlContent;
// 	});