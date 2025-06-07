document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const connectBtn = document.getElementById('connect-btn');
    const modalContainer = document.getElementById('config-modal');
    const closeBtn = document.querySelector('.close-btn');
    const saveBtn = document.getElementById('save-btn');
    const colorInput = document.getElementById('key-color');
    const keyCodeInput = document.getElementById('key-code');
    const keys = document.querySelectorAll('.key');
    const profileSlots = document.querySelectorAll('.profile-slot');
    const resetLightsBtn = document.getElementById('reset-lights-btn');
    const saveConfigBtn = document.getElementById('save-config-btn');
    const loadConfigBtn = document.getElementById('load-config-btn');
    const loadConfigInput = document.getElementById('load-config-input');

    // --- State ---
    let hidDevice = null;
    let selectedKeyId = null;
    let currentProfile = 0;
    // Initialize configs from localStorage or create a default structure
    let profiles = loadProfiles() || Array(6).fill(null).map(() => ({}));

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
            if (config && config.color) {
                key.style.backgroundColor = config.color;
            } else {
                key.style.backgroundColor = ''; // Revert to CSS default
            }
        });
    }

    /**
     * Shows the configuration modal.
     * @param {string} keyId - The ID of the key to configure.
     */
    function showModal(keyId) {
        selectedKeyId = keyId;
        const config = profiles[currentProfile][selectedKeyId] || {};
        colorInput.value = config.color || '#7f8c8d';
        const keyCodeItem = document.getElementById('key-code-item');

        if (currentProfile === 0) {
            // It's profile 1 (index 0), IO mode. Hide keycode config.
            keyCodeItem.style.display = 'none';
        } else {
            // For other profiles, show and populate keycode config.
            keyCodeItem.style.display = 'flex';
            keyCodeInput.value = config.keyCode || '';
        }

        modalContainer.style.display = 'flex';
    }

    /**
     * Hides the configuration modal.
     */
    function hideModal() {
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
                alert('没有找到PGEKI设备(VID/PID: 0x0721)喵~');
                return;
            }
            hidDevice = devices[0];
            await hidDevice.open();
            connectBtn.textContent = '上载单个配置文件';
            connectBtn.style.backgroundColor = '#27ae60'; // Green
            console.log('Connected to HID device:', hidDevice);
            console.log('设备集合(Collections):', hidDevice.collections, '喵~ 这是调试的关键信息哦！');
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

        if (currentProfile !== 0) {
            const keyCodeStr = keyCodeInput.value.trim();
            if (keyCodeStr) {
                if (!/^(0x)?[0-9a-fA-F]{1,2}$/.test(keyCodeStr)) {
                    alert('键码格式不正确哦喵~ 请输入一个 0x00 到 0xFF 之间的十六进制数。');
                    return;
                }
                config.keyCode = keyCodeStr;
            } else {
                delete config.keyCode;
            }
        } else {
            delete config.keyCode; // Ensure no keycode for profile 0
        }

        profiles[currentProfile][selectedKeyId] = config;
        saveProfiles();
        updateKeyAppearances();
        hideModal();
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
     * Builds a 64-byte packet and sends it to the device.
     */
    async function handleUploadProfile() {
        if (!hidDevice) {
            alert('设备未连接喵~ 请先连接设备。');
            return;
        }

        // Based on the provided descriptor info:
        // HIDRAW_OUT_EP is 0x02, so we use reportId = 2.
        // HIDRAW_OUT_EP_SIZE is 63, so the data packet must be 63 bytes.
        const reportId = 0;
        const data = new Uint8Array(63); // The packet size MUST be 63 bytes.

        console.log(`正在使用固定的 reportId: ${reportId} 和 63字节的包大小喵~`);

        data[0] = 0x10; // Command: Upload Full Profile
        data[1] = currentProfile;

        const currentProfileConfig = profiles[currentProfile];
        let offset = 2;

        for (let i = 0; i < 8; i++) { // For all 8 keys
            const keyId = i.toString();
            const config = currentProfileConfig[keyId] || {};
            
            const color = config.color || '#7f8c8d'; // Default color
            const rgb = hexToRgb(color);
            
            let keyCode = 0x00;
            if (currentProfile !== 0 && config.keyCode) {
                keyCode = parseInt(config.keyCode, 16);
            }
            
            data[offset++] = rgb[0]; // R
            data[offset++] = rgb[1]; // G
            data[offset++] = rgb[2]; // B
            data[offset++] = keyCode;
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
            alert(`配置文件 ${currentProfile + 1} 已成功上载喵！`);
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


    // --- Event Listeners ---
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
    saveConfigBtn.addEventListener('click', handleSaveToFile);
    loadConfigBtn.addEventListener('click', () => loadConfigInput.click());
    loadConfigInput.addEventListener('change', handleLoadFromFile);
    
    // Hide modal if user clicks outside of the content area
    modalContainer.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            hideModal();
        }
    });

    keys.forEach(key => {
        key.addEventListener('click', () => showModal(key.dataset.keyId));
    });

    profileSlots.forEach((slot, index) => {
        slot.addEventListener('click', () => switchProfile(index));
    });

    // --- Initial Setup ---
    switchProfile(0); // Activate the first profile by default
}); 