import { window ,TextEditor, Range } from 'vscode';
const { 
    // showInformationMessage, showErrorMessage, 
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
        backgroundColor: `${color}15`, 
        borderRadius: '4px',
        before: {
            contentText: '',
            textDecoration: `none; 
                box-shadow: 0 0 10px ${color}, 0 0 2px ${color};
                border: 1px solid ${color}50;`
        }
    })
);

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
    const decorationBuckets: Range[][] = rainbowDecorationTypes.map(() => []);
        
    const text = editor.document.getText();
    while ((match = catRegex.exec(text)) !== null) {
        const start = editor.document.positionAt(match.index);
        const end   = editor.document.positionAt(match.index + match[0].length);
        const range = new Range(start, end);

        // 取模、选择颜色
        const colorIndex = count % rainbowDecorationTypes.length;
        decorationBuckets[colorIndex].push(range);
        count ++;
    }

    // 分组应用高亮
    rainbowDecorationTypes.forEach((type, index) => {
        editor.setDecorations(type, decorationBuckets[index]);
    });

    return count;
}