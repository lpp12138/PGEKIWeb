# MAGEKI Web Configurator - 项目信息

## 项目概述

MAGEKI Web Configurator 是一个基于 WebHID API 的设备配置工具，专为 MAGEKI 音乐游戏控制器设计。

## 文件结构

```
magekiweb/
├── index.html          # 主页面文件
├── style.css          # 样式表
├── script.js          # 主要JavaScript逻辑
├── README.md          # 项目说明文档
├── .gitignore         # Git忽略文件
├── .gitattributes     # Git属性配置
└── PROJECT_INFO.md    # 项目信息（本文件）
```

## 主要功能模块

### 1. 设备连接 (WebHID)
- 使用 WebHID API 连接 MAGEKI 设备
- 支持设备授权和连接状态管理
- 实时数据传输

### 2. 按键配置
- 8个主要按键的RGB颜色配置
- HID键码设置
- 2个小圆形按键配置
- 1个装饰性按键

### 3. 摇杆控制
- 单轴水平摇杆
- 实时位置显示
- lever值范围：-32767 到 +32767
- 不自动回中设计

### 4. 配置文件管理
- 6个独立配置文件
- 特殊IO模式（配置文件0）
- 本地存储支持
- 导入/导出功能

### 5. 用户界面
- 响应式设计
- 明暗主题切换
- 可伸缩侧边栏
- 实时状态反馈

## 数据格式

### HID数据包结构
```c
typedef struct output_data_t {
    uint8_t buttons[10];    // 字节0-9：按键数据
    int16_t lever;          // 字节10-11：摇杆值（以0为中点）
    uint8_t optButtons;     // 字节12：可选按键
    uint8_t scan;           // 字节13：扫描
    aimi_id_t aimi_id;      // 字节14+：aimi ID
} output_data_t;
```

## 技术特性

- **纯Web技术**：HTML5 + CSS3 + JavaScript
- **无需服务器**：可直接打开HTML文件使用
- **现代浏览器支持**：需要支持WebHID的浏览器
- **实时通信**：通过WebHID与设备直接通信
- **本地存储**：配置保存在浏览器LocalStorage

## 浏览器兼容性

- Chrome 89+
- Edge 89+
- 其他基于Chromium的浏览器

注：需要启用WebHID功能的浏览器。

## 开发说明

本项目基于PGEKI Web Configurator发展而来，专门为MAGEKI设备优化，主要改进包括：

1. 添加了单轴摇杆支持
2. 优化了UI设计和交互体验
3. 改进了数据包处理逻辑
4. 增强了设备兼容性

## 未来计划

- [ ] 添加更多设备类型支持
- [ ] 增强摇杆校准功能
- [ ] 添加宏功能支持
- [ ] 优化移动端体验