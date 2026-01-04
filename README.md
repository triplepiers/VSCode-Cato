# VSCode-Cato

寻找代码编辑器里的猫

## 基于 Yeoman CLI 初始化 [VSCode 插件](https://code.visualstudio.com/api) 项目


1. 安装依赖：请先确保本地已存在 NodeJS 与 NPM

    ```bash
    # (全局) 安装 Yeoman 与 VSCode 插件生成器
    npm install -g yo generator-code
    ```

2. 初始化 VSCode 插件项目

    1. 启动交互式向导
   
        ```bash
        yo code
        ```

    2. 选择插件类型（建议使用 TS），并输入插件名称、描述等信息

        该步骤会生成一个与插件同名的路径

3. 进入项目并安装依赖

    > 好像不用，现在项目 meta 输完之后自动安装了

    ```bash
    cd [plugin-name]
    npm install
    ```

4. 在 VSCode 中进行调试

    1. 用 VSCode 打开插件路径
    2. 点击 `F5` 以启动 Extension Development Host 窗口，插件会在此窗口中加载