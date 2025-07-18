#!/usr/bin/env node

const WebSocket = require('ws');
const dgram = require('dgram');

// 配置
const WS_PORT = 10001;  // WebSocket端口
const UDP_PORT = 10000; // UDP端口
const UDP_HOST = '127.0.0.1';

// 创建WebSocket服务器
const wss = new WebSocket.Server({ 
    port: WS_PORT,
    perMessageDeflate: false 
});

console.log(`WebSocket代理服务器启动在端口 ${WS_PORT}`);
console.log(`转发UDP数据到 ${UDP_HOST}:${UDP_PORT}`);

// 创建UDP客户端
const udpClient = dgram.createSocket('udp4');

// 存储WebSocket连接
const connections = new Set();

// WebSocket连接处理
wss.on('connection', (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    console.log(`WebSocket客户端连接: ${clientIP}`);
    
    connections.add(ws);
    
    // 处理WebSocket消息
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            if (message.type === 'udp' && message.data) {
                // 将数组转换为Buffer并发送到UDP
                const buffer = Buffer.from(message.data);
                console.log(`发送UDP数据: [${message.data.join(', ')}] (${buffer.length} bytes)`);
                
                udpClient.send(buffer, UDP_PORT, UDP_HOST, (err) => {
                    if (err) {
                        console.error('UDP发送错误:', err);
                    }
                });
            }
        } catch (error) {
            console.error('WebSocket消息解析错误:', error);
        }
    });
    
    // WebSocket连接关闭
    ws.on('close', () => {
        console.log(`WebSocket客户端断开: ${clientIP}`);
        connections.delete(ws);
    });
    
    // WebSocket错误处理
    ws.on('error', (error) => {
        console.error('WebSocket错误:', error);
        connections.delete(ws);
    });
});

// UDP响应处理
udpClient.on('message', (buffer, rinfo) => {
    console.log(`收到UDP响应: [${Array.from(buffer).join(', ')}] 来自 ${rinfo.address}:${rinfo.port}`);
    
    // 转发给所有WebSocket客户端
    const message = {
        type: 'udp',
        data: Array.from(buffer)
    };
    
    const messageStr = JSON.stringify(message);
    
    connections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(messageStr);
        }
    });
});

// UDP错误处理
udpClient.on('error', (error) => {
    console.error('UDP错误:', error);
});

// 优雅退出
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    
    // 关闭所有WebSocket连接
    connections.forEach((ws) => {
        ws.close();
    });
    
    // 关闭UDP socket
    udpClient.close();
    
    // 关闭WebSocket服务器
    wss.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});

// 错误处理
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
    process.exit(1);
});