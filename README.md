# Timewise 前端

基于 Vue 3 + Vite 的时序数据分析系统前端应用。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **路由**: Vue Router 4
- **UI组件**: Vuetify 3
- **图表**: ECharts
- **状态管理**: Vue reactive
- **构建工具**: Vite
- **HTTP客户端**: Axios

## 功能模块

1. **用户认证** - 登录、注册
2. **首页** - 项目概览、数据统计
3. **历史项目** - 查看历史项目列表
4. **数据接入** - 上传CSV/Excel文件，选择目标列和时间列
5. **EDA** - 探索性数据分析，可视化缺失值、异常值、数据分布
6. **预处理**
   - 重采样（按时间频率聚合）
   - 缺失值填充（线性、均值、前向、后向、插值、KNN）
   - 异常值处理（删除、平滑、截断、标记）
   - 噪声过滤（移动平均、EWMA、卡尔曼、Savitzky-Golay、小波）
7. **特征工程**
   - **时域特征**: 趋势（线性、多项式、移动平均）、季节性、自相关（ACF/PACF）、滞后、滚动统计、差分
   - **频域特征**: FFT、小波变换、功率谱密度（PSD）、频谱图
   - 可视化预览，支持全屏查看
8. **预测** - 时间序列预测模型
9. **导出** - 导出处理后的数据

## 环境要求

- Node.js 16+
- npm 8+

## 本地运行

### 1. 克隆项目

```bash
git clone https://github.com/X-1437/timeswise.git
cd timeswise
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量（可选）

创建 `.env.development.local` 文件：

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 4. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动。

### 5. 构建生产版本

```bash
npm run build
```

## 项目结构

```
timeswise/
├── src/
│   ├── api/           # API请求封装
│   ├── layouts/       # 布局组件（侧边栏、顶部导航）
│   ├── router/        # 路由配置
│   ├── views/         # 页面组件
│   │   ├── Home.vue           # 首页
│   │   ├── Login.vue          # 登录
│   │   ├── Register.vue       # 注册
│   │   ├── Dashboard.vue      # 仪表盘
│   │   ├── History.vue        # 历史项目
│   │   ├── DataImport.vue     # 数据接入
│   │   ├── EDA.vue            # 探索性数据分析
│   │   ├── Preprocessing.vue  # 数据预处理
│   │   ├── FeatureEngineering.vue  # 特征工程（主页面）
│   │   ├── TimeFeatures.vue   # 时域特征
│   │   ├── FreqFeatures.vue   # 频域特征
│   │   ├── Forecasting.vue    # 预测
│   │   ├── Export.vue         # 导出
│   │   └── Profile.vue        # 用户资料
│   ├── App.vue         # 根组件
│   └── main.js         # 应用入口
├── index.html          # HTML入口
├── vite.config.js      # Vite配置
└── package.json        # 依赖管理
```

## 与后端连接

前端通过Axios与后端API通信。默认配置：

- 基础URL: `http://localhost:8000/api/v1`
- 认证: JWT Bearer Token

## 特性

- 响应式设计，支持桌面和移动设备
- 暗色/亮色主题切换
- 实时数据预览
- 可视化图表（ECharts）
- 文件拖拽上传

## 许可证

MIT License