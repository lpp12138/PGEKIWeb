# Ongeki-IO Web Controller

一个基于Web的Ongeki-IO控制器，通过UDP协议与ongeki-io进行通信，提供触控和键盘控制支持。

## 功能特性

- **摇杆控制**: 单轴摇杆，支持鼠标拖拽和触控操作
- **按键控制**: 10个主要按键，支持鼠标点击和键盘快捷键
- **特殊按键**: Test和Service按键
- **实时通信**: 基于WebSocket代理的UDP通信
- **键盘快捷键**: 数字键1-0控制按键0-9，F1/F2控制Test/Service
- **响应式设计**: 适配桌面和移动设备

## 使用方法

### 前置条件

1. 运行ongeki-io项目的MU3Input.dll
2. 确保ongeki-io监听UDP端口（默认10000）
3. 设置WebSocket到UDP的代理服务器（端口10001）

### 连接步骤

1. 打开`index.html`文件
2. 在连接设置中输入服务器IP和端口
3. 点击"连接"按钮
4. 连接成功后状态指示器会变绿

### 控制方式

#### 摇杆控制
- 鼠标拖拽摇杆球进行单轴移动
- 触控设备支持手指拖拽
- 摇杆值范围: -32767 到 +32767
- 不会自动回中，保持当前位置

#### 按键控制
- 点击界面上的按键进行控制
- 键盘快捷键:
  - 数字键 `1-9`: 控制按键0-8
  - 数字键 `0`: 控制按键9
  - `F1`: Test按键
  - `F2`: Service按键

## 通信协议

基于ongeki-io的UDP消息格式:

### 发送到IO的消息类型
- `ButtonStatus (1)`: 按键状态更新
- `MoveLever (2)`: 摇杆位置更新
- `Test (4)`: Test按键状态
- `Service (5)`: Service按键状态
- `Hello (255)`: 心跳消息

### 从IO接收的消息类型
- `SetLed (20)`: LED设置命令
- `SetLever (21)`: 摇杆位置设置
- `Hello (255)`: 心跳响应

## 技术架构

- **前端**: 纯HTML + CSS + JavaScript
- **通信**: WebSocket代理UDP协议
- **兼容性**: 支持现代浏览器
- **响应式**: 支持移动设备和桌面

## 部署说明

### WebSocket代理服务器

需要一个WebSocket到UDP的代理服务器来桥接Web前端和ongeki-io。代理服务器应该:

1. 监听WebSocket连接（端口10001）
2. 将WebSocket消息转发到UDP（端口10000）
3. 将UDP响应转发回WebSocket

### 示例代理服务器（Node.js）

```javascript
const WebSocket = require('ws');
const dgram = require('dgram');

const wss = new WebSocket.Server({ port: 10001 });
const udpClient = dgram.createSocket('udp4');

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === 'udp') {
            const buffer = Buffer.from(message.data);
            udpClient.send(buffer, 10000, '127.0.0.1');
        }
    });
    
    udpClient.on('message', (buffer) => {
        const message = {
            type: 'udp',
            data: Array.from(buffer)
        };
        ws.send(JSON.stringify(message));
    });
});
```

## 文件结构

```
ongeki-io-controller/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript逻辑
└── README.md           # 说明文档
```

## 开发说明

### 摇杆组件
- 单轴X轴移动
- 使用CSS transform进行位置控制
- 支持触控和鼠标事件
- 实时发送位置更新

### 按键组件
- 视觉反馈和状态管理
- 支持长按和释放事件
- 键盘快捷键映射

### 通信管理
- WebSocket连接管理
- 心跳机制
- 消息序列化和反序列化
- 错误处理和重连

## 许可证

本项目基于MIT许可证开源。