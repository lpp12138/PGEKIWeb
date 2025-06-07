document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const ioModeControls = document.getElementById('io-mode-controls');
    const ioLightOverrideSwitch = document.getElementById('io-light-override-switch');
    const connectBtn = document.getElementById('connect-btn');
    const modalContainer = document.getElementById('config-modal');
    const closeBtn = document.querySelector('.close-btn');
    const saveBtn = document.getElementById('save-btn');
    const colorInput = document.getElementById('key-color');
    const keys = document.querySelectorAll('.key');
    const profileSlots = document.querySelectorAll('.profile-slot');
    const resetLightsBtn = document.getElementById('reset-lights-btn');
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
        'KeyA': 0x04, 'KeyB': 0x05, 'KeyC': 0x06, 'KeyD': 0x07, 'KeyE': 0x08, 'KeyF': 0x09, 'KeyG': 0x0A, 'KeyH': 0x0B, 'KeyI': 0x0C, 'KeyJ': 0x0D, 'KeyK': 0x0E, 'KeyL': 0x0F, 'KeyM': 0x10, 'KeyN': 0x11, 'KeyO': 0x12, 'KeyP': 0x13, 'KeyQ': 0x14, 'KeyR': 0x15, 'KeyS': 0x16, 'KeyT': 0x17, 'KeyU': 0x18, 'KeyV': 0x19, 'KeyW': 0x1A, 'KeyX': 0x1B, 'KeyY': 0x1C, 'KeyZ': 0x1D,
        'Digit1': 0x1E, 'Digit2': 0x1F, 'Digit3': 0x20, 'Digit4': 0x21, 'Digit5': 0x22, 'Digit6': 0x23, 'Digit7': 0x24, 'Digit8': 0x25, 'Digit9': 0x26, 'Digit0': 0x27,
        'Enter': 0x28, 'Escape': 0x29, 'Backspace': 0x2A, 'Tab': 0x2B, 'Space': 0x2C,
        'Minus': 0x2D, 'Equal': 0x2E, 'BracketLeft': 0x2F, 'BracketRight': 0x30, 'Backslash': 0x31,
        'Semicolon': 0x33, 'Quote': 0x34, 'Backquote': 0x35, 'Comma': 0x36, 'Period': 0x37, 'Slash': 0x38,
        'CapsLock': 0x39,
        'F1': 0x3A, 'F2': 0x3B, 'F3': 0x3C, 'F4': 0x3D, 'F5': 0x3E, 'F6': 0x3F, 'F7': 0x40, 'F8': 0x41, 'F9': 0x42, 'F10': 0x43, 'F11': 0x44, 'F12': 0x45,
        'PrintScreen': 0x46, 'ScrollLock': 0x47, 'Pause': 0x48,
        'Insert': 0x49, 'Home': 0x4A, 'PageUp': 0x4B, 'Delete': 0x4C, 'End': 0x4D, 'PageDown': 0x4E,
        'ArrowRight': 0x4F, 'ArrowLeft': 0x50, 'ArrowDown': 0x51, 'ArrowUp': 0x52,
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
    }, {});

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
     */
    function showModal(keyId) {
        selectedKeyId = keyId;
        newKeySelection = null; // Reset any pending selection
        const config = profiles[currentProfile][selectedKeyId] || {};
        
        const keyColorItem = document.getElementById('key-color-item');
        const keyCodeItem = document.getElementById('key-code-item');

        // Show/hide elements based on key type and profile
        const isSmallKey = parseInt(selectedKeyId) >= 8;

        if (isSmallKey) {
            keyColorItem.style.display = 'none';
        } else {
            keyColorItem.style.display = 'flex';
        }

        if (currentProfile === 0) {
            // It's profile 1 (IO mode). Hide keycode config for all keys.
            keyCodeItem.style.display = 'none';
        } else {
            keyCodeItem.style.display = 'flex';
        }

        // Update color and key display
        colorInput.value = config.color || '#ffffff';
        keyCodeInput.value = config.keyCode ? `0x${config.keyCode.toString(16).padStart(2, '0')}` : '';
        currentKeyDisplay.textContent = config.keyDisplay || '无';

        // Reset to record mode view
        isManualMode = false;
        recordModeDiv.style.display = 'flex';
        manualModeDiv.style.display = 'none';

        modalContainer.style.display = 'flex';
    }

    /**
     * Hides the configuration modal.
     */
    function hideModal() {
        if (isRecording) {
            cancelRecording();
        }
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
                alert('喵喵喵?');
                return;
            }
            hidDevice = devices[0];
            await hidDevice.open();
            connectBtn.textContent = '写入单个配置文件';
            connectBtn.style.backgroundColor = '#27ae60'; // Green
            console.log('Connected to HID device:', hidDevice);
            console.log('设备集合(Collections):', hidDevice.collections, '喵~ 这是调试的关键信息哦！');
            
            // Start listening for input reports from the device
            hidDevice.addEventListener("inputreport", handleInputReport);
            console.log('现在开始监听设备按键回报了喵~');

        } catch (error) {
            console.error('连接HID设备时出错了喵:', error);
            alert('连接失败了喵');
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
                    alert('请输入一个有效的键码 (0-255 或 0x00-0xFF) 喵~');
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
            // Set the switch state from profile data
            const config = profiles[0] || {};
            ioLightOverrideSwitch.checked = !!config.ioLightOverride;
        } else {
            ioModeControls.style.display = 'none';
        }

        updateKeyAppearances();
        console.log(`切换到配置文件 ${profileIndex + 1} 喵~`);
    }

    /**
     * Handles the click event on the reset lights button.
     * This is now a local-only operation.
     */
    async function handleResetLights() {
        if (!confirm('确定要重置当前配置文件的所有灯光吗喵？这个操作是本地的，需要点击写入才会生效哦。')) {
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
    function handleResetAll() {
        if (currentProfile === 0) {
            alert('喵呜！IO模式下的按键是固定的，不能重置哦~');
            return;
        }
        if (!confirm('确定要重置当前配置文件的所有按键吗喵？这个操作是本地的，需要点击写入才会生效哦。')) {
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

    /**
     * Builds a 64-byte packet and sends it to the device.
     */
    async function handleUploadProfile() {
        if (!hidDevice) {
            alert('设备未连接喵~ 请先连接设备。');
            return;
        }

        const reportId = 0;
        const data = new Uint8Array(63);

        data[0] = 0x10; // Command: Upload Full Profile
        data[1] = currentProfile;

        const currentProfileConfig = profiles[currentProfile];
        let offset = 2;

        for (let i = 0; i < 10; i++) { // For all 10 keys
            const keyId = i.toString();
            const config = currentProfileConfig[keyId] || {};
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
            alert(`配置文件 ${currentProfile + 1} 已成写入喵！`);
        } catch (error) {
            console.error('配置文件写入失败了喵:', error);
            alert('配置文件写入失败了喵');
        }
    }

    /**
     * Saves all profiles to a local JSON file.
     */
    function handleSaveToFile() {
        const profilesJson = JSON.stringify(profiles, null, 2);
        const blob = new Blob([profilesJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pgeki_config_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('配置已保存到文件喵~');
    }

    /**
     * Handles the file selection for loading a configuration.
     */
    function handleLoadFromFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedProfiles = JSON.parse(e.target.result);
                // Basic validation
                if (Array.isArray(loadedProfiles) && loadedProfiles.length === 6) {
                    profiles = loadedProfiles;
                    saveProfiles();
                    switchProfile(currentProfile); // Refresh UI
                    alert('配置已成功载入喵！');
                } else {
                    alert('载入的配置文件格式不正确喵~');
                }
            } catch (error) {
                console.error('解析配置文件失败了喵:', error);
                alert('这不是一个有效的JSON配置文件喵~');
            }
        };
        reader.readAsText(file);
        // Reset input value to allow loading the same file again
        event.target.value = '';
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
        recordKeyBtn.textContent = '点此录制按键';
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
                currentKeyDisplay.textContent = '未映射';
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

    // --- Event Listeners ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
    });

    connectBtn.addEventListener('click', () => {
        if (hidDevice && hidDevice.opened) {
            handleUploadProfile();
        } else {
            handleConnect();
        }
    });

    saveBtn.addEventListener('click', handleSave);
    closeBtn.addEventListener('click', hideModal);
    resetLightsBtn.addEventListener('click', handleResetLights);
    resetAllBtn.addEventListener('click', handleResetAll);
    saveConfigBtn.addEventListener('click', handleSaveToFile);
    loadConfigBtn.addEventListener('click', () => loadConfigInput.click());
    loadConfigInput.addEventListener('change', handleLoadFromFile);
    ioLightOverrideSwitch.addEventListener('change', handleIoLightSwitchChange);
    recordKeyBtn.addEventListener('click', handleRecordKey);
    toggleInputModeBtn.addEventListener('click', handleToggleInputMode);
    
    // Hide modal if user clicks outside of the content area
    modalContainer.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            hideModal();
        }
    });

    keys.forEach(key => {
        key.addEventListener('click', () => {
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
            showModal(keyId);
        });
    });

    profileSlots.forEach((slot, index) => {
        slot.addEventListener('click', () => switchProfile(index));
    });

    // --- Initial Setup ---
    document.body.classList.add('sidebar-collapsed');
    switchProfile(0); // Activate the first profile by default
}); 