document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const themeSwitch = document.getElementById('theme-checkbox');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const ioModeControls = document.getElementById('io-mode-controls');
    const ioModeControlsHeader = document.getElementById('io-mode-controls-header');
    const ioLightOverrideSwitch = document.getElementById('io-light-override-switch');
    const connectBtn = document.getElementById('connect-btn');
    const modalContainer = document.getElementById('config-modal');
    const closeBtn = document.querySelector('.close-btn');
    const saveBtn = document.getElementById('save-btn');
    const colorInput = document.getElementById('key-color');
    const keys = document.querySelectorAll('.key');
    const profileSlots = document.querySelectorAll('.profile-slot');
    const resetLightsBtn = document.getElementById('reset-lights-btn');
    const resetKeyBtn = document.getElementById('reset-key-btn');
    const resetAllBtn = document.getElementById('reset-all-btn');
    const saveConfigBtn = document.getElementById('save-config-btn');
    const loadConfigBtn = document.getElementById('load-config-btn');
    const loadConfigInput = document.getElementById('load-config-input');
    const recordKeyBtn = document.getElementById('record-key-btn');
    const currentKeyDisplay = document.getElementById('current-key-display');
    const toggleInputModeBtn = document.getElementById('toggle-input-mode-btn');
    const recordModeDiv = document.getElementById('record-mode');
    const manualModeDiv = document.getElementById('manual-mode');
    const keyCodeInput = document.getElementById('key-code-input');
    
    // Keycode List Modal Elements
    const showKeycodeListBtn = document.getElementById('show-keycode-list-btn');
    const keycodeListModal = document.getElementById('keycode-list-modal');
    const keycodeListCloseBtn = keycodeListModal.querySelector('.keycode-modal-close-btn');

    // Custom Modal Elements
    const customAlertModal = document.getElementById('custom-alert-modal');
    const customAlertText = document.getElementById('custom-alert-text');
    const customAlertOkBtn = document.getElementById('custom-alert-ok-btn');
    const customConfirmModal = document.getElementById('custom-confirm-modal');
    const customConfirmText = document.getElementById('custom-confirm-text');
    const customConfirmYesBtn = document.getElementById('custom-confirm-yes-btn');
    const customConfirmNoBtn = document.getElementById('custom-confirm-no-btn');

    // --- State ---
    let hidDevice = null;
    let selectedKeyId = null;
    let currentProfile = 0;
    let newKeySelection = null;
    let isRecording = false;
    let isManualMode = false;
    let keydownListener = null;
    let profiles = loadProfiles() || Array(6).fill(null).map(() => ({}));

    // --- Keycode Map ---
    const hidKeycodeMap = {
        // Alphanumeric
        'KeyA': 0x04, 'KeyB': 0x05, 'KeyC': 0x06, 'KeyD': 0x07, 'KeyE': 0x08, 'KeyF': 0x09, 'KeyG': 0x0A, 'KeyH': 0x0B, 'KeyI': 0x0C, 'KeyJ': 0x0D, 'KeyK': 0x0E, 'KeyL': 0x0F, 'KeyM': 0x10, 'KeyN': 0x11, 'KeyO': 0x12, 'KeyP': 0x13, 'KeyQ': 0x14, 'KeyR': 0x15, 'KeyS': 0x16, 'KeyT': 0x17, 'KeyU': 0x18, 'KeyV': 0x19, 'KeyW': 0x1A, 'KeyX': 0x1B, 'KeyY': 0x1C, 'KeyZ': 0x1D,
        'Digit1': 0x1E, 'Digit2': 0x1F, 'Digit3': 0x20, 'Digit4': 0x21, 'Digit5': 0x22, 'Digit6': 0x23, 'Digit7': 0x24, 'Digit8': 0x25, 'Digit9': 0x26, 'Digit0': 0x27,
        // Functional
        'Enter': 0x28, 'Escape': 0x29, 'Backspace': 0x2A, 'Tab': 0x2B, 'Space': 0x2C,
        // Symbols
        'Minus': 0x2D, 'Equal': 0x2E, 'BracketLeft': 0x2F, 'BracketRight': 0x30, 'Backslash': 0x31,
        'Semicolon': 0x33, 'Quote': 0x34, 'Backquote': 0x35, 'Comma': 0x36, 'Period': 0x37, 'Slash': 0x38,
        // Lock Keys
        'CapsLock': 0x39,
        // F-Keys
        'F1': 0x3A, 'F2': 0x3B, 'F3': 0x3C, 'F4': 0x3D, 'F5': 0x3E, 'F6': 0x3F, 'F7': 0x40, 'F8': 0x41, 'F9': 0x42, 'F10': 0x43, 'F11': 0x44, 'F12': 0x45,
        'F13': 0x68, 'F14': 0x69, 'F15': 0x6A, 'F16': 0x6B, 'F17': 0x6C, 'F18': 0x6D, 'F19': 0x6E, 'F20': 0x6F, 'F21': 0x70, 'F22': 0x71, 'F23': 0x72, 'F24': 0x73,
        // Control Keys
        'PrintScreen': 0x46, 'ScrollLock': 0x47, 'Pause': 0x48,
        'Insert': 0x49, 'Home': 0x4A, 'PageUp': 0x4B, 'Delete': 0x4C, 'End': 0x4D, 'PageDown': 0x4E,
        'ArrowRight': 0x4F, 'ArrowLeft': 0x50, 'ArrowDown': 0x51, 'ArrowUp': 0x52,
        // Modifiers
        'ControlLeft': 0xE0, 'ShiftLeft': 0xE1, 'AltLeft': 0xE2, 'MetaLeft': 0xE3,
        'ControlRight': 0xE4, 'ShiftRight': 0xE5, 'AltRight': 0xE6, 'MetaRight': 0xE7,
        // Numpad
        'NumLock': 0x53, 'NumpadDivide': 0x54, 'NumpadMultiply': 0x55, 'NumpadSubtract': 0x56,
        'NumpadAdd': 0x57, 'NumpadEnter': 0x58,
        'Numpad1': 0x59, 'Numpad2': 0x60, 'Numpad3': 0x61, 'Numpad4': 0x62,
        'Numpad5': 0x5D, 'Numpad6': 0x5E, 'Numpad7': 0x5F, 'Numpad8': 0x60,
        'Numpad9': 0x61, 'Numpad0': 0x62, 'NumpadDecimal': 0x63,
        // Media Keys (Consumer Page)
        'AudioVolumeUp': 0xE9, 'AudioVolumeDown': 0xEA, 'AudioMute': 0xE2,
        'MediaPlayPause': 0xCD, 'MediaStop': 0xB7, 'MediaTrackNext': 0xB5, 'MediaTrackPrevious': 0xB6,
    };

    const keyCodeToDisplayMap = Object.entries(hidKeycodeMap).reduce((acc, [key, code]) => {
        let display = key;
        if (key.startsWith('Key')) display = key.substring(3);
        else if (key.startsWith('Digit')) display = key.substring(5);
        else if (key === 'Backquote') display = '`';
        else if (key === 'Minus') display = '-';
        else if (key === 'Equal') display = '=';
        else if (key === 'BracketLeft') display = '[';
        else if (key === 'BracketRight') display = ']';
        else if (key === 'Backslash') display = '\\';
        else if (key === 'Semicolon') display = ';';
        else if (key === 'Quote') display = "'";
        else if (key === 'Comma') display = ',';
        else if (key === 'Period') display = '.';
        else if (key === 'Slash') display = '/';
        acc[code] = display;
        return acc;
    }, {
        // Add custom display names for clarity
        0xE0: 'L-Ctrl', 0xE1: 'L-Shift', 0xE2: 'L-Alt', 0xE3: 'L-Win',
        0xE4: 'R-Ctrl', 0xE5: 'R-Shift', 0xE6: 'R-Alt', 0xE7: 'R-Win',
        0x53: 'NumLk', 0x54: '/', 0x55: '*', 0x56: '-', 0x57: '+', 0x58: 'Enter',
        0x59: '1', 0x60: '2', 0x61: '3', 0x62: '4',
        0x5D: '5', 0x5E: '6', 0x5F: '7', 0x60: '8',
        0x61: '9', 0x62: '0', 0x63: '.',
        0xE9: 'Vol+', 0xEA: 'Vol-', 0xE2: 'Mute',
        0xCD: 'Play', 0xB7: 'Stop', 0xB5: 'Next', 0xB6: 'Prev',
    });

    // --- Custom Modal Functions ---
    function showCustomAlert(message) {
        customAlertText.textContent = message;
        customAlertModal.style.display = 'flex';
    }

    function showCustomConfirm(message) {
        return new Promise((resolve) => {
            customConfirmText.textContent = message;
            customConfirmModal.style.display = 'flex';

            const yesListener = () => {
                customConfirmModal.style.display = 'none';
                customConfirmYesBtn.removeEventListener('click', yesListener);
                customConfirmNoBtn.removeEventListener('click', noListener);
                resolve(true);
            };

            const noListener = () => {
                customConfirmModal.style.display = 'none';
                customConfirmYesBtn.removeEventListener('click', yesListener);
                customConfirmNoBtn.removeEventListener('click', noListener);
                resolve(false);
            };

            customConfirmYesBtn.addEventListener('click', yesListener);
            customConfirmNoBtn.addEventListener('click', noListener);
        });
    }

    // --- Functions ---

    /**
     * Loads profiles from localStorage.
     */
    function loadProfiles() {
        const profilesJson = localStorage.getItem('hid-config-profiles');
        try {
            const parsed = JSON.parse(profilesJson);
            // Basic validation to ensure it's in the expected format
            if (Array.isArray(parsed) && parsed.length === 6) {
                return parsed;
            }
        } catch (e) {
            console.error("Couldn't parse profiles from localStorage喵", e);
            return null;
        }
        return null;
    }

    /**
     * Saves all profiles to localStorage.
     */
    function saveProfiles() {
        localStorage.setItem('hid-config-profiles', JSON.stringify(profiles));
    }

    /**
     * Updates the visual appearance of all keys based on the current profile.
     */
    function updateKeyAppearances() {
        keys.forEach(key => {
            const keyId = key.dataset.keyId;
            const config = profiles[currentProfile][keyId];
            const keySpan = key.querySelector('span');

            if (config && config.color) {
                key.style.backgroundColor = config.color;
            } else {
                key.style.backgroundColor = ''; // Revert to CSS default
            }

            if (keySpan) {
                keySpan.textContent = (config && config.keyDisplay) ? config.keyDisplay : '';
            }
        });
    }

    /**
     * Shows the configuration modal.
     * @param {string} keyId - The ID of the key to configure.
     * @param {MouseEvent} event - The click event to position the modal.
     */
    function showModal(keyId, event) {
        // Temporarily show the modal to measure its dimensions
        modalContainer.style.visibility = 'hidden';
        modalContainer.style.display = 'flex';
        
        const modalContent = modalContainer.querySelector('.modal-content');
        const { offsetWidth: modalWidth, offsetHeight: modalHeight } = modalContent;
        
        // Hide it again before positioning
        modalContainer.style.display = 'none';
        modalContainer.style.visibility = 'visible';

        // Calculate position
        const x = event.clientX, y = event.clientY;
        const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
        let top = y + 15;
        let left = x + 15;

        // Check boundaries to keep modal on screen
        if (left + modalWidth > viewportWidth - 15) {
            left = x - modalWidth - 15;
        }
        if (top + modalHeight > viewportHeight - 15) {
            top = y - modalHeight - 15;
        }
        if (top < 15) {
            top = 15;
        }
        if (left < 15) {
            left = 15;
        }

        modalContent.style.top = `${top}px`;
        modalContent.style.left = `${left}px`;

        // --- Populate modal content ---
        selectedKeyId = keyId;
        newKeySelection = null;
        const config = profiles[currentProfile][selectedKeyId] || {};
        
        const keyColorItem = document.getElementById('key-color-item');
        const keyCodeItem = document.getElementById('key-code-item');

        const isSmallKey = parseInt(selectedKeyId) >= 8;
        keyColorItem.style.display = isSmallKey ? 'none' : 'flex';
        keyCodeItem.style.display = currentProfile === 0 ? 'none' : 'flex';

        colorInput.value = config.color || '#ffffff';
        keyCodeInput.value = config.keyCode ? `0x${config.keyCode.toString(16).padStart(2, '0')}` : '';
        currentKeyDisplay.textContent = config.keyDisplay || '无';

        isManualMode = false;
        recordModeDiv.style.display = 'flex';
        manualModeDiv.style.display = 'none';

        // --- Finally, show the modal at the correct position ---
        modalContainer.style.display = 'flex';
    }

    /**
     * Hides the configuration modal.
     */
    function hideModal() {
        if (isRecording) cancelRecording();
        modalContainer.style.display = 'none';
        selectedKeyId = null;
    }

    /**
     * Converts a hex color string to an array of RGB values.
     * @param {string} hex - The hex color string (e.g., "#ff0000").
     * @returns {number[]} - An array of [R, G, B] values.
     */
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
    
    /**
     * Handles the click event on the connect button.
     */
    async function handleConnect() {
        try {
            const devices = await navigator.hid.requestDevice({ filters: [{ vendorId: 0x0721, productId: 0x0721 }] });
            if (devices.length === 0) {
                showCustomAlert('喵喵喵? 没有找到设备哦~');
                return;
            }
            hidDevice = devices[0];
            await hidDevice.open();
            
            // Update button to show connected state
            setConnectButtonState(true);

            console.log('Connected to HID device:', hidDevice);
            console.log('设备集合(Collections):', hidDevice.collections, '喵~ 这是调试的关键信息哦！');
            
            // Start listening for input reports from the device
            hidDevice.addEventListener("inputreport", handleInputReport);
            console.log('现在开始监听设备按键回报了喵~');
            
            // Listen for the device to be disconnected
            navigator.hid.addEventListener('disconnect', (e) => {
                if (e.device === hidDevice) {
                    console.log('设备已断开连接喵！');
                    hidDevice = null;
                    setConnectButtonState(false);
                }
            });

        } catch (error) {
            console.error('连接HID设备时出错了喵:', error);
            showCustomAlert('连接失败了喵');
        }
    }

    /**
     * Updates the connect button's text and appearance.
     * @param {boolean} isConnected 
     */
    function setConnectButtonState(isConnected) {
        if (isConnected) {
            connectBtn.textContent = '点我写入配置 ✅';
            connectBtn.style.backgroundColor = '#27ae60'; // Green
        } else {
            connectBtn.textContent = '点我连接设备喵';
            connectBtn.style.backgroundColor = ''; // Revert to default CSS color
        }
    }

    /**
     * Handles the click event on the save button in the modal.
     * This now only saves to local state, no HID communication.
     */
    async function handleSave() {
        if (selectedKeyId === null) return;

        const color = colorInput.value;
        const config = profiles[currentProfile][selectedKeyId] || {};

        config.color = color;

        if (isManualMode) {
            const rawValue = keyCodeInput.value.trim();
            if (rawValue) {
                const parsedCode = parseInt(rawValue); // parseInt handles "0x" prefix
                if (!isNaN(parsedCode) && parsedCode >= 0 && parsedCode <= 255) {
                    config.keyCode = parsedCode;
                    config.keyDisplay = keyCodeToDisplayMap[parsedCode] || `0x${parsedCode.toString(16).padStart(2, '0').toUpperCase()}`;
                } else {
                    showCustomAlert('请输入一个有效的键码 (0-255 或 0x00-0xFF) 哦~ ( ´•_•。)');
                    return; // Don't save/close modal
                }
            } else {
                // Empty input, clear the key
                delete config.keyCode;
                delete config.keyDisplay;
            }
        } else {
            // Record mode logic
            if (newKeySelection) {
                config.keyCode = newKeySelection.keyCode;
                config.keyDisplay = newKeySelection.keyDisplay;
            }
        }

        profiles[currentProfile][selectedKeyId] = config;
        saveProfiles();
        updateKeyAppearances();
        hideModal();
    }

    /**
     * Handles input reports from the HID device to show key presses.
     * @param {HIDInputReportEvent} event
     */
    function handleInputReport(event) {
        const { data, device, reportId } = event;
        if (data.byteLength < 10) return;

        // New mapping based on user's description
        const byteToKeyIdMap = {
            0: 1, // 左侧第一个方键
            1: 2, // 左侧第二个方键
            2: 3, // 左侧第三个方键
            3: 0, // 左侧长方按键
            4: 8, // 左侧小圆键
            5: 4, // 右侧第一个方键
            6: 5, // 右侧第二个方键
            7: 6, // 右侧第三个方键
            8: 7, // 右侧长方按键
            9: 9  // 右侧小圆键
        };

        for (let byteIndex = 0; byteIndex < 10; byteIndex++) {
            const keyId = byteToKeyIdMap[byteIndex];
            const keyElement = document.querySelector(`.key[data-key-id="${keyId}"]`);
            if (!keyElement) continue;

            const isPressed = data.getUint8(byteIndex) !== 0;

            if (isPressed) {
                keyElement.classList.add('pressed');
            } else {
                keyElement.classList.remove('pressed');
            }
        }
    }

    /**
     * Switches the active profile.
     * @param {number} profileIndex - The index of the profile to switch to.
     */
    function switchProfile(profileIndex) {
        currentProfile = profileIndex;
        profileSlots.forEach((slot, index) => {
            slot.classList.toggle('active', index === profileIndex);
        });

        // Show/hide IO mode controls
        if (profileIndex === 0) {
            ioModeControls.style.display = 'flex';
            ioModeControlsHeader.style.display = 'block';
            // Set the switch state from profile data
            const config = profiles[0] || {};
            ioLightOverrideSwitch.checked = !!config.ioLightOverride;
        } else {
            ioModeControls.style.display = 'none';
            ioModeControlsHeader.style.display = 'none';
        }

        updateKeyAppearances();
        console.log(`切换到配置文件 ${profileIndex + 1} 喵~`);
    }

    /**
     * Handles the click event on the reset lights button.
     * This is now a local-only operation.
     */
    async function handleResetLights() {
        const confirmed = await showCustomConfirm('确定要重置当前配置文件的所有灯光吗？\n✨ 这个操作是本地的，需要写入手台才会生效哦~');
        if (!confirmed) {
            return;
        }

        Object.keys(profiles[currentProfile]).forEach(keyId => {
            if (profiles[currentProfile][keyId]) {
               delete profiles[currentProfile][keyId].color;
            }
        });

        saveProfiles();
        updateKeyAppearances();
        console.log('当前配置文件的灯光已在本地重置喵~');
    }

    /**
     * Resets all key assignments for the current profile.
     * This is a local-only operation.
     */
    async function handleResetKey() {
        if (currentProfile === 0) {
            showCustomAlert('喵呜！IO模式下的按键是固定的，不能重置哦~ (づ｡◕‿‿◕｡)づ');
            return;
        }
        const confirmed = await showCustomConfirm('确定要重置当前配置文件的所有按键吗？\n⌨️ 这个操作是本地的，需要写入手台才会生效哦~');
        if (!confirmed) {
            return;
        }

        Object.keys(profiles[currentProfile]).forEach(keyId => {
            if (profiles[currentProfile][keyId]) {
                delete profiles[currentProfile][keyId].keyCode;
                delete profiles[currentProfile][keyId].keyDisplay;
            }
        });

        saveProfiles();
        updateKeyAppearances();
        console.log('当前配置文件的所有按键已在本地重置喵~');
    }

    async function handleResetAll() {
        const confirmed = await showCustomConfirm('确定要重置当前配置文件吗？\n💥 这个操作是本地的，需要写入手台才会生效哦~');
        if (!confirmed) {
            return;
        }
        Object.keys(profiles[currentProfile]).forEach(keyId => {
            if (profiles[currentProfile][keyId]) {
               delete profiles[currentProfile][keyId].color;
            }
        });
        if (currentProfile !== 0) {
            Object.keys(profiles[currentProfile]).forEach(keyId => {
                if (profiles[currentProfile][keyId]) {
                   delete profiles[currentProfile][keyId].keyCode;
                   delete profiles[currentProfile][keyId].keyDisplay;
                }
            });
        }

        saveProfiles();
        updateKeyAppearances();
        console.log('当前配置文件已重置喵~');
    }
    /**
     * Builds a 64-byte packet and sends it to the device.
     */
    async function handleUploadProfile() {
        if (!hidDevice) {
            showCustomAlert('设备还没连接呢~ 请先连接设备哦！(＞д＜)');
            return;
        }

        showCustomAlert('正在写入配置文件... 请稍候哦~ ( V.v)V'); // Show pending status

        // A short delay to allow the pending message to render before potential blocking operation
        await new Promise(resolve => setTimeout(resolve, 50));

        const reportId = 0;
        const data = new Uint8Array(63);
        const currentConfig = profiles[currentProfile];
        let offset = 2;

        for (let i = 0; i < 10; i++) { // For all 10 keys
            const keyId = i.toString();
            const config = currentConfig[keyId] || {};
            const isSmallKey = i >= 8;
            
            // For small keys, color is always black (off). Otherwise, use config or default.
            const color = isSmallKey ? '#000000' : (config.color || '#7f8c8d');
            const rgb = hexToRgb(color);
            
            let keyCode = config.keyCode || 0x00;
            
            data[offset++] = rgb[0]; // R
            data[offset++] = rgb[1]; // G
            data[offset++] = rgb[2]; // B
            data[offset++] = keyCode;
        }

        // Handle the IO light override switch state for profile 0
        if (currentProfile === 0) {
            const config = profiles[0] || {};
            // The byte for the flag is now after the 10 key configs. 2 + (10*4) = 42.
            data[42] = config.ioLightOverride ? 1 : 0;
        }

        // --- 调试日志 ---
        console.log('--- 准备发送HID报告 ---');
        console.log(`目标设备喵:`, hidDevice.productName);
        console.log(`使用的 Report ID: ${reportId}`);
        console.log(`数据包 (Uint8Array, 长度: ${data.length} bytes):`, data);
        console.log(`数据包内容 (Hex): ${Array.from(data).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')}`);
        console.log('------------------------');

        try {
            await hidDevice.sendReport(reportId, data);
            showCustomAlert(`配置文件 ${currentProfile + 1} 已成功写入！🎉`);
        } catch (error) {
            console.error('配置文件写入失败了喵:', error);
            showCustomAlert('配置文件写入失败了喵...〒▽〒\r\n重启浏览器试试~');
        }
    }

    /**
     * Saves the CURRENTLY SELECTED profile to a local JSON file.
     */
    function handleSaveToFile() {
        const currentProfileConfig = profiles[currentProfile];
        if (!currentProfileConfig || Object.keys(currentProfileConfig).length === 0) {
            showCustomAlert(`配置文件 ${currentProfile + 1} 是空的，没什么可保存的哦~ (´｡• ᵕ •｡\`)`);
            return;
        }

        const profileJson = JSON.stringify(currentProfileConfig, null, 2);
        const blob = new Blob([profileJson], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const profileName = currentProfile === 0 ? 'IO' : currentProfile;
        a.download = `PG_Config_${profileName}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
        console.log(`配置文件 ${currentProfile + 1} 已保存到文件喵~`);
    }

    /**
     * Handles the file selection for loading a configuration into the CURRENTLY SELECTED profile.
     */
    function handleLoadFromFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const loadedProfile = JSON.parse(e.target.result);

                if (typeof loadedProfile === 'object' && loadedProfile !== null && !Array.isArray(loadedProfile)) {
                    // If loading into the IO profile, preserve its key assignments.
                    if (currentProfile === 0) {
                        const ioProfile = profiles[currentProfile] || {};
                        // Only update color and other non-key properties
                        for (const keyId in loadedProfile) {
                            if (loadedProfile[keyId].color) {
                                if (!ioProfile[keyId]) ioProfile[keyId] = {};
                                ioProfile[keyId].color = loadedProfile[keyId].color;
                            }
                            // Copy other potential future properties, but explicitly NOT keyCode/keyDisplay
                        }
                        // Specifically, handle the ioLightOverride property if it exists
                        if (loadedProfile.hasOwnProperty('ioLightOverride')) {
                            ioProfile.ioLightOverride = loadedProfile.ioLightOverride;
                        }
                        profiles[currentProfile] = ioProfile;
                    } else {
                        // For all other profiles, load the entire configuration
                        profiles[currentProfile] = loadedProfile;
                    }

                    saveProfiles();
                    updateKeyAppearances();
                    // Also update IO controls if we're on that profile
                    if (currentProfile === 0) {
                        ioLightOverrideSwitch.checked = !!(profiles[0] && profiles[0].ioLightOverride);
                    }
                    showCustomAlert(`配置已成功载入到配置文件 ${currentProfile + 1}！开心~ (ﾉ>ω<)ﾉ`);
                } else {
                    showCustomAlert('这个文件格式好像不对哦，请选择一个单个配置的文件~ ( ´•_•。)');
                }
            } catch (error) {
                console.error('解析配置文件失败了喵:', error);
                showCustomAlert('呜... 这不是一个有效的JSON配置文件呢... (｡•́︿•̀｡)');
            }
        };

        reader.onerror = () => {
             showCustomAlert('读取文件时出错了喵... (｡•́︿•̀｡)');
        };

        reader.readAsText(file);
        showCustomAlert('正在读取配置文件... 请稍候~ (ﾐⓛᆽⓛﾐ)'); // Show pending status
    }

    /**
     * Handles the IO light override switch change.
     */
    function handleIoLightSwitchChange() {
        if (currentProfile !== 0) return;

        // Ensure the profile object exists
        if (!profiles[0]) {
            profiles[0] = {};
        }
        profiles[0].ioLightOverride = ioLightOverrideSwitch.checked;
        saveProfiles();
        console.log(`接管IO灯光状态已更新为: ${ioLightOverrideSwitch.checked} 喵~`);
    }

    function cancelRecording() {
        if (keydownListener) {
            window.removeEventListener('keydown', keydownListener);
            keydownListener = null;
        }
        recordKeyBtn.textContent = '开始录制 🔴';
        recordKeyBtn.classList.remove('is-recording');
        isRecording = false;
    }

    function handleRecordKey() {
        if (isRecording) {
            cancelRecording();
            console.log('取消按键录制喵~');
            return;
        }

        recordKeyBtn.textContent = '请按键...点击取消';
        recordKeyBtn.classList.add('is-recording');
        isRecording = true;

        keydownListener = (event) => {
            event.preventDefault();

            const hidCode = hidKeycodeMap[event.code];

            if (hidCode) {
                newKeySelection = {
                    keyCode: hidCode,
                    keyDisplay: event.key.length === 1 ? event.key.toUpperCase() : event.key,
                };
                currentKeyDisplay.textContent = newKeySelection.keyDisplay;
                console.log(`录制到按键: ${newKeySelection.keyDisplay} (码: 0x${hidCode.toString(16)}) 喵~`);
            } else {
                newKeySelection = null; // Invalidate selection if key is not mapped
                currentKeyDisplay.textContent = '未映射 :(';
                 console.log(`录制到未映射的按键: ${event.code} 喵~`);
            }
            
            cancelRecording();
        };

        window.addEventListener('keydown', keydownListener);
    }

    function handleToggleInputMode() {
        isManualMode = !isManualMode;
        if (isManualMode) {
            recordModeDiv.style.display = 'none';
            manualModeDiv.style.display = 'flex';
            if (isRecording) {
                cancelRecording();
            }
        } else {
            recordModeDiv.style.display = 'flex';
            manualModeDiv.style.display = 'none';
        }
    }

    // --- Theme Management ---
    function setTheme(isLight) {
        if (isLight) {
            document.body.classList.add('light-mode');
            themeSwitch.checked = true;
        } else {
            document.body.classList.remove('light-mode');
            themeSwitch.checked = false;
        }
    }

    function applyInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            // If there's a theme saved, use it
            setTheme(savedTheme === 'light');
        } else {
            // Otherwise, use the system preference
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            setTheme(prefersLight);
        }
    }

    function handleThemeSwitch() {
        if (themeSwitch.checked) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    }

    // --- Event Listeners ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
    });

    connectBtn.addEventListener('click', () => hidDevice && hidDevice.opened ? handleUploadProfile() : handleConnect());
    saveBtn.addEventListener('click', handleSave);
    closeBtn.addEventListener('click', hideModal);
    resetLightsBtn.addEventListener('click', handleResetLights);
    resetKeyBtn.addEventListener('click', handleResetKey);
    resetAllBtn.addEventListener('click', handleResetAll);
    saveConfigBtn.addEventListener('click', handleSaveToFile);
    loadConfigBtn.addEventListener('click', () => loadConfigInput.click());
    loadConfigInput.addEventListener('change', handleLoadFromFile);
    ioLightOverrideSwitch.addEventListener('change', handleIoLightSwitchChange);
    recordKeyBtn.addEventListener('click', handleRecordKey);
    toggleInputModeBtn.addEventListener('click', handleToggleInputMode);
    themeSwitch.addEventListener('change', handleThemeSwitch);

    // Keycode List Modal Listeners
    showKeycodeListBtn.addEventListener('click', () => {
        keycodeListModal.style.display = 'flex';
    });
    keycodeListCloseBtn.addEventListener('click', () => {
        keycodeListModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalContainer) hideModal();
        if (event.target === keycodeListModal) keycodeListModal.style.display = 'none';
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            if (keycodeListModal.style.display !== 'none') {
                keycodeListModal.style.display = 'none';
            } else if (modalContainer.style.display !== 'none') {
                hideModal();
            }
        }
    });

    keys.forEach(key => {
        key.addEventListener('click', (event) => {
            const keyId = key.dataset.keyId;
            // If the key has no ID, it's decorative and non-configurable.
            if (!keyId) {
                return;
            }

            const isSmallKey = parseInt(keyId) >= 8;

            // In profile 0 (IO mode), small keys are completely disabled.
            if (currentProfile === 0 && isSmallKey) {
                console.log('这个小按键在IO模式下是禁用的哦喵~');
                return;
            }
            showModal(keyId, event);
        });
    });

    profileSlots.forEach((slot, index) => {
        slot.addEventListener('click', () => switchProfile(index));
    });

    customAlertOkBtn.addEventListener('click', () => {
        customAlertModal.style.display = 'none';
    });

    // --- Initial Setup ---
    document.body.classList.add('sidebar-collapsed');
    applyInitialTheme();
    switchProfile(0); // Activate the first profile by default
}); 