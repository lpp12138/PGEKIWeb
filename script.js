document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素
    const connectionStatus = document.getElementById('connection-status');
    const statusIndicator = document.getElementById('status-indicator');
    const connectButton = document.getElementById('connect-button');
    const serverIpInput = document.getElementById('server-ip');
    const serverPortInput = document.getElementById('server-port');
    
    // 摇杆相关元素
    const joystickStick = document.getElementById('joystick-stick');
    const joystickLeverValue = document.getElementById('joystick-lever-value');
    
    // 按键元素
    const controlButtons = document.querySelectorAll('.control-button');
    const testButton = document.getElementById('test-button');
    const serviceButton = document.getElementById('service-button');
    
    // 状态变量
    let joystickLever = 0; // 摇杆值，以0为中点 (int16_t)
    let isDragging = false;
    let joystickBaseRect = null;
    let isConnected = false;
    let websocket = null;
    let buttonStates = new Array(10).fill(false); // 10个按键状态
    let testPressed = false;
    let servicePressed = false;
    
    // ongeki-io UDP 消息类型
    const MessageType = {
        // 控制器向IO发送的
        ButtonStatus: 1,
        MoveLever: 2,
        Scan: 3,
        Test: 4,
        Service: 5,
        RequestValues: 6,
        // IO向控制器发送的
        SetLed: 20,
        SetLever: 21,
        // 寻找在线设备
        Hello: 255
    };
    
    // 初始化
    initializeJoystick();
    initializeButtons();
    initializeConnection();
    
    // 摇杆功能
    function initializeJoystick() {
        joystickBaseRect = joystickStick.parentElement.getBoundingClientRect();
        updateJoystickDisplay();
        
        // 监听摇杆拖拽
        joystickStick.addEventListener('mousedown', startJoystickDrag);
        joystickStick.addEventListener('touchstart', startJoystickDrag, { passive: false });
        
        // 监听窗口大小变化，更新joystickBaseRect
        window.addEventListener('resize', () => {
            joystickBaseRect = joystickStick.parentElement.getBoundingClientRect();
        });
    }
    
    function startJoystickDrag(event) {
        isDragging = true;
        joystickBaseRect = joystickStick.parentElement.getBoundingClientRect();
        
        event.preventDefault();
        
        document.addEventListener('mousemove', handleJoystickDrag);
        document.addEventListener('mouseup', stopJoystickDrag);
        document.addEventListener('touchmove', handleJoystickDrag, { passive: false });
        document.addEventListener('touchend', stopJoystickDrag);
    }
    
    function handleJoystickDrag(event) {
        if (!isDragging) return;
        
        event.preventDefault();
        
        let clientX;
        if (event.type.startsWith('touch')) {
            if (event.touches.length === 0) return;
            clientX = event.touches[0].clientX;
        } else {
            clientX = event.clientX;
        }
        
        // 计算相对于摇杆基座中心的X位置
        const centerX = joystickBaseRect.left + joystickBaseRect.width / 2;
        const deltaX = clientX - centerX;
        
        // 限制在水平范围内
        const maxDistance = (joystickBaseRect.width / 2) - 30; // 留出摇杆把手的空间
        let finalX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
        
        // 计算lever值 - 从-32767到+32767
        joystickLever = Math.round((finalX / maxDistance) * 32767);
        
        // 更新视觉位置（只有X轴移动）
        joystickStick.style.transform = `translate(calc(-50% + ${finalX}px), -50%)`;
        
        updateJoystickDisplay();
        sendLeverUpdate();
    }
    
    function stopJoystickDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        
        // 移除事件监听器，摇杆保持在当前位置，不自动回中
        document.removeEventListener('mousemove', handleJoystickDrag);
        document.removeEventListener('mouseup', stopJoystickDrag);
        document.removeEventListener('touchmove', handleJoystickDrag);
        document.removeEventListener('touchend', stopJoystickDrag);
    }
    
    function updateJoystickDisplay() {
        joystickLeverValue.textContent = `Lever: ${joystickLever}`;
    }
    
    function sendLeverUpdate() {
        if (!isConnected || !websocket) return;
        
        // 发送摇杆位置更新 (MoveLever消息类型)
        const message = {
            type: 'udp',
            data: [MessageType.MoveLever, joystickLever & 0xFF, (joystickLever >> 8) & 0xFF]
        };
        websocket.send(JSON.stringify(message));
    }
    
    // 按键功能
    function initializeButtons() {
        // 主要按键
        controlButtons.forEach((button, index) => {
            button.addEventListener('mousedown', () => pressButton(index, true));
            button.addEventListener('mouseup', () => pressButton(index, false));
            button.addEventListener('mouseleave', () => pressButton(index, false));
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                pressButton(index, true);
            });
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                pressButton(index, false);
            });
        });
        
        // Test按键
        testButton.addEventListener('mousedown', () => pressSpecialButton('test', true));
        testButton.addEventListener('mouseup', () => pressSpecialButton('test', false));
        testButton.addEventListener('mouseleave', () => pressSpecialButton('test', false));
        testButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            pressSpecialButton('test', true);
        });
        testButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            pressSpecialButton('test', false);
        });
        
        // Service按键
        serviceButton.addEventListener('mousedown', () => pressSpecialButton('service', true));
        serviceButton.addEventListener('mouseup', () => pressSpecialButton('service', false));
        serviceButton.addEventListener('mouseleave', () => pressSpecialButton('service', false));
        serviceButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            pressSpecialButton('service', true);
        });
        serviceButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            pressSpecialButton('service', false);
        });
    }
    
    function pressButton(buttonIndex, pressed) {
        if (buttonIndex < 0 || buttonIndex >= 10) return;
        
        buttonStates[buttonIndex] = pressed;
        
        // 更新按键视觉状态
        const button = controlButtons[buttonIndex];
        if (pressed) {
            button.classList.add('pressed');
        } else {
            button.classList.remove('pressed');
        }
        
        // 发送按键状态更新
        sendButtonUpdate(buttonIndex, pressed);
    }
    
    function pressSpecialButton(type, pressed) {
        if (type === 'test') {
            testPressed = pressed;
            if (pressed) {
                testButton.classList.add('pressed');
            } else {
                testButton.classList.remove('pressed');
            }
            sendSpecialButtonUpdate(MessageType.Test, pressed);
        } else if (type === 'service') {
            servicePressed = pressed;
            if (pressed) {
                serviceButton.classList.add('pressed');
            } else {
                serviceButton.classList.remove('pressed');
            }
            sendSpecialButtonUpdate(MessageType.Service, pressed);
        }
    }
    
    function sendButtonUpdate(buttonIndex, pressed) {
        if (!isConnected || !websocket) return;
        
        // 发送按键状态更新 (ButtonStatus消息类型)
        const message = {
            type: 'udp',
            data: [MessageType.ButtonStatus, buttonIndex, pressed ? 1 : 0]
        };
        websocket.send(JSON.stringify(message));
    }
    
    function sendSpecialButtonUpdate(messageType, pressed) {
        if (!isConnected || !websocket) return;
        
        // 发送特殊按键状态更新
        const message = {
            type: 'udp',
            data: [messageType, pressed ? 1 : 0]
        };
        websocket.send(JSON.stringify(message));
    }
    
    // 连接功能
    function initializeConnection() {
        connectButton.addEventListener('click', toggleConnection);
    }
    
    function toggleConnection() {
        if (isConnected) {
            disconnect();
        } else {
            connect();
        }
    }
    
    function connect() {
        const ip = serverIpInput.value.trim();
        const port = parseInt(serverPortInput.value);
        
        if (!ip || !port || port < 1 || port > 65535) {
            alert('请输入有效的IP地址和端口号');
            return;
        }
        
        // 注意：这里假设有一个WebSocket代理服务器来处理UDP通信
        // 实际部署时需要一个WebSocket到UDP的代理服务
        const wsUrl = `ws://${ip}:${port + 1}`; // WebSocket代理端口
        
        try {
            websocket = new WebSocket(wsUrl);
            
            websocket.onopen = () => {
                isConnected = true;
                updateConnectionStatus(true);
                connectButton.textContent = '断开连接';
                connectButton.disabled = false;
                
                // 发送Hello消息建立连接
                sendHello();
                
                console.log('已连接到 ongeki-io');
            };
            
            websocket.onclose = () => {
                isConnected = false;
                updateConnectionStatus(false);
                connectButton.textContent = '连接';
                connectButton.disabled = false;
                websocket = null;
                
                console.log('与 ongeki-io 的连接已断开');
            };
            
            websocket.onerror = (error) => {
                console.error('WebSocket连接错误:', error);
                isConnected = false;
                updateConnectionStatus(false);
                connectButton.textContent = '连接';
                connectButton.disabled = false;
                websocket = null;
                
                alert('连接失败，请检查IP地址和端口是否正确');
            };
            
            websocket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    handleIncomingMessage(message);
                } catch (e) {
                    console.error('消息解析错误:', e);
                }
            };
            
            connectButton.textContent = '连接中...';
            connectButton.disabled = true;
            
        } catch (error) {
            console.error('连接错误:', error);
            alert('连接失败');
        }
    }
    
    function disconnect() {
        if (websocket) {
            websocket.close();
        }
        isConnected = false;
        updateConnectionStatus(false);
        connectButton.textContent = '连接';
        connectButton.disabled = false;
        websocket = null;
    }
    
    function updateConnectionStatus(connected) {
        if (connected) {
            connectionStatus.textContent = '已连接';
            statusIndicator.classList.add('connected');
        } else {
            connectionStatus.textContent = '未连接';
            statusIndicator.classList.remove('connected');
        }
    }
    
    function sendHello() {
        if (!isConnected || !websocket) return;
        
        // 发送Hello消息
        const message = {
            type: 'udp',
            data: [MessageType.Hello, 1]
        };
        websocket.send(JSON.stringify(message));
    }
    
    function handleIncomingMessage(message) {
        if (message.type === 'udp' && message.data) {
            const data = message.data;
            const messageType = data[0];
            
            switch (messageType) {
                case MessageType.SetLever:
                    // 接收到摇杆位置设置命令
                    if (data.length >= 3) {
                        const leverValue = data[1] | (data[2] << 8);
                        updateJoystickFromServer(leverValue);
                    }
                    break;
                case MessageType.SetLed:
                    // 接收到LED设置命令（暂时忽略，因为我们没有LED显示）
                    console.log('收到LED设置命令:', data);
                    break;
                case MessageType.Hello:
                    // 心跳响应
                    console.log('收到心跳响应');
                    break;
                default:
                    console.log('收到未知消息类型:', messageType, data);
            }
        }
    }
    
    function updateJoystickFromServer(leverValue) {
        // 更新摇杆值
        joystickLever = leverValue;
        
        // 计算视觉位置 - lever值映射到水平位置
        const maxDistance = (joystickBaseRect ? joystickBaseRect.width / 2 : 150) - 30;
        const visualX = (leverValue / 32767) * maxDistance;
        
        // 更新摇杆位置（只有X轴移动）
        joystickStick.style.transform = `translate(calc(-50% + ${visualX}px), -50%)`;
        updateJoystickDisplay();
    }
    
    // 定期发送心跳
    setInterval(() => {
        if (isConnected) {
            sendHello();
        }
    }, 1000);
    
    // 键盘控制支持
    document.addEventListener('keydown', (event) => {
        if (!isConnected) return;
        
        const key = event.code;
        
        // 数字键1-0控制按键0-9
        if (key >= 'Digit1' && key <= 'Digit9') {
            const buttonIndex = parseInt(key.slice(-1)) - 1;
            pressButton(buttonIndex, true);
            event.preventDefault();
        } else if (key === 'Digit0') {
            pressButton(9, true);
            event.preventDefault();
        }
        // F1控制Test，F2控制Service
        else if (key === 'F1') {
            pressSpecialButton('test', true);
            event.preventDefault();
        } else if (key === 'F2') {
            pressSpecialButton('service', true);
            event.preventDefault();
        }
    });
    
    document.addEventListener('keyup', (event) => {
        if (!isConnected) return;
        
        const key = event.code;
        
        // 数字键1-0控制按键0-9
        if (key >= 'Digit1' && key <= 'Digit9') {
            const buttonIndex = parseInt(key.slice(-1)) - 1;
            pressButton(buttonIndex, false);
            event.preventDefault();
        } else if (key === 'Digit0') {
            pressButton(9, false);
            event.preventDefault();
        }
        // F1控制Test，F2控制Service
        else if (key === 'F1') {
            pressSpecialButton('test', false);
            event.preventDefault();
        } else if (key === 'F2') {
            pressSpecialButton('service', false);
            event.preventDefault();
        }
    });
}); 