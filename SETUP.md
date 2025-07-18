# Ongeki-IO Web Controller 设置指南

本指南将帮助您设置和使用Ongeki-IO Web Controller。

## 环境要求

### 软件要求
- **Node.js**: 版本14.0.0或更高
- **现代浏览器**: Chrome 89+, Firefox 88+, Edge 89+, Safari 14.1+
- **ongeki-io**: 已配置并运行的MU3Input.dll

### 硬件要求
- 支持触控的设备（可选，用于移动端摇杆控制）

## 安装步骤

### 1. 下载项目
```bash
git clone <repository-url>
cd ongeki-io-web-controller
```

### 2. 安装Node.js依赖
```bash
npm install
```

### 3. 配置ongeki-io
确保ongeki-io的MU3Input.dll正在运行并监听UDP端口10000。

## 启动服务

### 1. 启动WebSocket代理服务器
```bash
npm start
```

或者使用开发模式（支持热重载）：
```bash
npm run dev
```

您应该看到类似以下的输出：
```
WebSocket代理服务器启动在端口 10001
转发UDP数据到 127.0.0.1:10000
```

### 2. 打开Web界面
- 在浏览器中打开 `index.html` 文件
- 或者使用HTTP服务器：
  ```bash
  python3 -m http.server 8080
  ```
  然后访问 http://localhost:8080

## 使用指南

### 连接到ongeki-io

1. 在Web界面的"连接设置"区域：
   - **服务器IP**: 输入运行ongeki-io的机器IP地址（本机使用127.0.0.1）
   - **端口**: 输入10000（ongeki-io的UDP端口）

2. 点击"连接"按钮

3. 连接成功后：
   - 状态指示器变为绿色
   - 显示"已连接"状态
   - 按钮文字变为"断开连接"

### 控制操作

#### 摇杆控制
- **鼠标拖拽**: 点击并拖拽摇杆球
- **触控**: 在触控设备上用手指拖拽
- **范围**: 摇杆值从-32767到+32767
- **行为**: 摇杆不会自动回中，会保持在最后的位置

#### 按键控制
- **鼠标点击**: 直接点击界面上的按键
- **键盘快捷键**:
  - `1-9`: 控制按键0-8
  - `0`: 控制按键9
  - `F1`: Test按键
  - `F2`: Service按键

#### 视觉反馈
- 按下的按键会显示为绿色
- 摇杆位置会实时显示数值
- 连接状态通过颜色指示器显示

## 故障排除

### 连接问题

**问题**: 无法连接到服务器
**解决方案**:
1. 检查WebSocket代理服务器是否正在运行
2. 确认IP地址和端口是否正确
3. 检查防火墙设置
4. 确保ongeki-io正在监听UDP端口10000

**问题**: 连接后没有响应
**解决方案**:
1. 检查ongeki-io是否正常工作
2. 查看代理服务器的控制台输出
3. 确认UDP通信是否正常

### 控制问题

**问题**: 摇杆移动但游戏中无响应
**解决方案**:
1. 检查ongeki-io的摇杆配置
2. 确认lever值是否正确发送（查看界面显示）
3. 检查UDP数据包是否到达ongeki-io

**问题**: 按键无响应
**解决方案**:
1. 确认按键配置是否正确
2. 检查键盘焦点是否在页面上
3. 查看代理服务器日志确认数据传输

### 浏览器兼容性

**问题**: 在某些浏览器中功能异常
**解决方案**:
1. 使用推荐的现代浏览器
2. 确保WebSocket支持已启用
3. 检查浏览器控制台的错误信息

## 高级配置

### 修改端口配置
如果需要使用不同的端口，请修改：

1. **websocket-proxy.js**:
   ```javascript
   const WS_PORT = 10001;  // WebSocket端口
   const UDP_PORT = 10000; // UDP端口
   ```

2. **script.js**:
   ```javascript
   const wsUrl = `ws://${ip}:${port + 1}`; // 确保与WS_PORT匹配
   ```

### 远程访问
要从其他设备访问Web界面：

1. 确保防火墙允许相应端口
2. 修改IP地址为服务器的实际IP
3. 考虑使用HTTPS（需要额外配置）

## 开发说明

### 项目结构
```
├── index.html              # 主Web页面
├── style.css               # 样式文件
├── script.js               # 前端JavaScript
├── websocket-proxy.js      # WebSocket代理服务器
├── package.json            # Node.js项目配置
├── README.md               # 项目说明
└── SETUP.md               # 设置指南
```

### 数据流
```
Web页面 ↔ WebSocket ↔ 代理服务器 ↔ UDP ↔ ongeki-io
```

### 调试
- 前端调试：使用浏览器开发者工具
- 后端调试：查看代理服务器控制台输出
- 网络调试：使用Wireshark监控UDP流量

## 许可证

本项目基于MIT许可证开源。详见LICENSE文件。
