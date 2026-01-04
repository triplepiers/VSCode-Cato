import { window ,TextEditor, Range, MarkdownString } from 'vscode';
const { 
    showInformationMessage, //showErrorMessage, 
    createTextEditorDecorationType 
} = window;

// /**
//  * 用于右下角弹窗显示 Capture 结果
//  * @param count - 捕获的猫咪数量
//  */
// function showCaptureMsg(count: number): void {
//     // 
//     count
//         ? showInformationMessage(`🐱 Wow, ${count} Cats Captured!`)
//         : showErrorMessage('😿 No cats here ... ');
// }


// 定义色系
const highlightColors = [
    '#ff9e64',
    '#e0af68',
    '#9ece6a',
    '#73daca',
    '#7aa2f7',
    '#bb9af7',
    '#f7768e' 
];

// 为每种颜色创建一个 DecorationType
const rainbowDecorationTypes = highlightColors.map(color => 
    createTextEditorDecorationType({
        cursor: 'pointer',
        color: color,
        fontWeight: 'bold',
        backgroundColor: `${color}1A`, 
        borderRadius: '2px',
        textDecoration: `none; box-shadow: 0 0 8px ${color}66;`,
        border: `none`,
        after: {
            contentText: '',
            textDecoration: `none; border-bottom: 2px solid ${color};`
        }
    })
);

// 基于模版生成 Hover 文本
const CAT_TEMPLATE = `
#### 🐾 Cat Found &nbsp;&nbsp; [$(symbol-event) CAPTURE IT]($COMMAND "Click to capture")
---
This is cat **$COUNT** in this file.
`;
function genHoverText(count: number): MarkdownString {
    const catIndex = count + 1;

    // 构造用于 Markdown 的 URI 命令
    const args = encodeURIComponent(JSON.stringify([catIndex]));
    const commandUri = `command:cato.capture?${args}`;

    // 替换模版中的变量
    const text = CAT_TEMPLATE
        .replace('$COUNT', catIndex.toString())
        .replace('$COMMAND', commandUri);
    const hoverText = new MarkdownString(text);
    
    hoverText.supportThemeIcons = true;   // 支持 ThemeIcon
    hoverText.isTrusted = true;          // 允许在 Markdown 中执行点击命令
    return hoverText;
}
// 点击 Capture 后显示的内容
export function showCaptureInfo(catIndex: number): void {
    showInformationMessage(`Successfully captured Cat #${catIndex}! 🕸️`);
}

interface DecorationOptions {
    range: Range,
    hoverMessage: MarkdownString | string
};

/**
 * 解析文本，高亮所有的 cat、并返回文本中出现 cat 的次数
 * @param editor - 待解析窗口
 * @returns 返回一个数值 - 捕获的猫咪数量
 */
export function highlightCats(editor: TextEditor): number {
    const catRegex = /cat/gi; // 全局搜索 cat
    let match;
    
    // 与 rainbowDecorationTypes 对应，存储每种颜色需要 hightlight 的 Range List
    let count = 0;
    const decorationBuckets: DecorationOptions[][] = rainbowDecorationTypes.map(() => []);
        
    const text = editor.document.getText();
    while ((match = catRegex.exec(text)) !== null) {
        const start = editor.document.positionAt(match.index);
        const end   = editor.document.positionAt(match.index + match[0].length);

        const decorationOps: DecorationOptions = {
            range: new Range(start, end),
            hoverMessage: genHoverText(count)
        }

        // 取模、选择颜色
        const colorIndex = count % rainbowDecorationTypes.length;
        decorationBuckets[colorIndex].push(decorationOps);
        count ++;
    }

    // 分组应用高亮
    rainbowDecorationTypes.forEach((type, index) => {
        editor.setDecorations(type, decorationBuckets[index]);
    });

    return count;
}