import * as vscode from 'vscode';

/**
 * 确保 API Token 可用
 */
export async function ensureApiToken(context: vscode.ExtensionContext): Promise<string | undefined> {
    const SECRET_KEY = 'cato.apiToken';
    const HAS_INITIALIZED = 'cato.hasInitialized';

    // 尝试从安全存储中获取 Token
    let token = await context.secrets.get(SECRET_KEY);

    if (!token) {
        // 是否首次
        const isFirstTime = !context.globalState.get(HAS_INITIALIZED);
        const msg = isFirstTime 
            ? "欢迎使用 Cato！为使用高级功能，请配置您的 API Token。" 
            : "未检测到有效的 API Token，请重新输入。";

        const input = await vscode.window.showInputBox({
            prompt: msg,
            placeHolder: "在此粘贴您的 API Key",
            password: true,      // 输入时隐藏字符
            ignoreFocusOut: true // 点击输入框外部不会消失
        });

        if (input) {
            await context.secrets.store(SECRET_KEY, input);
            await context.globalState.update(HAS_INITIALIZED, true);
            vscode.window.showInformationMessage("Cato: API Token 已保存");
            token = input;
        } else { // 用户取消输入
            vscode.window.showWarningMessage("Cato: 未提供 API Token，部分高级功能将无法使用。");
            return undefined;
        }
    }

    return token;
}