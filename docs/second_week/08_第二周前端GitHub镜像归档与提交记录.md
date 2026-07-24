# 第二周（前端）GitHub 镜像归档与提交记录（timeswise / v2）

依据：[GitHub仓库管理方案.md](file:///d:/trae_workspace/data/file/all/GitHub%E4%BB%93%E5%BA%93%E7%AE%A1%E7%90%86%E6%96%B9%E6%A1%88.md)

## 1. 目标与范围

- 提交仓库：`timeswise`（前端仓库）
- 基线分支：`v2`（React 版本主干）
- 本次提交目标：将第二周 React 前端作为 `v2` 的“可运行基线版本”归档
- 重要说明：本次提交是阶段性基线；后续“产品形态升级（标准流程工作台 + 对话扩展）”通过 `feature/*` 分支改造并合并回 `v2`

## 2. 镜像归档清单（来源 → 目标）

- 来源（学习目录）：`D:\trae_workspace\data\file\second_week\frontend\`
- 目标（GitHub仓库工作区）：`D:\trae_workspace\github\timeswise\`（切换到 `v2` 分支后）

排除项：

- `node_modules/`、`dist/`
- `.env` / `.env.*`

## 3. 敏感信息检查

- ✅ 已确认前端仓库中不包含 `.env` 与真实 key/token

## 4. 终端实操记录（摘要）

### 4.1 克隆仓库

```bash
cd D:\trae_workspace\github
git clone --depth 1 https://github.com/X-1437/timeswise.git
```

### 4.2 创建 v2 分支（React 主干）

```bash
cd D:\trae_workspace\github\timeswise
git checkout -b v2
git rm -r .
```

### 4.3 镜像复制（第二周 React 前端 → v2 工作区）

```powershell
robocopy D:\trae_workspace\data\file\second_week\frontend D:\trae_workspace\github\timeswise /E /XD node_modules dist .git /XF *.log
```

### 4.4 增补忽略规则并提交

```bash
git add -A
git commit -m "[feat] init react v2 baseline (second_week)"
```

## 5. 提交记录（已完成）

- 分支：`v2`
- commit：`303e7d9`
- message：`[feat] init react v2 baseline (second_week)`
- 内容：将 `main`（Vue3）替换为第二周 React/Vite/TS 前端基线，新增 `.gitignore`（忽略 node_modules/dist/.env）

## 6. 分支策略落地（已完成）

```bash
git checkout -b feature/workbench-layout
```

- `feature/workbench-layout` 用于后续“标准流程工作台 + 引用入对话”形态改造，完成后通过 PR 合并回 `v2`

## 7. 推送记录

### 7.1 推送 `v2`

```bash
git push -u origin v2
```

终端实测输出：

```
branch 'v2' set up to track 'origin/v2'.
Everything up-to-date
```

### 7.2 推送 `feature/workbench-layout`

```bash
git push -u origin feature/workbench-layout
```

终端实测输出：

```
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
remote:
remote: Create a pull request for 'feature/workbench-layout' on GitHub by visiting:
remote:      https://github.com/X-1437/timeswise/pull/new/feature/workbench-layout
remote:
To https://github.com/X-1437/timeswise.git
 * [new branch]      feature/workbench-layout -> feature/workbench-layout
branch 'feature/workbench-layout' set up to track 'origin/feature/workbench-layout'.
```
