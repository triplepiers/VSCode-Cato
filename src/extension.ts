import * as vscode from 'vscode';
import { highlightCats, showCaptureInfo } from './GUI';
import { ensureApiToken } from './getConfig';

// 这个函数将在 activate 后被持续触发
export function activate(context: vscode.ExtensionContext) {
    // 1. 定义更新逻辑
    const updateDecoration = () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) highlightCats(editor);
    };

    // 2. 防抖逻辑（提取变量以便清理）
    let debouncer: NodeJS.Timeout | undefined = undefined;

    // 3. 将所有“资源”集中推入 subscriptions
    context.subscriptions.push(
        // 注册命令：捕获
        vscode.commands.registerCommand('cato.capture', (catIndex: number) => {
            showCaptureInfo(catIndex);
        }),

        // 注册命令：更新 Token
        vscode.commands.registerCommand('cato.updateToken', async () => {
            await context.secrets.delete('cato.apiToken');
            await ensureApiToken(context);
        }),

        // 监听文档修改
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                if (debouncer) clearTimeout(debouncer);
                debouncer = setTimeout(() => updateDecoration(), 50);
            }
        }),

        // 监听切换编辑器
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) updateDecoration();
        }),
        // 插件卸载时强制取消定时器
        {
            dispose: () => {
                if (debouncer) clearTimeout(debouncer);
            }
        }
    );

    // 4. 立即执行初始化
    // 立即执行初始高亮
    if (vscode.window.activeTextEditor) {
        updateDecoration();
    }
    // 异步检测 Token
    ensureApiToken(context).then(token => {
        if (token) {
            console.log('Cato: 已成功配置 API Token');
        } else {
            console.warn('Cato: Token 未设置，部分功能受限');
        }
    });
}

export function deactivate() { }

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