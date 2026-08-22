document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const themeSwitch = document.getElementById('theme-checkbox');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const ioModeControls = document.getElementById('io-mode-controls');
    const ioModeControlsHeader = document.getElementById('io-mode-controls-header');
    const ioLightOverrideSwitch = document.getElementById('io-light-override-switch');
    const usbModeSelect = document.getElementById('usb-mode-select');
    const connectBtn = document.getElementById('connect-btn');
    const firmwareVersion = document.getElementById('firmware-version');
    const mainContent = document.querySelector('.main-content');
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
    const firmwareUpdateBtn = document.getElementById('firmware-update-btn');
    const firmwareUpdateModal = document.getElementById('firmware-update-modal');
    const firmwareUpdateCloseBtn = firmwareUpdateModal.querySelector('.firmware-update-close-btn');
    const firmwareReleaseSelect = document.getElementById('firmware-release-select');
    const firmwareReleaseInfo = document.getElementById('firmware-release-info');
    const firmwareFileInput = document.getElementById('firmware-file-input');
    const firmwareUploadBtn = document.getElementById('firmware-upload-btn');
    const firmwareUpdateProgress = document.getElementById('firmware-update-progress');
    const firmwareUpdateStatus = document.getElementById('firmware-update-status');
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

    const USB_MODES = Object.freeze({
        RAW_IO: 1,
        IO4: 2,
    });
    const WEB_CONFIG_COMMAND = 0x10;
    const WEB_SENSITIVITY_COMMAND = 0x11;
    const WEB_SENSITIVITY_MAGIC = Object.freeze([0x53, 0x54]);
    const WEB_SENSITIVITY_PROTOCOL_VERSION = 1;
    const SENSOR_SENSITIVITY_MINIMUM = -30;
    const SENSOR_SENSITIVITY_MAXIMUM = 30;
    const SENSOR_SENSITIVITY_CONFIRM_TIMEOUT_MS = 1500;
    const WEB_OTA_PROTOCOL_VERSION = 1;
    const WEB_OTA_COMMAND_MAGIC = Object.freeze([0xA5, 0x5A]);
    const WEB_OTA_COMMANDS = Object.freeze({
        BEGIN: 0x20,
        DATA: 0x21,
        END: 0x22,
        ABORT: 0x23,
    });
    const WEB_OTA_STATUS_MAGIC = Object.freeze([0xA5, 0x5A]);
    const WEB_OTA_STATUS_OK = 0x00;
    const WEB_OTA_STATUS_COMPLETE = 0x01;
    const WEB_OTA_DATA_SIZE = 57;
    const WEB_OTA_MAXIMUM_IMAGE_SIZE = 2 * 1024 * 1024;
    const FIRMWARE_CATALOG_MINIMUM_VERSION = Object.freeze([1, 0, 0]);
    const SENSOR_TELEMETRY_MAGIC = Object.freeze([0x53, 0x54]);
    const SENSOR_TELEMETRY_PROTOCOL_VERSION = 1;
    const SENSOR_TELEMETRY_POLL_INTERVAL_MS = 50;
    const SENSOR_TELEMETRY_HISTORY_POINTS = 120;
    const SENSOR_CHART_WIDTH = 600;
    const SENSOR_CHART_HEIGHT = 210;
    const USB_DEVICE_DEFINITIONS = Object.freeze([
        {
            vendorId: 0x0721,
            productId: 0x0721,
            usagePage: 0xff00,
            usage: 0x01,
            mode: USB_MODES.RAW_IO,
            outputReportId: 0x00,
            inputReportId: 0x00,
            sensorFeatureReportId: 0x00,
        },
        {
            vendorId: 0x0ca3,
            productId: 0x0021,
            usagePage: 0x01,
            usage: 0x04,
            mode: USB_MODES.IO4,
            outputReportId: 0x10,
            inputReportId: 0x01,
            sensorFeatureReportId: 0x11,
        },
    ]);
    const buttonIndexToKeyId = Object.freeze([1, 2, 3, 0, 8, 4, 5, 6, 7, 9]);

    // --- State ---
    let hidDevice = null;
    let connectedUsbMode = null;
    let selectedKeyId = null;
    let currentProfile = 0;
    let newKeySelection = null;
    let isRecording = false;
    let isManualMode = false;
    let keydownListener = null;
    let otaUploadActive = false;
    let otaAckWaiter = null;
    let firmwareCatalogEntries = [];
    let firmwareCatalogLoadPromise = null;
    let sensorTelemetryTimer = null;
    let sensorTelemetryGeneration = 0;
    let sensorTelemetrySupported = false;
    let sensorSensitivityWriteInProgress = false;
    const sensorHistory = { left: [], right: [] };
    const latestSensorSensitivity = { left: null, right: null };
    const pendingSensorSensitivity = { left: null, right: null };
    const sensorSensitivityConfirmTimer = { left: null, right: null };
    const sensorCardElements = {
        left: collectSensorCardElements('left'),
        right: collectSensorCardElements('right'),
    };
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
            //console.error("Couldn't parse profiles from localStorage喵", e);
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

    function collectSensorCardElements(side) {
        const card = document.querySelector(`[data-sensor-side="${side}"]`);
        const field = name => card.querySelector(`[data-sensor-field="${name}"]`);
        return {
            card,
            chart: card.querySelector('.sensor-chart'),
            signalLine: card.querySelector('.sensor-signal-line'),
            signalArea: card.querySelector('.sensor-signal-area'),
            pressLine: card.querySelector('.sensor-press-line'),
            releaseLine: card.querySelector('.sensor-release-line'),
            signal: field('signal'),
            pressThreshold: field('pressThreshold'),
            releaseThreshold: field('releaseThreshold'),
            sensitivity: field('sensitivity'),
            sensitivityInput: card.querySelector('[data-sensor-control="sensitivity"]'),
            sensitivityStatus: field('sensitivityStatus'),
            raw: field('raw'),
            filtered: field('filtered'),
            baseline: field('baseline'),
        };
    }

    function readTelemetrySide(data, offset, source, sensitivity,
        calibrated, pressed) {
        return {
            source,
            sensitivity,
            calibrated,
            pressed,
            raw: data.getUint32(offset, true),
            filtered: data.getUint32(offset + 4, true),
            baseline: data.getUint32(offset + 8, true),
            signal: data.getUint32(offset + 12, true),
            pressThreshold: data.getUint32(offset + 16, true),
            releaseThreshold: data.getUint32(offset + 20, true),
        };
    }

    function decodeSensorTelemetry(data) {
        const payloadOffset = data.byteLength >= 61 &&
            data.getUint8(1) === SENSOR_TELEMETRY_MAGIC[0] &&
            data.getUint8(2) === SENSOR_TELEMETRY_MAGIC[1] ? 1 : 0;
        if (data.byteLength < payloadOffset + 60 ||
            data.getUint8(payloadOffset) !== SENSOR_TELEMETRY_MAGIC[0] ||
            data.getUint8(payloadOffset + 1) !== SENSOR_TELEMETRY_MAGIC[1] ||
            data.getUint8(payloadOffset + 2) !== SENSOR_TELEMETRY_PROTOCOL_VERSION) {
            throw new Error('传感遥测协议不兼容');
        }
        const flags = data.getUint8(payloadOffset + 3);
        const versionComponents = data.byteLength >= payloadOffset + 63 ? [
            data.getUint8(payloadOffset + 60),
            data.getUint8(payloadOffset + 61),
            data.getUint8(payloadOffset + 62),
        ] : null;
        return {
            left: readTelemetrySide(data, payloadOffset + 8,
                data.getUint8(payloadOffset + 4),
                data.getInt8(payloadOffset + 6),
                Boolean(flags & 0x01), Boolean(flags & 0x02)),
            right: readTelemetrySide(data, payloadOffset + 32,
                data.getUint8(payloadOffset + 5),
                data.getInt8(payloadOffset + 7),
                Boolean(flags & 0x04), Boolean(flags & 0x08)),
            sequence: data.getUint32(payloadOffset + 56, true),
            firmwareVersion: versionComponents && versionComponents.some(Boolean) ?
                versionComponents.join('.') : null,
        };
    }

    function renderFirmwareVersion(version) {
        const text = version ? `固件 v${version}` : '固件 v--';
        if (firmwareVersion.textContent !== text) firmwareVersion.textContent = text;
    }

    function formatSensorValue(value) {
        return Number(value).toLocaleString('zh-CN');
    }

    function formatSensitivity(value) {
        const numericValue = Number(value);
        return numericValue > 0 ? `+${numericValue}` : `${numericValue}`;
    }

    function setSensitivityStatus(sideName, text, state = '') {
        const status = sensorCardElements[sideName].sensitivityStatus;
        status.textContent = text;
        status.classList.remove('saving', 'saved', 'error');
        if (state) status.classList.add(state);
    }

    function refreshSensitivityControls() {
        const enabled = Boolean(hidDevice && hidDevice.opened) &&
            !otaUploadActive && !sensorSensitivityWriteInProgress &&
            sensorTelemetrySupported &&
            latestSensorSensitivity.left !== null &&
            latestSensorSensitivity.right !== null;
        sensorCardElements.left.sensitivityInput.disabled = !enabled;
        sensorCardElements.right.sensitivityInput.disabled = !enabled;
    }

    function clearSensitivityConfirmation(sideName) {
        if (sensorSensitivityConfirmTimer[sideName] !== null) {
            clearTimeout(sensorSensitivityConfirmTimer[sideName]);
            sensorSensitivityConfirmTimer[sideName] = null;
        }
    }

    function waitForSensitivityConfirmation(sideName, sensitivity) {
        clearSensitivityConfirmation(sideName);
        pendingSensorSensitivity[sideName] = sensitivity;
        sensorSensitivityConfirmTimer[sideName] = setTimeout(() => {
            if (pendingSensorSensitivity[sideName] !== sensitivity) return;
            pendingSensorSensitivity[sideName] = null;
            const elements = sensorCardElements[sideName];
            if (latestSensorSensitivity[sideName] !== null) {
                elements.sensitivityInput.value = latestSensorSensitivity[sideName];
                elements.sensitivity.textContent =
                    formatSensitivity(latestSensorSensitivity[sideName]);
            }
            setSensitivityStatus(sideName, '控制器未确认，请重试', 'error');
            refreshSensitivityControls();
        }, SENSOR_SENSITIVITY_CONFIRM_TIMEOUT_MS);
    }

    async function writeSensorSensitivity(sideName) {
        if (!hidDevice || !hidDevice.opened || otaUploadActive ||
            sensorSensitivityWriteInProgress) return;
        const deviceDefinition = findDeviceDefinition(hidDevice);
        if (!deviceDefinition) return;

        const left = Math.max(SENSOR_SENSITIVITY_MINIMUM,
            Math.min(SENSOR_SENSITIVITY_MAXIMUM,
                Number(sensorCardElements.left.sensitivityInput.value)));
        const right = Math.max(SENSOR_SENSITIVITY_MINIMUM,
            Math.min(SENSOR_SENSITIVITY_MAXIMUM,
                Number(sensorCardElements.right.sensitivityInput.value)));
        const requested = sideName === 'left' ? left : right;
        const report = new Uint8Array(63);
        report[0] = WEB_SENSITIVITY_COMMAND;
        report[1] = WEB_SENSITIVITY_MAGIC[0];
        report[2] = WEB_SENSITIVITY_MAGIC[1];
        report[3] = WEB_SENSITIVITY_PROTOCOL_VERSION;
        report[4] = left & 0xff;
        report[5] = right & 0xff;

        sensorSensitivityWriteInProgress = true;
        setSensitivityStatus(sideName, '正在保存…', 'saving');
        refreshSensitivityControls();
        try {
            await hidDevice.sendReport(deviceDefinition.outputReportId, report);
            waitForSensitivityConfirmation(sideName, requested);
            setSensitivityStatus(sideName, '等待控制器确认…', 'saving');
        } catch (error) {
            pendingSensorSensitivity[sideName] = null;
            setSensitivityStatus(sideName, '写入失败，请重试', 'error');
            const previous = latestSensorSensitivity[sideName];
            if (previous !== null) {
                sensorCardElements[sideName].sensitivityInput.value = previous;
                sensorCardElements[sideName].sensitivity.textContent =
                    formatSensitivity(previous);
            }
        } finally {
            sensorSensitivityWriteInProgress = false;
            refreshSensitivityControls();
        }
    }

    function renderSensorSide(sideName, telemetry) {
        const elements = sensorCardElements[sideName];
        latestSensorSensitivity[sideName] = telemetry.sensitivity;
        if (pendingSensorSensitivity[sideName] === telemetry.sensitivity) {
            pendingSensorSensitivity[sideName] = null;
            clearSensitivityConfirmation(sideName);
            setSensitivityStatus(sideName, '已同步到控制器', 'saved');
        }
        if (document.activeElement !== elements.sensitivityInput &&
            pendingSensorSensitivity[sideName] === null) {
            elements.sensitivityInput.value = telemetry.sensitivity;
            elements.sensitivity.textContent =
                formatSensitivity(telemetry.sensitivity);
            if (!elements.sensitivityStatus.classList.contains('saved') &&
                !elements.sensitivityStatus.classList.contains('error')) {
                setSensitivityStatus(sideName, '已同步', 'saved');
            }
        }
        const history = sensorHistory[sideName];
        history.push(telemetry.signal);
        if (history.length > SENSOR_TELEMETRY_HISTORY_POINTS) history.shift();

        const maximumValue = Math.max(
            1,
            telemetry.pressThreshold * 1.15,
            telemetry.releaseThreshold * 1.15,
            ...history,
        );
        const chartBottom = SENSOR_CHART_HEIGHT - 5;
        const chartTop = 5;
        const valueToY = value => chartBottom -
            Math.min(maximumValue, value) / maximumValue *
            (chartBottom - chartTop);
        const pointToX = index => history.length <= 1
            ? 0
            : index * SENSOR_CHART_WIDTH / (history.length - 1);
        const points = history.map((value, index) =>
            `${pointToX(index).toFixed(1)},${valueToY(value).toFixed(1)}`
        );
        const signalPath = points.length > 0 ? `M${points.join(' L')}` : '';
        const areaPath = points.length > 0
            ? `M${pointToX(0).toFixed(1)},${chartBottom} L${points.join(' L')} ` +
              `L${pointToX(history.length - 1).toFixed(1)},${chartBottom} Z`
            : '';

        elements.signalLine.setAttribute('d', signalPath);
        elements.signalArea.setAttribute('d', areaPath);
        const pressY = valueToY(telemetry.pressThreshold).toFixed(1);
        const releaseY = valueToY(telemetry.releaseThreshold).toFixed(1);
        elements.pressLine.setAttribute('y1', pressY);
        elements.pressLine.setAttribute('y2', pressY);
        elements.releaseLine.setAttribute('y1', releaseY);
        elements.releaseLine.setAttribute('y2', releaseY);

        elements.signal.textContent = `信号 ${formatSensorValue(telemetry.signal)}`;
        elements.pressThreshold.textContent =
            `触发 ${formatSensorValue(telemetry.pressThreshold)}`;
        elements.releaseThreshold.textContent =
            `释放 ${formatSensorValue(telemetry.releaseThreshold)}`;
        elements.raw.textContent = formatSensorValue(telemetry.raw);
        elements.filtered.textContent = formatSensorValue(telemetry.filtered);
        elements.baseline.textContent = formatSensorValue(telemetry.baseline);
        elements.card.classList.toggle('pressed', telemetry.pressed);
        elements.chart.setAttribute('aria-label',
            `${sideName === 'left' ? '左' : '右'}侧键信号 ${telemetry.signal}，` +
            `触发阈值 ${telemetry.pressThreshold}，释放阈值 ${telemetry.releaseThreshold}，` +
            `灵敏度 ${telemetry.sensitivity}`);
        refreshSensitivityControls();
    }

    function resetSensorMonitor() {
        for (const sideName of ['left', 'right']) {
            sensorHistory[sideName].length = 0;
            latestSensorSensitivity[sideName] = null;
            pendingSensorSensitivity[sideName] = null;
            clearSensitivityConfirmation(sideName);
            const elements = sensorCardElements[sideName];
            elements.signalLine.setAttribute('d', '');
            elements.signalArea.setAttribute('d', '');
            elements.card.classList.remove('pressed');
            elements.signal.textContent = '信号 --';
            elements.pressThreshold.textContent = '触发 --';
            elements.releaseThreshold.textContent = '释放 --';
            elements.sensitivity.textContent = '--';
            elements.sensitivityInput.value = 0;
            elements.sensitivityInput.disabled = true;
            setSensitivityStatus(sideName, '等待控制器');
            elements.raw.textContent = '--';
            elements.filtered.textContent = '--';
            elements.baseline.textContent = '--';
        }
    }

    function stopSensorTelemetry() {
        sensorTelemetryGeneration++;
        if (sensorTelemetryTimer !== null) clearTimeout(sensorTelemetryTimer);
        sensorTelemetryTimer = null;
        sensorTelemetrySupported = false;
        mainContent.classList.remove('sensor-monitoring');
        resetSensorMonitor();
    }

    function scheduleSensorTelemetryPoll(generation, delayMs) {
        if (generation !== sensorTelemetryGeneration) return;
        sensorTelemetryTimer = setTimeout(
            () => pollSensorTelemetry(generation), delayMs);
    }

    async function pollSensorTelemetry(generation) {
        if (generation !== sensorTelemetryGeneration ||
            !hidDevice || !hidDevice.opened) return;
        if (otaUploadActive) {
            refreshSensitivityControls();
            scheduleSensorTelemetryPoll(generation, 200);
            return;
        }

        const deviceDefinition = findDeviceDefinition(hidDevice);
        if (!deviceDefinition || typeof hidDevice.receiveFeatureReport !== 'function') {
            sensorTelemetrySupported = false;
            for (const sideName of ['left', 'right']) {
                setSensitivityStatus(sideName, '当前固件不支持调节', 'error');
            }
            refreshSensitivityControls();
            return;
        }

        try {
            const data = await hidDevice.receiveFeatureReport(
                deviceDefinition.sensorFeatureReportId);
            if (generation !== sensorTelemetryGeneration) return;
            const telemetry = decodeSensorTelemetry(data);
            sensorTelemetrySupported = true;
            renderFirmwareVersion(telemetry.firmwareVersion);
            renderSensorSide('left', telemetry.left);
            renderSensorSide('right', telemetry.right);
            scheduleSensorTelemetryPoll(generation,
                SENSOR_TELEMETRY_POLL_INTERVAL_MS);
        } catch (error) {
            if (generation !== sensorTelemetryGeneration) return;
            sensorTelemetrySupported = false;
            for (const sideName of ['left', 'right']) {
                setSensitivityStatus(sideName, '当前固件不支持调节', 'error');
            }
            refreshSensitivityControls();
        }
    }

    function startSensorTelemetry() {
        stopSensorTelemetry();
        mainContent.classList.add('sensor-monitoring');
        const generation = sensorTelemetryGeneration;
        pollSensorTelemetry(generation);
    }
    
    /**
     * Handles the click event on the connect button.
     */
    async function handleConnect() {
        try {
            const filters = USB_DEVICE_DEFINITIONS.map(({
                vendorId,
                productId,
                usagePage,
                usage,
            }) => ({ vendorId, productId, usagePage, usage }));
            const devices = await navigator.hid.requestDevice({ filters });
            if (devices.length === 0) {
                showCustomAlert('喵喵喵? 没有找到设备哦~');
                return;
            }

            const selectedDevice = devices.find(device => findDeviceDefinition(device));
            const deviceDefinition = selectedDevice ? findDeviceDefinition(selectedDevice) : null;
            if (!selectedDevice || !deviceDefinition) {
                showCustomAlert('选中的设备没有兼容的PGEKI HID接口。');
                return;
            }

            hidDevice = selectedDevice;
            if (!hidDevice.opened) {
                await hidDevice.open();
            }
            connectedUsbMode = deviceDefinition.mode;
            setSelectedUsbMode(connectedUsbMode);
            
            // Update button to show connected state
            setConnectButtonState(true);

            //console.log('Connected to HID device:', hidDevice);
            //console.log('设备集合(Collections):', hidDevice.collections, '喵~ 这是调试的关键信息哦！');
            
            // Start listening for input reports from the device
            hidDevice.addEventListener("inputreport", handleInputReport);
            startSensorTelemetry();
            //console.log('现在开始监听设备按键回报了喵~');
            
            // Listen for the device to be disconnected
            navigator.hid.addEventListener('disconnect', (e) => {
                if (e.device === hidDevice) {
                    cancelOtaWaiter(new Error('设备已断开连接'));
                    stopSensorTelemetry();
                    //console.log('设备已断开连接喵！');
                    hidDevice = null;
                    connectedUsbMode = null;
                    renderFirmwareVersion(null);
                    updateButtonStates(Array(10).fill(false));
                    setConnectButtonState(false);
                }
            });

        } catch (error) {
            //console.error('连接HID设备时出错了喵:', error);
            showCustomAlert('连接失败了喵');
        }
    }

    function findDeviceDefinition(device) {
        return USB_DEVICE_DEFINITIONS.find(({ vendorId, productId, usagePage, usage }) => {
            if (device.vendorId !== vendorId || device.productId !== productId) {
                return false;
            }
            return !device.collections || device.collections.length === 0 ||
                device.collections.some(collection =>
                    collection.usagePage === usagePage && collection.usage === usage
                );
        });
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

    function setSelectedUsbMode(mode) {
        const normalizedMode = mode === USB_MODES.IO4 ? USB_MODES.IO4 : USB_MODES.RAW_IO;
        usbModeSelect.value = normalizedMode.toString();
        localStorage.setItem('pgeki-usb-mode', normalizedMode.toString());
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
        if (device !== hidDevice) return;

        const deviceDefinition = findDeviceDefinition(device);
        if (!deviceDefinition || reportId !== deviceDefinition.inputReportId) return;

        const otaStatus = decodeWebOtaStatus(data);
        if (otaStatus) {
            handleWebOtaStatus(otaStatus);
            return;
        }

        const buttonStates = deviceDefinition.mode === USB_MODES.IO4
            ? decodeIo4ButtonStates(data)
            : decodeRawButtonStates(data);
        if (!buttonStates) return;
        updateButtonStates(buttonStates);
    }

    function decodeWebOtaStatus(data) {
        if (data.byteLength < 15 ||
            data.getUint8(0) !== WEB_OTA_STATUS_MAGIC[0] ||
            data.getUint8(1) !== WEB_OTA_STATUS_MAGIC[1]) {
            return null;
        }
        return {
            command: data.getUint8(2),
            status: data.getUint8(3),
            sequence: data.getUint16(4, true),
            receivedBytes: data.getUint32(6, true),
            expectedBytes: data.getUint32(10, true),
            protocolVersion: data.getUint8(14),
        };
    }

    function handleWebOtaStatus(status) {
        if (!otaAckWaiter || status.command !== otaAckWaiter.command) return;
        if (status.protocolVersion !== WEB_OTA_PROTOCOL_VERSION) {
            const waiter = otaAckWaiter;
            otaAckWaiter = null;
            clearTimeout(waiter.timeoutId);
            const error = new Error('网页与设备的OTA协议版本不兼容');
            error.retryable = false;
            waiter.reject(error);
            return;
        }
        if (status.command === WEB_OTA_COMMANDS.DATA &&
            status.status === WEB_OTA_STATUS_OK &&
            status.sequence !== otaAckWaiter.sequence) return;

        const waiter = otaAckWaiter;
        otaAckWaiter = null;
        clearTimeout(waiter.timeoutId);
        if (status.status === WEB_OTA_STATUS_OK ||
            status.status === WEB_OTA_STATUS_COMPLETE) {
            waiter.resolve(status);
        } else {
            const error = new Error(webOtaStatusMessage(status));
            error.retryable = status.status === 0x88;
            waiter.reject(error);
        }
    }

    function webOtaStatusMessage(status) {
        const messages = {
            0x80: '设备当前不能开始该操作',
            0x81: '固件大小或数据长度无效',
            0x82: `数据包顺序错误，设备期望 ${status.sequence}`,
            0x83: '设备无法初始化OTA分区',
            0x84: '设备写入Flash失败',
            0x85: '固件镜像校验失败',
            0x86: '设备无法设置启动分区',
            0x87: '传输超时，设备已取消更新',
            0x88: '设备正忙，请重试',
            0x89: '网页与设备的OTA协议版本不兼容',
        };
        return messages[status.status] || `设备返回错误 0x${status.status.toString(16).padStart(2, '0')}`;
    }

    function cancelOtaWaiter(error) {
        if (!otaAckWaiter) return;
        const waiter = otaAckWaiter;
        otaAckWaiter = null;
        clearTimeout(waiter.timeoutId);
        waiter.reject(error);
    }

    async function exchangeWebOtaReport(report, command, sequence, timeoutMs, retryCount = 2) {
        const deviceDefinition = hidDevice ? findDeviceDefinition(hidDevice) : null;
        if (!hidDevice || !hidDevice.opened || !deviceDefinition) {
            throw new Error('设备未连接');
        }

        let lastError = null;
        for (let attempt = 0; attempt <= retryCount; attempt++) {
            const responsePromise = new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    if (otaAckWaiter && otaAckWaiter.timeoutId === timeoutId) {
                        otaAckWaiter = null;
                    }
                    const error = new Error('等待设备响应超时');
                    error.retryable = true;
                    reject(error);
                }, timeoutMs);
                otaAckWaiter = { command, sequence, resolve, reject, timeoutId };
            });

            try {
                await hidDevice.sendReport(deviceDefinition.outputReportId, report);
                return await responsePromise;
            } catch (error) {
                lastError = error;
                cancelOtaWaiter(error);
                await responsePromise.catch(() => {});
                if (!hidDevice || !hidDevice.opened ||
                    error.retryable === false || attempt === retryCount) break;
            }
        }
        throw lastError || new Error('设备通信失败');
    }

    function setUint32LittleEndian(target, offset, value) {
        target[offset] = value & 0xff;
        target[offset + 1] = (value >>> 8) & 0xff;
        target[offset + 2] = (value >>> 16) & 0xff;
        target[offset + 3] = (value >>> 24) & 0xff;
    }

    function createWebOtaReport(command) {
        const report = new Uint8Array(63);
        report[0] = command;
        report[1] = WEB_OTA_COMMAND_MAGIC[0];
        report[2] = WEB_OTA_COMMAND_MAGIC[1];
        return report;
    }

    function parseFirmwareVersion(version) {
        const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
        return match ? match.slice(1).map(Number) : null;
    }

    function compareFirmwareVersions(left, right) {
        for (let index = 0; index < 3; index++) {
            if (left[index] !== right[index]) return left[index] - right[index];
        }
        return 0;
    }

    function getFirmwareAssetBaseUrl() {
        const pageDirectory = new URL('.', window.location.href);
        return pageDirectory.pathname.endsWith('/min/')
            ? new URL('../firmware/', pageDirectory)
            : new URL('./firmware/', pageDirectory);
    }

    function resolveFirmwareAssetUrl(path) {
        if (typeof path !== 'string' || !path || path.includes('\\') ||
            path.startsWith('/') || path.split('/').includes('..')) {
            throw new Error('固件目录包含无效路径');
        }
        const baseUrl = getFirmwareAssetBaseUrl();
        const assetUrl = new URL(path, baseUrl);
        if (!assetUrl.href.startsWith(baseUrl.href)) {
            throw new Error('固件目录包含越界路径');
        }
        return assetUrl.href;
    }

    function formatFirmwareSize(size) {
        return `${(size / 1024).toFixed(size >= 1024 * 1024 ? 1 : 0)} KiB`;
    }

    function validateFirmwareCatalogEntry(entry) {
        const versionParts = entry && parseFirmwareVersion(entry.version);
        if (!versionParts || compareFirmwareVersions(
            versionParts, FIRMWARE_CATALOG_MINIMUM_VERSION) < 0) return null;
        if (!Number.isInteger(entry.size) || entry.size <= 0 ||
            entry.size > WEB_OTA_MAXIMUM_IMAGE_SIZE ||
            !/^[0-9a-f]{64}$/i.test(entry.sha256 || '')) return null;
        let url;
        try {
            url = resolveFirmwareAssetUrl(entry.path);
        } catch (_) {
            return null;
        }
        return {
            version: entry.version,
            versionParts,
            name: typeof entry.name === 'string' && entry.name ? entry.name : 'PGEKI2',
            notes: typeof entry.notes === 'string' ? entry.notes : '',
            size: entry.size,
            sha256: entry.sha256.toLowerCase(),
            url,
        };
    }

    function updateFirmwareReleaseInfo() {
        const release = firmwareCatalogEntries.find(
            entry => entry.version === firmwareReleaseSelect.value);
        if (!release) {
            firmwareReleaseInfo.textContent = firmwareCatalogEntries.length
                ? '请选择一个仓库固件版本，或上传本地 .bin 文件。'
                : '仓库固件暂不可用，仍可选择本地 .bin 文件。';
            return;
        }
        const notes = release.notes ? ` · ${release.notes}` : '';
        firmwareReleaseInfo.textContent =
            `${release.name} v${release.version} · ${formatFirmwareSize(release.size)}${notes}`;
    }

    function renderFirmwareCatalog(entries) {
        firmwareCatalogEntries = entries;
        firmwareReleaseSelect.replaceChildren();
        if (!entries.length) {
            firmwareReleaseSelect.append(new Option('没有可用的仓库固件', ''));
            firmwareReleaseSelect.disabled = true;
            updateFirmwareReleaseInfo();
            return;
        }
        for (const entry of entries) {
            firmwareReleaseSelect.append(new Option(
                `${entry.name} v${entry.version}`, entry.version));
        }
        const hasLocalFile = Boolean(firmwareFileInput.files[0]);
        firmwareReleaseSelect.disabled = otaUploadActive;
        firmwareReleaseSelect.value = hasLocalFile ? '' : entries[0].version;
        updateFirmwareReleaseInfo();
        if (!hasLocalFile) {
            firmwareUpdateStatus.textContent = `已选择仓库固件 v${entries[0].version}。`;
        }
    }

    async function loadFirmwareCatalog() {
        if (firmwareCatalogLoadPromise) return firmwareCatalogLoadPromise;
        firmwareCatalogLoadPromise = (async () => {
            firmwareReleaseSelect.disabled = true;
            try {
                const manifestUrl = new URL('manifest.json', getFirmwareAssetBaseUrl());
                const response = await fetch(manifestUrl, { cache: 'no-store' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const manifest = await response.json();
                if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.firmware)) {
                    throw new Error('固件目录格式不受支持');
                }
                const entries = manifest.firmware
                    .map(validateFirmwareCatalogEntry)
                    .filter(Boolean)
                    .sort((left, right) =>
                        compareFirmwareVersions(right.versionParts, left.versionParts));
                renderFirmwareCatalog(entries);
            } catch (error) {
                renderFirmwareCatalog([]);
                firmwareReleaseInfo.textContent = `读取仓库固件失败：${error.message}`;
                firmwareCatalogLoadPromise = null;
            }
        })();
        return firmwareCatalogLoadPromise;
    }

    function validateFirmwareImage(firmware) {
        if (!firmware.length || firmware.length > WEB_OTA_MAXIMUM_IMAGE_SIZE) {
            throw new Error('固件大小必须在1字节到2 MiB之间');
        }
        if (firmware[0] !== 0xE9) throw new Error('文件不是有效的ESP应用固件');
    }

    async function sha256Hex(bytes) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error('当前浏览器不支持仓库固件完整性校验');
        }
        const digest = await window.crypto.subtle.digest('SHA-256', bytes);
        return Array.from(new Uint8Array(digest), value =>
            value.toString(16).padStart(2, '0')).join('');
    }

    async function readSelectedFirmware() {
        const localFile = firmwareFileInput.files[0];
        if (localFile) {
            if (!/\.bin$/i.test(localFile.name)) throw new Error('本地固件必须是 .bin 文件');
            firmwareUpdateStatus.textContent = `正在读取 ${localFile.name}…`;
            const firmware = new Uint8Array(await localFile.arrayBuffer());
            validateFirmwareImage(firmware);
            return firmware;
        }

        const release = firmwareCatalogEntries.find(
            entry => entry.version === firmwareReleaseSelect.value);
        if (!release) throw new Error('请先选择仓库版本或本地固件文件');
        firmwareUpdateStatus.textContent = `正在下载仓库固件 v${release.version}…`;
        const response = await fetch(release.url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`下载固件失败：HTTP ${response.status}`);
        const firmware = new Uint8Array(await response.arrayBuffer());
        if (firmware.length !== release.size) throw new Error('仓库固件大小校验失败');
        validateFirmwareImage(firmware);
        firmwareUpdateStatus.textContent = `正在校验仓库固件 v${release.version}…`;
        if (await sha256Hex(firmware) !== release.sha256) {
            throw new Error('仓库固件SHA-256校验失败');
        }
        return firmware;
    }

    async function abortWebOta() {
        if (!hidDevice || !hidDevice.opened) return;
        const deviceDefinition = findDeviceDefinition(hidDevice);
        if (!deviceDefinition) return;
        const report = createWebOtaReport(WEB_OTA_COMMANDS.ABORT);
        try {
            await hidDevice.sendReport(deviceDefinition.outputReportId, report);
        } catch (_) {
            // The device may already be restarting or disconnected.
        }
    }

    function setOtaControlsBusy(isBusy) {
        otaUploadActive = isBusy;
        firmwareReleaseSelect.disabled = isBusy || !firmwareCatalogEntries.length;
        firmwareFileInput.disabled = isBusy;
        firmwareUploadBtn.disabled = isBusy;
        firmwareUpdateCloseBtn.style.visibility = isBusy ? 'hidden' : 'visible';
        refreshSensitivityControls();
    }

    async function handleFirmwareUpload() {
        if (!hidDevice || !hidDevice.opened) {
            firmwareUpdateStatus.textContent = '请先点击右上角连接设备，再开始USB更新。';
            return;
        }
        setOtaControlsBusy(true);
        firmwareUpdateProgress.value = 0;
        let transferStarted = false;
        try {
            const firmware = await readSelectedFirmware();
            const beginReport = createWebOtaReport(WEB_OTA_COMMANDS.BEGIN);
            beginReport[3] = WEB_OTA_PROTOCOL_VERSION;
            setUint32LittleEndian(beginReport, 4, firmware.length);
            firmwareUpdateStatus.textContent = '正在准备设备OTA分区…';
            await exchangeWebOtaReport(beginReport, WEB_OTA_COMMANDS.BEGIN, 0, 10000);
            transferStarted = true;

            let sequence = 0;
            let lastPercent = -1;
            for (let offset = 0; offset < firmware.length; offset += WEB_OTA_DATA_SIZE) {
                const chunk = firmware.subarray(offset, offset + WEB_OTA_DATA_SIZE);
                const dataReport = createWebOtaReport(WEB_OTA_COMMANDS.DATA);
                dataReport[3] = sequence & 0xff;
                dataReport[4] = (sequence >>> 8) & 0xff;
                dataReport[5] = chunk.length;
                dataReport.set(chunk, 6);
                await exchangeWebOtaReport(dataReport, WEB_OTA_COMMANDS.DATA,
                    sequence, 5000);
                sequence++;

                const sent = Math.min(offset + chunk.length, firmware.length);
                const percent = Math.round(sent * 100 / firmware.length);
                if (percent !== lastPercent) {
                    lastPercent = percent;
                    firmwareUpdateProgress.value = percent;
                    firmwareUpdateStatus.textContent = `正在传输固件… ${percent}%`;
                }
            }

            const endReport = createWebOtaReport(WEB_OTA_COMMANDS.END);
            firmwareUpdateStatus.textContent = '正在校验固件，请勿断电…';
            await exchangeWebOtaReport(endReport, WEB_OTA_COMMANDS.END, 0, 30000, 0);
            transferStarted = false;
            firmwareUpdateProgress.value = 100;
            firmwareUpdateStatus.textContent = '更新成功，设备正在重启。';
        } catch (error) {
            firmwareUpdateProgress.value = 0;
            firmwareUpdateStatus.textContent = `更新失败：${error.message}`;
            if (transferStarted) await abortWebOta();
        } finally {
            setOtaControlsBusy(false);
        }
    }

    function decodeRawButtonStates(data) {
        if (data.byteLength < 10) return null;
        return Array.from({ length: 10 }, (_, index) => data.getUint8(index) !== 0);
    }

    function decodeIo4ButtonStates(data) {
        // WebHID exposes reportId separately, so the two button banks begin at
        // byte offsets 28 and 30 in the remaining 63-byte IO4 payload.
        if (data.byteLength < 32) return null;
        const buttons0 = data.getUint16(28, true);
        const buttons1 = data.getUint16(30, true);
        const isSet = (value, bit) => (value & (1 << bit)) !== 0;

        return [
            isSet(buttons0, 0),
            isSet(buttons0, 5),
            isSet(buttons0, 4),
            !isSet(buttons1, 15),
            isSet(buttons1, 14),
            isSet(buttons0, 1),
            isSet(buttons1, 0),
            isSet(buttons0, 15),
            !isSet(buttons0, 14),
            isSet(buttons0, 13),
        ];
    }

    function updateButtonStates(buttonStates) {
        buttonStates.forEach((isPressed, buttonIndex) => {
            const keyId = buttonIndexToKeyId[buttonIndex];
            const keyElement = document.querySelector(`.key[data-key-id="${keyId}"]`);
            if (!keyElement) return;
            keyElement.classList.toggle('pressed', Boolean(isPressed));
        });
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
        //console.log(`切换到配置文件 ${profileIndex + 1} 喵~`);
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
        //console.log('当前配置文件的灯光已在本地重置喵~');
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
        //console.log('当前配置文件的所有按键已在本地重置喵~');
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
        //console.log('当前配置文件已重置喵~');
    }
    /**
     * Builds a 63-byte WebHID configuration packet and sends it to the device.
     */
    async function handleUploadProfile() {
        if (!hidDevice) {
            showCustomAlert('设备还没连接呢~ 请先连接设备哦！(＞д＜)');
            return;
        }

        showCustomAlert('正在写入配置文件... 请稍候哦~ ( V.v)V'); // Show pending status

        // A short delay to allow the pending message to render before potential blocking operation
        await new Promise(resolve => setTimeout(resolve, 50));

        const deviceDefinition = USB_DEVICE_DEFINITIONS.find(({ vendorId, productId }) =>
            hidDevice.vendorId === vendorId && hidDevice.productId === productId
        );
        if (!deviceDefinition) {
            showCustomAlert('当前连接的设备型号不受支持。');
            return;
        }

        const targetUsbMode = Number(usbModeSelect.value) === USB_MODES.IO4
            ? USB_MODES.IO4
            : USB_MODES.RAW_IO;
        const reportId = deviceDefinition.outputReportId;
        const data = new Uint8Array(63);
        const currentConfig = profiles[currentProfile];
        data[0] = WEB_CONFIG_COMMAND;
        data[1] = currentProfile;
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
        data[43] = targetUsbMode;

        // --- 调试日志 ---
        //console.log('--- 准备发送HID报告 ---');
        //console.log(`目标设备喵:`, hidDevice.productName);
        //console.log(`使用的 Report ID: ${reportId}`);
        //console.log(`数据包 (Uint8Array, 长度: ${data.length} bytes):`, data);
        //console.log(`数据包内容 (Hex): ${Array.from(data).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')}`);
        //console.log('------------------------');

        try {
            await hidDevice.sendReport(reportId, data);
            setSelectedUsbMode(targetUsbMode);
            if (targetUsbMode !== connectedUsbMode) {
                showCustomAlert('配置已写入，设备将切换USB模式并重启。请等待设备重新出现后再次连接。');
            } else {
                showCustomAlert(`配置文件 ${currentProfile + 1} 已成功写入！🎉`);
            }
        } catch (error) {
            //console.error('配置文件写入失败了喵:', error);
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
        //console.log(`配置文件 ${currentProfile + 1} 已保存到文件喵~`);
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
                //console.error('解析配置文件失败了喵:', error);
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
        //console.log(`接管IO灯光状态已更新为: ${ioLightOverrideSwitch.checked} 喵~`);
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
            //console.log('取消按键录制喵~');
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
                //console.log(`录制到按键: ${newKeySelection.keyDisplay} (码: 0x${hidCode.toString(16)}) 喵~`);
            } else {
                newKeySelection = null; // Invalidate selection if key is not mapped
                currentKeyDisplay.textContent = '未映射 :(';
                 //console.log(`录制到未映射的按键: ${event.code} 喵~`);
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
    firmwareUpdateBtn.addEventListener('click', () => {
        firmwareUpdateModal.style.display = 'flex';
        loadFirmwareCatalog();
    });
    firmwareUpdateCloseBtn.addEventListener('click', () => {
        if (!otaUploadActive) firmwareUpdateModal.style.display = 'none';
    });
    firmwareUploadBtn.addEventListener('click', handleFirmwareUpload);
    firmwareReleaseSelect.addEventListener('change', () => {
        if (firmwareReleaseSelect.value) firmwareFileInput.value = '';
        updateFirmwareReleaseInfo();
        if (firmwareReleaseSelect.value) {
            firmwareUpdateStatus.textContent =
                `已选择仓库固件 v${firmwareReleaseSelect.value}。`;
        }
    });
    firmwareFileInput.addEventListener('change', () => {
        if (!firmwareFileInput.files[0]) return;
        firmwareReleaseSelect.value = '';
        updateFirmwareReleaseInfo();
        firmwareUpdateStatus.textContent = `已选择本地固件 ${firmwareFileInput.files[0].name}。`;
    });
    ioLightOverrideSwitch.addEventListener('change', handleIoLightSwitchChange);
    usbModeSelect.addEventListener('change', () => setSelectedUsbMode(Number(usbModeSelect.value)));
    for (const sideName of ['left', 'right']) {
        const elements = sensorCardElements[sideName];
        elements.sensitivityInput.addEventListener('input', () => {
            elements.sensitivity.textContent =
                formatSensitivity(elements.sensitivityInput.value);
            setSensitivityStatus(sideName, '');
        });
        elements.sensitivityInput.addEventListener('change', () => {
            writeSensorSensitivity(sideName);
        });
    }
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
        if (event.target === firmwareUpdateModal && !otaUploadActive) {
            firmwareUpdateModal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            if (keycodeListModal.style.display !== 'none') {
                keycodeListModal.style.display = 'none';
            } else if (firmwareUpdateModal.style.display !== 'none' && !otaUploadActive) {
                firmwareUpdateModal.style.display = 'none';
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
                //console.log('这个小按键在IO模式下是禁用的哦喵~');
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
    setSelectedUsbMode(Number(localStorage.getItem('pgeki-usb-mode')));
    switchProfile(0); // Activate the first profile by default
});
