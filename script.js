document.addEventListener('DOMContentLoaded', () => {
    const LANGUAGE_STORAGE_KEY = 'pgeki-language';
    const TRANSLATIONS = Object.freeze({
        'zh-CN': Object.freeze({
            'common.none': '无',
            'common.close': '关闭',
            'common.ok': '知道了喵!',
            'common.confirm': '确定',
            'common.cancel': '取消',
            'language.switchToEn': '当前为简体中文，点击切换到 English',
            'language.switchToZh': '当前为 English，点击切换到简体中文',
            'sidebar.toolbox': '工具箱',
            'sidebar.keycodes': '📖查看键码',
            'sidebar.resetLights': '✨重置灯光',
            'sidebar.resetKeys': '⌨️重置按键',
            'sidebar.resetAll': '💥重置全部',
            'sidebar.ioSettings': 'IO设置',
            'sidebar.ioLightOverride': '接管IO灯光',
            'sidebar.deviceCommunication': '设备通信',
            'sidebar.usbMode': 'USB模式',
            'sidebar.usbModeTitle': '选择写入后使用的USB通信模式',
            'sidebar.rawIo': '原始IO（兼容）',
            'sidebar.io4': 'IO4（实验）',
            'sidebar.usbModeHint': '切换模式会在写入配置后重启设备，请重新连接。',
            'sidebar.firmwareMaintenance': '固件维护',
            'sidebar.firmwareUpdate': '⬆️固件更新',
            'sidebar.firmwareHint': '可通过当前USB连接直接更新，也可进入OTA模式后使用板载页面。',
            'sidebar.otherSettings': '其他设置',
            'sidebar.saveConfig': '💾保存配置',
            'sidebar.loadConfig': '📁载入配置',
            'sidebar.loadConfigTitle': '载入配置',
            'header.firmwareVersion': '固件 v{version}',
            'header.firmwareVersionTitle': '控制器当前运行的固件版本',
            'header.connect': '点我连接设备喵',
            'header.write': '点我写入配置 ✅',
            'connection.title': '选择连接方式',
            'connection.bluetooth': '蓝牙',
            'connection.usb': 'USB',
            'sensor.sensitivity': '灵敏度',
            'sensor.moreSensitive': '更灵敏',
            'sensor.moreStable': '更稳',
            'sensor.waiting': '等待控制器',
            'sensor.leftChartLabel': '左侧键实时传感信号图表',
            'sensor.rightChartLabel': '右侧键实时传感信号图表',
            'sensor.signal': '信号 {value}',
            'sensor.press': '触发 {value}',
            'sensor.release': '释放 {value}',
            'sensor.signalEmpty': '信号 --',
            'sensor.pressEmpty': '触发 --',
            'sensor.releaseEmpty': '释放 --',
            'sensor.raw': '原始',
            'sensor.filtered': '滤波',
            'sensor.baseline': '自适应基线',
            'sensor.chartStatusLeft': '左侧键信号 {signal}，触发阈值 {press}，释放阈值 {release}，灵敏度 {sensitivity}',
            'sensor.chartStatusRight': '右侧键信号 {signal}，触发阈值 {press}，释放阈值 {release}，灵敏度 {sensitivity}',
            'sensor.notConfirmed': '控制器未确认，请重试',
            'sensor.saving': '正在保存…',
            'sensor.waitingConfirmation': '等待控制器确认…',
            'sensor.writeFailed': '写入失败，请重试',
            'sensor.syncedController': '已同步到控制器',
            'sensor.synced': '已同步',
            'sensor.unsupported': '当前固件不支持调节',
            'lever.waiting': '摇杆：等待控制器',
            'lever.position': '摇杆位置 {value}%',
            'action.title': '动作录制与回放',
            'action.slot': '槽位',
            'action.loop': '循环回放',
            'action.record': '● 录制',
            'action.play': '▶ 回放',
            'action.stop': '■ 停止',
            'action.delete': '删除',
            'action.disconnected': '连接控制器后可用',
            'action.unsupported': '需要固件 1.1.0 或更高版本',
            'action.slotStored': '槽位 {slot} · 已保存',
            'action.slotEmpty': '槽位 {slot} · 空',
            'action.idleEmpty': '槽位 {slot} 尚未录制',
            'action.recording': '正在录制槽位 {slot}…',
            'action.saving': '正在保存到 Flash…',
            'action.loading': '正在从 Flash 载入…',
            'action.playing': '正在回放槽位 {slot}…',
            'action.communicationFailed': '发送失败，请检查控制器连接',
            'action.error.notReady': '录制组件尚未就绪',
            'action.error.protocol': '网页与录制协议不兼容',
            'action.error.invalidSlot': '录制槽位无效',
            'action.error.busy': '录制组件正忙',
            'action.error.noData': '该槽位没有可回放的数据',
            'action.error.noMemory': '控制器内存不足',
            'action.error.overflow': '录制过长或变化过密，已停止',
            'action.error.storage': 'Flash 保存失败',
            'action.error.corrupt': '录制数据校验失败',
            'action.error.unknown': '录制组件返回未知错误',
            'keyConfig.title': '按键配置',
            'keyConfig.color': '颜色:',
            'keyConfig.key': '键位:',
            'keyConfig.startRecording': '开始录制 🔴',
            'keyConfig.recording': '请按键...点击取消',
            'keyConfig.unmapped': '未映射 :(',
            'keyConfig.keycodePlaceholder': '按键键码 例如: 0x04',
            'keyConfig.toggleInputMode': '切换输入模式',
            'keyConfig.save': '保存更改 ✔️',
            'keyConfig.invalidKeycode': '请输入一个有效的键码 (0-255 或 0x00-0xFF) 哦~ ( ´•_•。)',
            'firmware.title': '固件更新',
            'firmware.description': 'USB更新需要先连接设备。可直接选择仓库中的正式固件，传输和校验期间请勿断电。',
            'firmware.repositoryFirmware': '仓库固件',
            'firmware.loadingVersions': '正在读取可用版本…',
            'firmware.loadingCatalog': '正在读取固件目录…',
            'firmware.orLocal': '或选择本地固件',
            'firmware.chooseFirmware': '选择固件',
            'firmware.chooseSource': '请选择仓库版本或本地固件。',
            'firmware.uploadUsb': '通过USB上传',
            'firmware.alternative': '备用方式',
            'firmware.openEmbeddedPage': '打开板载Wi-Fi上传页',
            'firmware.wifiHint': 'Wi-Fi方式：持续按住FUNC上电，等待5秒校准结束并进入OTA模式，连接开放热点PGEKI2后再打开。旧固件首次升级也请使用此方式。',
            'firmware.chooseRepositoryOrLocal': '请选择一个仓库固件版本，或上传本地 .bin 文件。',
            'firmware.repositoryUnavailable': '仓库固件暂不可用，仍可选择本地 .bin 文件。',
            'firmware.noRepositoryFirmware': '没有可用的仓库固件',
            'firmware.selectedRepository': '已选择仓库固件 v{version}。',
            'firmware.catalogLoadFailed': '读取仓库固件失败：{message}',
            'firmware.readingLocal': '正在读取 {name}…',
            'firmware.downloading': '正在下载仓库固件 v{version}…',
            'firmware.verifying': '正在校验仓库固件 v{version}…',
            'firmware.connectFirst': '请先点击右上角连接设备，再开始USB更新。',
            'firmware.preparing': '正在准备设备OTA分区…',
            'firmware.transferring': '正在传输固件… {percent}%',
            'firmware.finalVerifying': '正在校验固件，请勿断电…',
            'firmware.success': '更新成功，设备正在重启。',
            'firmware.failed': '更新失败：{message}',
            'firmware.selectedLocal': '已选择本地固件 {name}。',
            'firmware.error.protocol': '网页与设备的OTA协议版本不兼容',
            'firmware.error.unavailable': '设备当前不能开始该操作',
            'firmware.error.invalidLength': '固件大小或数据长度无效',
            'firmware.error.sequence': '数据包顺序错误，设备期望 {sequence}',
            'firmware.error.partition': '设备无法初始化OTA分区',
            'firmware.error.flash': '设备写入Flash失败',
            'firmware.error.image': '固件镜像校验失败',
            'firmware.error.bootPartition': '设备无法设置启动分区',
            'firmware.error.timeout': '传输超时，设备已取消更新',
            'firmware.error.busy': '设备正忙，请重试',
            'firmware.error.deviceCode': '设备返回错误 0x{code}',
            'firmware.error.disconnected': '设备未连接',
            'firmware.error.responseTimeout': '等待设备响应超时',
            'firmware.error.communication': '设备通信失败',
            'firmware.error.invalidPath': '固件目录包含无效路径',
            'firmware.error.outsidePath': '固件目录包含越界路径',
            'firmware.error.catalogFormat': '固件目录格式不受支持',
            'firmware.error.imageSize': '固件大小必须在1字节到2 MiB之间',
            'firmware.error.invalidImage': '文件不是有效的ESP应用固件',
            'firmware.error.integrityUnsupported': '当前浏览器不支持仓库固件完整性校验',
            'firmware.error.localExtension': '本地固件必须是 .bin 文件',
            'firmware.error.selectSource': '请先选择仓库版本或本地固件文件',
            'firmware.error.download': '下载固件失败：HTTP {status}',
            'firmware.error.sizeMismatch': '仓库固件大小校验失败',
            'firmware.error.shaMismatch': '仓库固件SHA-256校验失败',
            'keycodes.title': 'HID Keycode 列表 📚',
            'keycodes.letters': '字母',
            'keycodes.numbersSymbols': '数字与符号（主键区）',
            'keycodes.functionKeys': '功能键',
            'keycodes.controlNavigation': '控制与导航键',
            'keycodes.modifierKeys': '修饰键',
            'keycodes.numpad': '数字键盘',
            'keycodes.mediaKeys': '媒体键',
            'alert.noDevice': '喵喵喵? 没有找到设备哦~',
            'alert.incompatibleDevice': '选中的设备没有兼容的PGEKI HID接口。',
            'alert.connectFailed': '连接失败了喵',
            'alert.bluetoothUnsupported': '当前浏览器不支持蓝牙连接，请使用支持 Web Bluetooth 的浏览器。',
            'alert.bluetoothConnectFailed': '蓝牙连接失败，请确认控制器已开启并在附近。',
            'alert.hidUnsupported': '当前浏览器不支持 USB HID 连接。',
            'alert.fixedIoKeys': '喵呜！IO模式下的按键是固定的，不能重置哦~ (づ｡◕‿‿◕｡)づ',
            'alert.deviceNotConnected': '设备还没连接呢~ 请先连接设备哦！(＞д＜)',
            'alert.writingProfile': '正在写入配置文件... 请稍候哦~ ( V.v)V',
            'alert.unsupportedDevice': '当前连接的设备型号不受支持。',
            'alert.modeRestart': '配置已写入，设备将切换USB模式并重启。请等待设备重新出现后再次连接。',
            'alert.profileWritten': '配置文件 {profile} 已成功写入！🎉',
            'alert.profileWriteFailed': '配置文件写入失败了喵...〒▽〒\n重启浏览器试试~',
            'alert.profileEmpty': '配置文件 {profile} 是空的，没什么可保存的哦~ (´｡• ᵕ •｡`)',
            'alert.profileLoaded': '配置已成功载入到配置文件 {profile}！开心~ (ﾉ>ω<)ﾉ',
            'alert.invalidProfileFile': '这个文件格式好像不对哦，请选择一个单个配置的文件~ ( ´•_•。)',
            'alert.invalidJson': '呜... 这不是一个有效的JSON配置文件呢... (｡•́︿•̀｡)',
            'alert.fileReadFailed': '读取文件时出错了喵... (｡•́︿•̀｡)',
            'alert.readingConfig': '正在读取配置文件... 请稍候~ (ﾐⓛᆽⓛﾐ)',
            'confirm.resetLights': '确定要重置当前配置文件的所有灯光吗？\n✨ 这个操作是本地的，需要写入手台才会生效哦~',
            'confirm.resetKeys': '确定要重置当前配置文件的所有按键吗？\n⌨️ 这个操作是本地的，需要写入手台才会生效哦~',
            'confirm.resetAll': '确定要重置当前配置文件吗？\n💥 这个操作是本地的，需要写入手台才会生效哦~',
            'confirm.deleteAction': '确定删除动作录制槽位 {slot} 吗？',
            'error.sensorProtocol': '传感遥测协议不兼容',
            'error.deviceDisconnected': '设备已断开连接',
        }),
        en: Object.freeze({
            'common.none': 'None',
            'common.close': 'Close',
            'common.ok': 'Got it!',
            'common.confirm': 'Confirm',
            'common.cancel': 'Cancel',
            'language.switchToEn': 'Language: 简体中文; switch to English',
            'language.switchToZh': 'Language: English; switch to 简体中文',
            'sidebar.toolbox': 'Toolbox',
            'sidebar.keycodes': '📖 Keycodes',
            'sidebar.resetLights': '✨ Reset lights',
            'sidebar.resetKeys': '⌨️ Reset keys',
            'sidebar.resetAll': '💥 Reset all',
            'sidebar.ioSettings': 'IO settings',
            'sidebar.ioLightOverride': 'Override IO lighting',
            'sidebar.deviceCommunication': 'Device communication',
            'sidebar.usbMode': 'USB mode',
            'sidebar.usbModeTitle': 'Select the USB communication mode used after writing',
            'sidebar.rawIo': 'Raw IO (compatible)',
            'sidebar.io4': 'IO4 (experimental)',
            'sidebar.usbModeHint': 'Changing modes restarts the device after writing. Reconnect afterward.',
            'sidebar.firmwareMaintenance': 'Firmware',
            'sidebar.firmwareUpdate': '⬆️ Firmware update',
            'sidebar.firmwareHint': 'Update over the current USB connection or use the embedded page in OTA mode.',
            'sidebar.otherSettings': 'Other settings',
            'sidebar.saveConfig': '💾 Save config',
            'sidebar.loadConfig': '📁 Load config',
            'sidebar.loadConfigTitle': 'Load configuration',
            'header.firmwareVersion': 'Firmware v{version}',
            'header.firmwareVersionTitle': 'Firmware version currently running on the controller',
            'header.connect': 'Connect device',
            'header.write': 'Write configuration ✅',
            'connection.title': 'Choose a connection',
            'connection.bluetooth': 'Bluetooth',
            'connection.usb': 'USB',
            'sensor.sensitivity': 'Sensitivity',
            'sensor.moreSensitive': 'More sensitive',
            'sensor.moreStable': 'More stable',
            'sensor.waiting': 'Waiting for controller',
            'sensor.leftChartLabel': 'Live left side-key sensor chart',
            'sensor.rightChartLabel': 'Live right side-key sensor chart',
            'sensor.signal': 'Signal {value}',
            'sensor.press': 'Press {value}',
            'sensor.release': 'Release {value}',
            'sensor.signalEmpty': 'Signal --',
            'sensor.pressEmpty': 'Press --',
            'sensor.releaseEmpty': 'Release --',
            'sensor.raw': 'Raw',
            'sensor.filtered': 'Filtered',
            'sensor.baseline': 'Adaptive baseline',
            'sensor.chartStatusLeft': 'Left side-key signal {signal}, press threshold {press}, release threshold {release}, sensitivity {sensitivity}',
            'sensor.chartStatusRight': 'Right side-key signal {signal}, press threshold {press}, release threshold {release}, sensitivity {sensitivity}',
            'sensor.notConfirmed': 'Controller did not confirm. Try again.',
            'sensor.saving': 'Saving…',
            'sensor.waitingConfirmation': 'Waiting for controller confirmation…',
            'sensor.writeFailed': 'Write failed. Try again.',
            'sensor.syncedController': 'Synced to controller',
            'sensor.synced': 'Synced',
            'sensor.unsupported': 'This firmware does not support adjustment',
            'lever.waiting': 'Lever: waiting for controller',
            'lever.position': 'Lever position {value}%',
            'action.title': 'Action recording and playback',
            'action.slot': 'Slot',
            'action.loop': 'Loop playback',
            'action.record': '● Record',
            'action.play': '▶ Play',
            'action.stop': '■ Stop',
            'action.delete': 'Delete',
            'action.disconnected': 'Connect a controller to use this feature',
            'action.unsupported': 'Firmware 1.1.0 or later is required',
            'action.slotStored': 'Slot {slot} · saved',
            'action.slotEmpty': 'Slot {slot} · empty',
            'action.idleEmpty': 'Slot {slot} has not been recorded',
            'action.recording': 'Recording slot {slot}…',
            'action.saving': 'Saving to flash…',
            'action.loading': 'Loading from flash…',
            'action.playing': 'Playing slot {slot}…',
            'action.communicationFailed': 'Command failed. Check the controller connection.',
            'action.error.notReady': 'The recorder is not ready',
            'action.error.protocol': 'The web app and recorder protocols are incompatible',
            'action.error.invalidSlot': 'The recording slot is invalid',
            'action.error.busy': 'The recorder is busy',
            'action.error.noData': 'This slot has no recording to play',
            'action.error.noMemory': 'The controller does not have enough memory',
            'action.error.overflow': 'Recording was too long or changed too quickly and was stopped',
            'action.error.storage': 'Could not save the recording to flash',
            'action.error.corrupt': 'The recording failed its integrity check',
            'action.error.unknown': 'The recorder returned an unknown error',
            'keyConfig.title': 'Key configuration',
            'keyConfig.color': 'Color:',
            'keyConfig.key': 'Key:',
            'keyConfig.startRecording': 'Record a key 🔴',
            'keyConfig.recording': 'Press a key… click to cancel',
            'keyConfig.unmapped': 'Unmapped :(',
            'keyConfig.keycodePlaceholder': 'Keycode, for example: 0x04',
            'keyConfig.toggleInputMode': 'Switch input mode',
            'keyConfig.save': 'Save changes ✔️',
            'keyConfig.invalidKeycode': 'Enter a valid keycode (0-255 or 0x00-0xFF).',
            'firmware.title': 'Firmware update',
            'firmware.description': 'Connect the device before updating over USB. Select an official repository build and do not disconnect power during transfer or verification.',
            'firmware.repositoryFirmware': 'Repository firmware',
            'firmware.loadingVersions': 'Loading available versions…',
            'firmware.loadingCatalog': 'Loading firmware catalog…',
            'firmware.orLocal': 'Or choose local firmware',
            'firmware.chooseFirmware': 'Choose firmware',
            'firmware.chooseSource': 'Choose a repository version or local firmware.',
            'firmware.uploadUsb': 'Upload over USB',
            'firmware.alternative': 'Alternative method',
            'firmware.openEmbeddedPage': 'Open embedded Wi-Fi upload page',
            'firmware.wifiHint': 'Wi-Fi method: hold FUNC while powering on, wait for the 5-second calibration and OTA mode, connect to the open PGEKI2 hotspot, then open the page. Use this method for the first upgrade from older firmware.',
            'firmware.chooseRepositoryOrLocal': 'Choose a repository firmware version or upload a local .bin file.',
            'firmware.repositoryUnavailable': 'Repository firmware is unavailable. You can still choose a local .bin file.',
            'firmware.noRepositoryFirmware': 'No repository firmware available',
            'firmware.selectedRepository': 'Selected repository firmware v{version}.',
            'firmware.catalogLoadFailed': 'Failed to load repository firmware: {message}',
            'firmware.readingLocal': 'Reading {name}…',
            'firmware.downloading': 'Downloading repository firmware v{version}…',
            'firmware.verifying': 'Verifying repository firmware v{version}…',
            'firmware.connectFirst': 'Connect the device in the upper-right before starting a USB update.',
            'firmware.preparing': 'Preparing the device OTA partition…',
            'firmware.transferring': 'Transferring firmware… {percent}%',
            'firmware.finalVerifying': 'Verifying firmware. Do not disconnect power…',
            'firmware.success': 'Update complete. The device is restarting.',
            'firmware.failed': 'Update failed: {message}',
            'firmware.selectedLocal': 'Selected local firmware {name}.',
            'firmware.error.protocol': 'The web app and device OTA protocol versions are incompatible',
            'firmware.error.unavailable': 'The device cannot start this operation right now',
            'firmware.error.invalidLength': 'The firmware size or data length is invalid',
            'firmware.error.sequence': 'Packet sequence error; the device expected {sequence}',
            'firmware.error.partition': 'The device could not initialize the OTA partition',
            'firmware.error.flash': 'The device failed to write flash',
            'firmware.error.image': 'Firmware image verification failed',
            'firmware.error.bootPartition': 'The device could not set the boot partition',
            'firmware.error.timeout': 'Transfer timed out and the device cancelled the update',
            'firmware.error.busy': 'The device is busy. Try again.',
            'firmware.error.deviceCode': 'Device returned error 0x{code}',
            'firmware.error.disconnected': 'Device is not connected',
            'firmware.error.responseTimeout': 'Timed out waiting for the device response',
            'firmware.error.communication': 'Device communication failed',
            'firmware.error.invalidPath': 'The firmware catalog contains an invalid path',
            'firmware.error.outsidePath': 'The firmware catalog path escapes its allowed directory',
            'firmware.error.catalogFormat': 'The firmware catalog format is unsupported',
            'firmware.error.imageSize': 'Firmware size must be between 1 byte and 2 MiB',
            'firmware.error.invalidImage': 'The file is not a valid ESP application image',
            'firmware.error.integrityUnsupported': 'This browser cannot verify repository firmware integrity',
            'firmware.error.localExtension': 'Local firmware must be a .bin file',
            'firmware.error.selectSource': 'Select a repository version or local firmware file first',
            'firmware.error.download': 'Firmware download failed: HTTP {status}',
            'firmware.error.sizeMismatch': 'Repository firmware size verification failed',
            'firmware.error.shaMismatch': 'Repository firmware SHA-256 verification failed',
            'keycodes.title': 'HID Keycode List 📚',
            'keycodes.letters': 'Letters',
            'keycodes.numbersSymbols': 'Numbers & Symbols (Top Row)',
            'keycodes.functionKeys': 'Function Keys',
            'keycodes.controlNavigation': 'Control & Navigation',
            'keycodes.modifierKeys': 'Modifier Keys',
            'keycodes.numpad': 'Numpad',
            'keycodes.mediaKeys': 'Media Keys',
            'alert.noDevice': 'No device was selected.',
            'alert.incompatibleDevice': 'The selected device has no compatible PGEKI HID interface.',
            'alert.connectFailed': 'Could not connect to the device.',
            'alert.bluetoothUnsupported': 'This browser does not support Bluetooth connections. Use a Web Bluetooth compatible browser.',
            'alert.bluetoothConnectFailed': 'Bluetooth connection failed. Make sure the controller is powered on and nearby.',
            'alert.hidUnsupported': 'This browser does not support USB HID connections.',
            'alert.fixedIoKeys': 'Keys are fixed in IO mode and cannot be reset.',
            'alert.deviceNotConnected': 'Connect the device first.',
            'alert.writingProfile': 'Writing configuration… Please wait.',
            'alert.unsupportedDevice': 'The connected device model is not supported.',
            'alert.modeRestart': 'Configuration written. The device will switch USB modes and restart. Reconnect after it appears again.',
            'alert.profileWritten': 'Configuration slot {profile} was written successfully! 🎉',
            'alert.profileWriteFailed': 'Could not write the configuration.\nTry restarting the browser.',
            'alert.profileEmpty': 'Configuration slot {profile} is empty and cannot be saved.',
            'alert.profileLoaded': 'Configuration loaded into slot {profile}.',
            'alert.invalidProfileFile': 'This file format is invalid. Choose a single-profile configuration file.',
            'alert.invalidJson': 'This is not a valid JSON configuration file.',
            'alert.fileReadFailed': 'Could not read the file.',
            'alert.readingConfig': 'Reading configuration… Please wait.',
            'confirm.resetLights': 'Reset all lights in the current configuration?\nThis is a local change and takes effect after writing it to the controller.',
            'confirm.resetKeys': 'Reset all keys in the current configuration?\nThis is a local change and takes effect after writing it to the controller.',
            'confirm.resetAll': 'Reset the current configuration?\nThis is a local change and takes effect after writing it to the controller.',
            'confirm.deleteAction': 'Delete action recording slot {slot}?',
            'error.sensorProtocol': 'The sensor telemetry protocol is incompatible',
            'error.deviceDisconnected': 'The device was disconnected',
        }),
    });

    function resolveBrowserLanguage() {
        const browserLanguages = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language || 'zh-CN'];
        return browserLanguages.some(language => /^zh(?:-|$)/i.test(language)) ? 'zh-CN' : 'en';
    }

    function resolveInitialLanguage() {
        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (Object.prototype.hasOwnProperty.call(TRANSLATIONS, savedLanguage)) {
            return savedLanguage;
        }
        return resolveBrowserLanguage();
    }

    let languageFollowsBrowser = !Object.prototype.hasOwnProperty.call(
        TRANSLATIONS,
        localStorage.getItem(LANGUAGE_STORAGE_KEY),
    );
    let currentLanguage = resolveInitialLanguage();

    function translate(key, parameters = {}) {
        const languageTable = TRANSLATIONS[currentLanguage] || TRANSLATIONS['zh-CN'];
        const template = languageTable[key] ?? TRANSLATIONS['zh-CN'][key] ?? key;
        return template.replace(/\{([A-Za-z0-9_]+)\}/g, (match, parameter) => {
            if (!Object.prototype.hasOwnProperty.call(parameters, parameter)) return match;
            const value = parameters[parameter];
            return typeof value === 'number' ? value.toLocaleString(currentLanguage) : String(value);
        });
    }

    function setLocalizedText(element, key, parameters = {}) {
        element.dataset.i18nDynamicKey = key;
        element.dataset.i18nDynamicParameters = JSON.stringify(parameters);
        element.textContent = translate(key, parameters);
    }

    function setPlainText(element, text) {
        element.removeAttribute('data-i18n');
        delete element.dataset.i18nDynamicKey;
        delete element.dataset.i18nDynamicParameters;
        element.textContent = text;
    }

    function setLocalizedAriaLabel(element, key, parameters = {}) {
        element.dataset.i18nDynamicAriaKey = key;
        element.dataset.i18nDynamicAriaParameters = JSON.stringify(parameters);
        element.setAttribute('aria-label', translate(key, parameters));
    }

    function parseTranslationParameters(value) {
        if (!value) return {};
        try {
            return JSON.parse(value);
        } catch (_) {
            return {};
        }
    }

    function applyTranslations() {
        document.documentElement.lang = currentLanguage;
        document.querySelectorAll('[data-i18n]').forEach(element => {
            element.textContent = translate(element.dataset.i18n);
        });
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            element.title = translate(element.dataset.i18nTitle);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            element.placeholder = translate(element.dataset.i18nPlaceholder);
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel));
        });
        document.querySelectorAll('[data-i18n-dynamic-key]').forEach(element => {
            element.textContent = translate(element.dataset.i18nDynamicKey,
                parseTranslationParameters(element.dataset.i18nDynamicParameters));
        });
        document.querySelectorAll('[data-i18n-dynamic-aria-key]').forEach(element => {
            element.setAttribute('aria-label', translate(element.dataset.i18nDynamicAriaKey,
                parseTranslationParameters(element.dataset.i18nDynamicAriaParameters)));
        });
    }

    function renderLanguageToggleButton() {
        const titleKey = currentLanguage === 'zh-CN'
            ? 'language.switchToEn'
            : 'language.switchToZh';
        languageToggleBtn.title = translate(titleKey);
        languageToggleBtn.setAttribute('aria-label', translate(titleKey));
        languageToggleBtn.dataset.language = currentLanguage;
    }

    function setLanguage(language, persist = true) {
        currentLanguage = Object.prototype.hasOwnProperty.call(TRANSLATIONS, language)
            ? language
            : resolveBrowserLanguage();
        if (persist) {
            languageFollowsBrowser = false;
            localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
        }
        applyTranslations();
        renderLanguageToggleButton();
        if (firmwareCatalogLoadPromise || firmwareCatalogEntries.length) {
            updateFirmwareReleaseInfo();
        }
    }

    // --- DOM Elements ---
    const languageToggleBtn = document.getElementById('language-toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const ioModeControls = document.getElementById('io-mode-controls');
    const ioModeControlsHeader = document.getElementById('io-mode-controls-header');
    const ioLightOverrideSwitch = document.getElementById('io-light-override-switch');
    const deviceModeControls = document.getElementById('device-mode-controls');
    const deviceModeControlsHeader = document.getElementById('device-mode-controls-header');
    const deviceModeHint = document.getElementById('device-mode-hint');
    const usbModeSelect = document.getElementById('usb-mode-select');
    const leverMonitor = document.getElementById('lever-monitor');
    const leverPositionFill = document.getElementById('lever-position-fill');
    const leverPositionThumb = document.getElementById('lever-position-thumb');
    const actionSlotSelect = document.getElementById('action-slot-select');
    const actionLoopSwitch = document.getElementById('action-loop-switch');
    const actionRecordBtn = document.getElementById('action-record-btn');
    const actionPlayBtn = document.getElementById('action-play-btn');
    const actionStopBtn = document.getElementById('action-stop-btn');
    const actionDeleteBtn = document.getElementById('action-delete-btn');
    const actionStatusText = document.getElementById('action-status');
    const connectBtn = document.getElementById('connect-btn');
    const connectionMethodModal = document.getElementById('connection-method-modal');
    const connectionMethodCloseBtn = document.querySelector('.connection-method-close-btn');
    const connectBleBtn = document.getElementById('connect-ble-btn');
    const connectHidBtn = document.getElementById('connect-hid-btn');
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
    const WEB_ACTION_COMMAND = 0x12;
    const WEB_ACTION_MAGIC = Object.freeze([0x41, 0x43]);
    const WEB_ACTION_PROTOCOL_VERSION = 1;
    const WEB_ACTION_TELEMETRY_MAGIC = 0xac;
    const WEB_ACTION_MINIMUM_FIRMWARE_VERSION = Object.freeze([1, 1, 0]);
    const WEB_ACTION_SLOT_COUNT = 8;
    const WEB_ACTION_OPERATIONS = Object.freeze({
        START_RECORDING: 1,
        STOP_RECORDING: 2,
        START_PLAYBACK: 3,
        STOP_PLAYBACK: 4,
        DELETE: 5,
    });
    const WEB_ACTION_STATES = Object.freeze({
        IDLE: 0,
        RECORDING: 1,
        SAVING: 2,
        LOADING: 3,
        PLAYING: 4,
        ERROR: 5,
    });
    const WEB_ACTION_FLAG_LOOP = 1;
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
    const BLE_SERVICE_UUID = '7ad37e00-7c67-4f4f-8a33-31e2b7d5a001';
    const BLE_STATE_UUID = '7ad37e01-7c67-4f4f-8a33-31e2b7d5a001';
    const BLE_COMMAND_UUID = '7ad37e02-7c67-4f4f-8a33-31e2b7d5a001';
    const BLE_INFO_UUID = '7ad37e03-7c67-4f4f-8a33-31e2b7d5a001';
    const BLE_PROTOCOL_VERSION = 1;
    const BLE_FRAGMENT_HEADER = 0xbc;
    const BLE_FRAGMENT_PAYLOAD_SIZE = 16;
    const BLE_CAPABILITY_ACTION = 1 << 0;
    const buttonIndexToKeyId = Object.freeze([1, 2, 3, 0, 8, 4, 5, 6, 7, 9]);

    // --- State ---
    let hidDevice = null;
    let bleDevice = null;
    let bleServer = null;
    let bleStateCharacteristic = null;
    let bleCommandCharacteristic = null;
    let bleInfoCharacteristic = null;
    let bleFirmwareVersion = null;
    let bleCapabilities = 0;
    let bleTransaction = 0;
    let bleExtendedWriteAvailable = null;
    let connectionTransport = null;
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
    let actionTelemetrySupported = false;
    let currentActionStatus = null;
    let actionCommandInProgress = false;
    let actionCommandErrorKey = null;
    const sensorHistory = { left: [], right: [] };
    const latestSensorSensitivity = { left: null, right: null };
    const pendingSensorSensitivity = { left: null, right: null };
    const sensorSensitivityConfirmTimer = { left: null, right: null };
    const sensorCardElements = {
        left: collectSensorCardElements('left'),
        right: collectSensorCardElements('right'),
    };
    let profiles = loadProfiles() || Array(6).fill(null).map(() => ({}));

    const mobileDevice = Boolean(navigator.userAgentData &&
        navigator.userAgentData.mobile) ||
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
        (window.matchMedia('(pointer: coarse)').matches &&
            Math.min(window.screen.width, window.screen.height) < 820);
    document.body.classList.toggle('mobile-device', mobileDevice);
    connectHidBtn.disabled = !('hid' in navigator);
    connectBleBtn.disabled = !('bluetooth' in navigator);

    function controllerConnected() {
        return connectionTransport === 'hid'
            ? Boolean(hidDevice && hidDevice.opened)
            : connectionTransport === 'ble'
                ? Boolean(bleDevice && bleDevice.gatt.connected)
                : false;
    }

    async function sendControllerReport(report) {
        if (connectionTransport === 'hid') {
            const deviceDefinition = hidDevice ? findDeviceDefinition(hidDevice) : null;
            if (!hidDevice || !hidDevice.opened || !deviceDefinition) {
                throw new Error(translate('error.deviceDisconnected'));
            }
            await hidDevice.sendReport(deviceDefinition.outputReportId, report);
            return;
        }
        if (connectionTransport !== 'ble' || !bleCommandCharacteristic ||
            !bleDevice || !bleDevice.gatt.connected) {
            throw new Error(translate('error.deviceDisconnected'));
        }

        if (bleExtendedWriteAvailable !== false) {
            try {
                if (typeof bleCommandCharacteristic.writeValueWithResponse === 'function') {
                    await bleCommandCharacteristic.writeValueWithResponse(report);
                } else {
                    await bleCommandCharacteristic.writeValue(report);
                }
                bleExtendedWriteAvailable = true;
                return;
            } catch (error) {
                if (bleExtendedWriteAvailable === true) throw error;
                bleExtendedWriteAvailable = false;
            }
        }

        const transaction = bleTransaction++ & 0xff;
        for (let offset = 0; offset < report.byteLength;
            offset += BLE_FRAGMENT_PAYLOAD_SIZE) {
            const payload = report.slice(offset,
                offset + BLE_FRAGMENT_PAYLOAD_SIZE);
            const fragment = new Uint8Array(4 + payload.byteLength);
            fragment[0] = BLE_FRAGMENT_HEADER;
            fragment[1] = transaction;
            fragment[2] = offset;
            fragment[3] = report.byteLength;
            fragment.set(payload, 4);
            if (typeof bleCommandCharacteristic.writeValueWithResponse === 'function') {
                await bleCommandCharacteristic.writeValueWithResponse(fragment);
            } else {
                await bleCommandCharacteristic.writeValue(fragment);
            }
        }
    }

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
        if (config.keyDisplay) {
            setPlainText(currentKeyDisplay, config.keyDisplay);
        } else {
            setLocalizedText(currentKeyDisplay, 'common.none');
        }

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
            throw new Error(translate('error.sensorProtocol'));
        }
        const flags = data.getUint8(payloadOffset + 3);
        const versionComponents = data.byteLength >= payloadOffset + 63 ? [
            data.getUint8(payloadOffset + 60),
            data.getUint8(payloadOffset + 61),
            data.getUint8(payloadOffset + 62),
        ] : null;
        const firmwareVersion = versionComponents && versionComponents.some(Boolean) ?
            versionComponents.join('.') : null;
        return {
            left: readTelemetrySide(data, payloadOffset + 8,
                data.getUint8(payloadOffset + 4),
                data.getInt8(payloadOffset + 6),
                Boolean(flags & 0x01), Boolean(flags & 0x02)),
            right: readTelemetrySide(data, payloadOffset + 32,
                data.getUint8(payloadOffset + 5),
                data.getInt8(payloadOffset + 7),
                Boolean(flags & 0x04), Boolean(flags & 0x08)),
            action: decodeActionTelemetry(data, payloadOffset + 56,
                firmwareVersion),
            firmwareVersion,
        };
    }

    function decodeActionTelemetry(data, offset, firmwareVersion) {
        const version = firmwareVersion ? parseFirmwareVersion(firmwareVersion) : null;
        if (!version || compareFirmwareVersions(
            version, WEB_ACTION_MINIMUM_FIRMWARE_VERSION) < 0 ||
            data.byteLength < offset + 4 ||
            data.getUint8(offset) !== WEB_ACTION_TELEMETRY_MAGIC) {
            return null;
        }
        const packedState = data.getUint8(offset + 1);
        const state = packedState & 0x0f;
        const lastError = packedState >>> 4;
        const activeSlot = data.getUint8(offset + 2);
        if (state > WEB_ACTION_STATES.ERROR || lastError > 9 ||
            (activeSlot !== 0xff && activeSlot >= WEB_ACTION_SLOT_COUNT)) {
            return null;
        }
        return {
            state,
            lastError,
            activeSlot,
            validSlotMask: data.getUint8(offset + 3),
        };
    }

    function renderFirmwareVersion(version) {
        setLocalizedText(firmwareVersion, 'header.firmwareVersion', {
            version: version || '--',
        });
    }

    function selectedActionSlot() {
        const slot = Number(actionSlotSelect.value);
        return Number.isInteger(slot) && slot >= 0 &&
            slot < WEB_ACTION_SLOT_COUNT ? slot : 0;
    }

    function renderActionSlotOptions(validSlotMask = 0) {
        const selected = selectedActionSlot();
        if (actionSlotSelect.options.length !== WEB_ACTION_SLOT_COUNT) {
            actionSlotSelect.replaceChildren();
            for (let slot = 0; slot < WEB_ACTION_SLOT_COUNT; slot++) {
                actionSlotSelect.append(new Option('', slot.toString()));
            }
        }
        for (let slot = 0; slot < WEB_ACTION_SLOT_COUNT; slot++) {
            const option = actionSlotSelect.options[slot];
            setLocalizedText(option,
                validSlotMask & (1 << slot)
                    ? 'action.slotStored'
                    : 'action.slotEmpty',
                { slot: slot + 1 });
        }
        actionSlotSelect.value = selected.toString();
    }

    function actionErrorTranslation(error) {
        const keys = {
            1: 'action.error.notReady',
            2: 'action.error.protocol',
            3: 'action.error.invalidSlot',
            4: 'action.error.busy',
            5: 'action.error.noData',
            6: 'action.error.noMemory',
            7: 'action.error.overflow',
            8: 'action.error.storage',
            9: 'action.error.corrupt',
        };
        return keys[error] || 'action.error.unknown';
    }

    function setActionStatusText(key, state = '', parameters = {}) {
        setLocalizedText(actionStatusText, key, parameters);
        actionStatusText.classList.remove('is-active', 'is-error');
        if (state) actionStatusText.classList.add(state);
    }

    function refreshActionControls() {
        const available = controllerConnected() &&
            actionTelemetrySupported && currentActionStatus && !otaUploadActive;
        const state = currentActionStatus ? currentActionStatus.state : null;
        const idle = state === WEB_ACTION_STATES.IDLE ||
            state === WEB_ACTION_STATES.ERROR;
        const validSlot = currentActionStatus &&
            Boolean(currentActionStatus.validSlotMask &
                (1 << selectedActionSlot()));
        const locked = !available || actionCommandInProgress;
        actionSlotSelect.disabled = locked || !idle;
        actionLoopSwitch.disabled = locked || !idle;
        actionRecordBtn.disabled = locked || !idle;
        actionPlayBtn.disabled = locked || !idle || !validSlot;
        actionDeleteBtn.disabled = locked || !idle || !validSlot;
        actionStopBtn.disabled = locked ||
            (state !== WEB_ACTION_STATES.RECORDING &&
             state !== WEB_ACTION_STATES.PLAYING);
    }

    function renderActionStatus(status) {
        currentActionStatus = status;
        actionTelemetrySupported = Boolean(status);
        renderActionSlotOptions(status ? status.validSlotMask : 0);

        if (actionCommandErrorKey) {
            setActionStatusText(actionCommandErrorKey, 'is-error');
        } else if (!controllerConnected()) {
            setActionStatusText('action.disconnected');
        } else if (!status) {
            setActionStatusText('action.unsupported');
        } else if (status.lastError) {
            setActionStatusText(actionErrorTranslation(status.lastError),
                'is-error');
        } else {
            const activeSlot = status.activeSlot < WEB_ACTION_SLOT_COUNT
                ? status.activeSlot : selectedActionSlot();
            switch (status.state) {
                case WEB_ACTION_STATES.RECORDING:
                    setActionStatusText('action.recording', 'is-active', {
                        slot: activeSlot + 1,
                    });
                    break;
                case WEB_ACTION_STATES.SAVING:
                    setActionStatusText('action.saving', 'is-active');
                    break;
                case WEB_ACTION_STATES.LOADING:
                    setActionStatusText('action.loading', 'is-active');
                    break;
                case WEB_ACTION_STATES.PLAYING:
                    setActionStatusText('action.playing', 'is-active', {
                        slot: activeSlot + 1,
                    });
                    break;
                default: {
                    const slot = selectedActionSlot();
                    if (status.validSlotMask & (1 << slot)) {
                        setPlainText(actionStatusText, '');
                        actionStatusText.classList.remove(
                            'is-active', 'is-error');
                    } else {
                        setActionStatusText('action.idleEmpty', '', {
                            slot: slot + 1,
                        });
                    }
                    break;
                }
            }
        }
        refreshActionControls();
    }

    function resetActionControls() {
        actionCommandInProgress = false;
        actionCommandErrorKey = null;
        renderActionStatus(null);
    }

    async function sendActionCommand(operation, slot = selectedActionSlot(),
        flags = 0) {
        if (!controllerConnected()) {
            actionCommandErrorKey = 'action.communicationFailed';
            renderActionStatus(currentActionStatus);
            return;
        }
        const report = new Uint8Array(63);
        report[0] = WEB_ACTION_COMMAND;
        report[1] = WEB_ACTION_MAGIC[0];
        report[2] = WEB_ACTION_MAGIC[1];
        report[3] = WEB_ACTION_PROTOCOL_VERSION;
        report[4] = operation;
        report[5] = slot;
        report[6] = flags;

        actionCommandErrorKey = null;
        actionCommandInProgress = true;
        refreshActionControls();
        try {
            await sendControllerReport(report);
        } catch (_) {
            actionCommandErrorKey = 'action.communicationFailed';
        } finally {
            setTimeout(() => {
                actionCommandInProgress = false;
                renderActionStatus(currentActionStatus);
            }, 150);
        }
    }

    async function handleDeleteAction() {
        const slot = selectedActionSlot();
        if (!await showCustomConfirm(translate('confirm.deleteAction', {
            slot: slot + 1,
        }))) return;
        await sendActionCommand(WEB_ACTION_OPERATIONS.DELETE, slot);
    }

    function handleStopAction() {
        if (!currentActionStatus) return;
        if (currentActionStatus.state === WEB_ACTION_STATES.RECORDING) {
            const slot = currentActionStatus.activeSlot < WEB_ACTION_SLOT_COUNT
                ? currentActionStatus.activeSlot : selectedActionSlot();
            sendActionCommand(WEB_ACTION_OPERATIONS.STOP_RECORDING, slot);
        } else if (currentActionStatus.state === WEB_ACTION_STATES.PLAYING) {
            sendActionCommand(WEB_ACTION_OPERATIONS.STOP_PLAYBACK);
        }
    }

    function formatSensorValue(value) {
        return Number(value).toLocaleString(currentLanguage);
    }

    function formatSensitivity(value) {
        const numericValue = Number(value);
        return numericValue > 0 ? `+${numericValue}` : `${numericValue}`;
    }

    function setSensitivityStatus(sideName, key, state = '', parameters = {}) {
        const status = sensorCardElements[sideName].sensitivityStatus;
        if (key) {
            setLocalizedText(status, key, parameters);
        } else {
            setPlainText(status, '');
        }
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
            setSensitivityStatus(sideName, 'sensor.notConfirmed', 'error');
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
        setSensitivityStatus(sideName, 'sensor.saving', 'saving');
        refreshSensitivityControls();
        try {
            await hidDevice.sendReport(deviceDefinition.outputReportId, report);
            waitForSensitivityConfirmation(sideName, requested);
            setSensitivityStatus(sideName, 'sensor.waitingConfirmation', 'saving');
        } catch (error) {
            pendingSensorSensitivity[sideName] = null;
            setSensitivityStatus(sideName, 'sensor.writeFailed', 'error');
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
            setSensitivityStatus(sideName, 'sensor.syncedController', 'saved');
        }
        if (document.activeElement !== elements.sensitivityInput &&
            pendingSensorSensitivity[sideName] === null) {
            elements.sensitivityInput.value = telemetry.sensitivity;
            elements.sensitivity.textContent =
                formatSensitivity(telemetry.sensitivity);
            if (!elements.sensitivityStatus.classList.contains('saved') &&
                !elements.sensitivityStatus.classList.contains('error')) {
                setSensitivityStatus(sideName, 'sensor.synced', 'saved');
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

        setLocalizedText(elements.signal, 'sensor.signal', { value: telemetry.signal });
        setLocalizedText(elements.pressThreshold, 'sensor.press', {
            value: telemetry.pressThreshold,
        });
        setLocalizedText(elements.releaseThreshold, 'sensor.release', {
            value: telemetry.releaseThreshold,
        });
        elements.raw.textContent = formatSensorValue(telemetry.raw);
        elements.filtered.textContent = formatSensorValue(telemetry.filtered);
        elements.baseline.textContent = formatSensorValue(telemetry.baseline);
        elements.card.classList.toggle('pressed', telemetry.pressed);
        setLocalizedAriaLabel(elements.chart,
            sideName === 'left' ? 'sensor.chartStatusLeft' : 'sensor.chartStatusRight', {
            signal: telemetry.signal,
            press: telemetry.pressThreshold,
            release: telemetry.releaseThreshold,
            sensitivity: telemetry.sensitivity,
        });
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
            setLocalizedText(elements.signal, 'sensor.signalEmpty');
            setLocalizedText(elements.pressThreshold, 'sensor.pressEmpty');
            setLocalizedText(elements.releaseThreshold, 'sensor.releaseEmpty');
            elements.sensitivity.textContent = '--';
            elements.sensitivityInput.value = 0;
            elements.sensitivityInput.disabled = true;
            setSensitivityStatus(sideName, 'sensor.waiting');
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
        renderLeverPosition(null);
        resetActionControls();
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
                setSensitivityStatus(sideName, 'sensor.unsupported', 'error');
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
            renderActionStatus(telemetry.action);
            renderSensorSide('left', telemetry.left);
            renderSensorSide('right', telemetry.right);
            scheduleSensorTelemetryPoll(generation,
                SENSOR_TELEMETRY_POLL_INTERVAL_MS);
        } catch (error) {
            if (generation !== sensorTelemetryGeneration) return;
            sensorTelemetrySupported = false;
            renderActionStatus(null);
            for (const sideName of ['left', 'right']) {
                setSensitivityStatus(sideName, 'sensor.unsupported', 'error');
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
    function showConnectionMethodModal() {
        connectionMethodModal.style.display = 'flex';
    }

    function hideConnectionMethodModal() {
        connectionMethodModal.style.display = 'none';
    }

    function resetControllerConnection() {
        connectionTransport = null;
        connectedUsbMode = null;
        bleServer = null;
        bleStateCharacteristic = null;
        bleCommandCharacteristic = null;
        bleInfoCharacteristic = null;
        bleFirmwareVersion = null;
        bleCapabilities = 0;
        bleExtendedWriteAvailable = null;
        mainContent.classList.remove('controller-connected');
        stopSensorTelemetry();
        renderFirmwareVersion(null);
        updateButtonStates(Array(10).fill(false));
        setConnectButtonState(false);
    }

    async function handleHidConnect() {
        if (!('hid' in navigator)) {
            showCustomAlert(translate('alert.hidUnsupported'));
            return;
        }
        try {
            const filters = USB_DEVICE_DEFINITIONS.map(({
                vendorId,
                productId,
                usagePage,
                usage,
            }) => ({ vendorId, productId, usagePage, usage }));
            const devices = await navigator.hid.requestDevice({ filters });
            if (devices.length === 0) {
                showCustomAlert(translate('alert.noDevice'));
                return;
            }

            const selectedDevice = devices.find(device => findDeviceDefinition(device));
            const deviceDefinition = selectedDevice ? findDeviceDefinition(selectedDevice) : null;
            if (!selectedDevice || !deviceDefinition) {
                showCustomAlert(translate('alert.incompatibleDevice'));
                return;
            }

            hidDevice = selectedDevice;
            if (!hidDevice.opened) {
                await hidDevice.open();
            }
            connectedUsbMode = deviceDefinition.mode;
            connectionTransport = 'hid';
            setSelectedUsbMode(connectedUsbMode);
            mainContent.classList.add('controller-connected');
            
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
                    cancelOtaWaiter(new Error(translate('error.deviceDisconnected')));
                    stopSensorTelemetry();
                    //console.log('设备已断开连接喵！');
                    hidDevice = null;
                    resetControllerConnection();
                }
            });

        } catch (error) {
            //console.error('连接HID设备时出错了喵:', error);
            showCustomAlert(translate('alert.connectFailed'));
        }
    }

    function decodeBleInfo(value) {
        if (value.byteLength < 10 || value.getUint8(0) !== 0x50 ||
            value.getUint8(1) !== 0x47 ||
            value.getUint8(2) !== BLE_PROTOCOL_VERSION) {
            throw new Error('Unsupported PGEKI BLE information packet');
        }
        bleFirmwareVersion = [value.getUint8(3), value.getUint8(4),
            value.getUint8(5)].join('.');
        bleCapabilities = value.getUint8(8);
        connectedUsbMode = value.getUint8(9) === 1
            ? USB_MODES.IO4
            : USB_MODES.RAW_IO;
        renderFirmwareVersion(bleFirmwareVersion);
        setSelectedUsbMode(connectedUsbMode);
    }

    function handleBleInfo(event) {
        try {
            decodeBleInfo(event.target.value);
        } catch (_) {
            // Ignore malformed asynchronous metadata without dropping input.
        }
    }

    function handleBleState(eventOrValue) {
        const data = eventOrValue instanceof DataView
            ? eventOrValue
            : eventOrValue.target.value;
        if (data.byteLength !== 20 || data.getUint8(0) !== 0x50 ||
            data.getUint8(1) !== 0x47 ||
            data.getUint8(2) !== BLE_PROTOCOL_VERSION) return;

        const buttonStates = Array.from({ length: 10 }, (_, index) =>
            data.getUint8(4 + index) !== 0);
        const lever = Math.max(-1, Math.min(1,
            data.getInt16(14, true) / 16383));
        updateButtonStates(buttonStates);
        renderLeverPosition(lever);
        renderActionStatus((bleCapabilities & BLE_CAPABILITY_ACTION) !== 0
            ? decodeActionTelemetry(data, 16, bleFirmwareVersion)
            : null);
    }

    function handleBleDisconnect() {
        bleDevice = null;
        resetControllerConnection();
    }

    async function handleBleConnect() {
        if (!('bluetooth' in navigator)) {
            showCustomAlert(translate('alert.bluetoothUnsupported'));
            return;
        }
        try {
            bleDevice = await navigator.bluetooth.requestDevice({
                filters: [{ services: [BLE_SERVICE_UUID] }],
                optionalServices: [BLE_SERVICE_UUID],
            });
            bleDevice.addEventListener('gattserverdisconnected',
                handleBleDisconnect, { once: true });
            bleServer = await bleDevice.gatt.connect();
            const service = await bleServer.getPrimaryService(BLE_SERVICE_UUID);
            [bleStateCharacteristic, bleCommandCharacteristic,
                bleInfoCharacteristic] = await Promise.all([
                service.getCharacteristic(BLE_STATE_UUID),
                service.getCharacteristic(BLE_COMMAND_UUID),
                service.getCharacteristic(BLE_INFO_UUID),
            ]);

            const info = await bleInfoCharacteristic.readValue();
            decodeBleInfo(info);
            bleInfoCharacteristic.addEventListener(
                'characteristicvaluechanged', handleBleInfo);
            await bleInfoCharacteristic.startNotifications();
            bleStateCharacteristic.addEventListener(
                'characteristicvaluechanged', handleBleState);
            await bleStateCharacteristic.startNotifications();

            connectionTransport = 'ble';
            mainContent.classList.remove('sensor-monitoring');
            mainContent.classList.add('controller-connected');
            resetSensorMonitor();
            setConnectButtonState(true);
            handleBleState(await bleStateCharacteristic.readValue());
        } catch (error) {
            if (bleDevice && bleDevice.gatt.connected) bleDevice.gatt.disconnect();
            bleDevice = null;
            resetControllerConnection();
            showCustomAlert(translate('alert.bluetoothConnectFailed'));
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
            setLocalizedText(connectBtn, 'header.write');
            connectBtn.style.backgroundColor = '#27ae60'; // Green
        } else {
            setLocalizedText(connectBtn, 'header.connect');
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
                    showCustomAlert(translate('keyConfig.invalidKeycode'));
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
        renderLeverPosition(decodeLeverPosition(data, deviceDefinition.mode));
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
            const error = new Error(translate('firmware.error.protocol'));
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
            0x80: translate('firmware.error.unavailable'),
            0x81: translate('firmware.error.invalidLength'),
            0x82: translate('firmware.error.sequence', { sequence: status.sequence }),
            0x83: translate('firmware.error.partition'),
            0x84: translate('firmware.error.flash'),
            0x85: translate('firmware.error.image'),
            0x86: translate('firmware.error.bootPartition'),
            0x87: translate('firmware.error.timeout'),
            0x88: translate('firmware.error.busy'),
            0x89: translate('firmware.error.protocol'),
        };
        return messages[status.status] || translate('firmware.error.deviceCode', {
            code: status.status.toString(16).padStart(2, '0'),
        });
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
            throw new Error(translate('firmware.error.disconnected'));
        }

        let lastError = null;
        for (let attempt = 0; attempt <= retryCount; attempt++) {
            const responsePromise = new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    if (otaAckWaiter && otaAckWaiter.timeoutId === timeoutId) {
                        otaAckWaiter = null;
                    }
                    const error = new Error(translate('firmware.error.responseTimeout'));
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
        throw lastError || new Error(translate('firmware.error.communication'));
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
            throw new Error(translate('firmware.error.invalidPath'));
        }
        const baseUrl = getFirmwareAssetBaseUrl();
        const assetUrl = new URL(path, baseUrl);
        if (!assetUrl.href.startsWith(baseUrl.href)) {
            throw new Error(translate('firmware.error.outsidePath'));
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
            notesI18n: entry.notesI18n && typeof entry.notesI18n === 'object'
                ? entry.notesI18n
                : null,
            size: entry.size,
            sha256: entry.sha256.toLowerCase(),
            url,
        };
    }

    function getFirmwareReleaseNotes(release) {
        if (!release) return '';
        if (release.notesI18n) {
            const exact = release.notesI18n[currentLanguage];
            if (typeof exact === 'string') return exact;
            const fallback = currentLanguage === 'zh-CN'
                ? release.notesI18n.zh
                : release.notesI18n.en;
            if (typeof fallback === 'string') return fallback;
        }
        return release.notes;
    }

    function updateFirmwareReleaseInfo() {
        const release = firmwareCatalogEntries.find(
            entry => entry.version === firmwareReleaseSelect.value);
        if (!release) {
            setLocalizedText(firmwareReleaseInfo, firmwareCatalogEntries.length
                ? 'firmware.chooseRepositoryOrLocal'
                : 'firmware.repositoryUnavailable');
            return;
        }
        const releaseNotes = getFirmwareReleaseNotes(release);
        const notes = releaseNotes ? ` · ${releaseNotes}` : '';
        setPlainText(firmwareReleaseInfo,
            `${release.name} v${release.version} · ${formatFirmwareSize(release.size)}${notes}`);
    }

    function renderFirmwareCatalog(entries) {
        firmwareCatalogEntries = entries;
        firmwareReleaseSelect.replaceChildren();
        if (!entries.length) {
            const emptyOption = new Option(
                translate('firmware.noRepositoryFirmware'), '');
            emptyOption.dataset.i18n = 'firmware.noRepositoryFirmware';
            firmwareReleaseSelect.append(emptyOption);
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
            setLocalizedText(firmwareUpdateStatus, 'firmware.selectedRepository', {
                version: entries[0].version,
            });
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
                    throw new Error(translate('firmware.error.catalogFormat'));
                }
                const entries = manifest.firmware
                    .map(validateFirmwareCatalogEntry)
                    .filter(Boolean)
                    .sort((left, right) =>
                        compareFirmwareVersions(right.versionParts, left.versionParts));
                renderFirmwareCatalog(entries);
            } catch (error) {
                renderFirmwareCatalog([]);
                setLocalizedText(firmwareReleaseInfo, 'firmware.catalogLoadFailed', {
                    message: error.message,
                });
                firmwareCatalogLoadPromise = null;
            }
        })();
        return firmwareCatalogLoadPromise;
    }

    function validateFirmwareImage(firmware) {
        if (!firmware.length || firmware.length > WEB_OTA_MAXIMUM_IMAGE_SIZE) {
            throw new Error(translate('firmware.error.imageSize'));
        }
        if (firmware[0] !== 0xE9) throw new Error(translate('firmware.error.invalidImage'));
    }

    async function sha256Hex(bytes) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error(translate('firmware.error.integrityUnsupported'));
        }
        const digest = await window.crypto.subtle.digest('SHA-256', bytes);
        return Array.from(new Uint8Array(digest), value =>
            value.toString(16).padStart(2, '0')).join('');
    }

    async function readSelectedFirmware() {
        const localFile = firmwareFileInput.files[0];
        if (localFile) {
            if (!/\.bin$/i.test(localFile.name)) {
                throw new Error(translate('firmware.error.localExtension'));
            }
            setLocalizedText(firmwareUpdateStatus, 'firmware.readingLocal', {
                name: localFile.name,
            });
            const firmware = new Uint8Array(await localFile.arrayBuffer());
            validateFirmwareImage(firmware);
            return firmware;
        }

        const release = firmwareCatalogEntries.find(
            entry => entry.version === firmwareReleaseSelect.value);
        if (!release) throw new Error(translate('firmware.error.selectSource'));
        setLocalizedText(firmwareUpdateStatus, 'firmware.downloading', {
            version: release.version,
        });
        const response = await fetch(release.url, { cache: 'no-store' });
        if (!response.ok) throw new Error(translate('firmware.error.download', {
            status: response.status,
        }));
        const firmware = new Uint8Array(await response.arrayBuffer());
        if (firmware.length !== release.size) {
            throw new Error(translate('firmware.error.sizeMismatch'));
        }
        validateFirmwareImage(firmware);
        setLocalizedText(firmwareUpdateStatus, 'firmware.verifying', {
            version: release.version,
        });
        if (await sha256Hex(firmware) !== release.sha256) {
            throw new Error(translate('firmware.error.shaMismatch'));
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
        refreshActionControls();
    }

    async function handleFirmwareUpload() {
        if (!hidDevice || !hidDevice.opened) {
            setLocalizedText(firmwareUpdateStatus, 'firmware.connectFirst');
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
            setLocalizedText(firmwareUpdateStatus, 'firmware.preparing');
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
                    setLocalizedText(firmwareUpdateStatus, 'firmware.transferring', {
                        percent,
                    });
                }
            }

            const endReport = createWebOtaReport(WEB_OTA_COMMANDS.END);
            setLocalizedText(firmwareUpdateStatus, 'firmware.finalVerifying');
            await exchangeWebOtaReport(endReport, WEB_OTA_COMMANDS.END, 0, 30000, 0);
            transferStarted = false;
            firmwareUpdateProgress.value = 100;
            setLocalizedText(firmwareUpdateStatus, 'firmware.success');
        } catch (error) {
            firmwareUpdateProgress.value = 0;
            setLocalizedText(firmwareUpdateStatus, 'firmware.failed', {
                message: error.message,
            });
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

    function decodeLeverPosition(data, usbMode) {
        if (usbMode === USB_MODES.IO4) {
            if (data.byteLength < 2) return null;
            const adc = data.getUint16(0, true);
            return Math.max(-1, Math.min(1, (32767 - adc) / 32767));
        }
        if (data.byteLength < 12) return null;
        return Math.max(-1, Math.min(1, data.getInt16(10, true) / 16383));
    }

    function renderLeverPosition(position) {
        const available = Number.isFinite(position);
        const normalized = available ? Math.max(-1, Math.min(1, position)) : 0;
        const trackPosition = (normalized + 1) * 50;
        const value = Math.round(normalized * 100);
        leverPositionThumb.style.left = `${trackPosition}%`;
        leverPositionFill.style.left = `${Math.min(50, trackPosition)}%`;
        leverPositionFill.style.width = `${Math.abs(trackPosition - 50)}%`;
        leverMonitor.classList.toggle('has-signal', available);
        if (available) {
            const displayValue = value > 0 ? `+${value}` : value.toString();
            setLocalizedAriaLabel(leverMonitor, 'lever.position', {
                value: displayValue,
            });
        } else {
            setLocalizedAriaLabel(leverMonitor, 'lever.waiting');
        }
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
            deviceModeControls.style.display = 'flex';
            deviceModeControlsHeader.style.display = 'block';
            deviceModeHint.style.display = 'block';
            // Set the switch state from profile data
            const config = profiles[0] || {};
            ioLightOverrideSwitch.checked = !!config.ioLightOverride;
        } else {
            ioModeControls.style.display = 'none';
            ioModeControlsHeader.style.display = 'none';
            deviceModeControls.style.display = 'none';
            deviceModeControlsHeader.style.display = 'none';
            deviceModeHint.style.display = 'none';
        }

        updateKeyAppearances();
        //console.log(`切换到配置文件 ${profileIndex + 1} 喵~`);
    }

    /**
     * Handles the click event on the reset lights button.
     * This is now a local-only operation.
     */
    async function handleResetLights() {
        const confirmed = await showCustomConfirm(translate('confirm.resetLights'));
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
            showCustomAlert(translate('alert.fixedIoKeys'));
            return;
        }
        const confirmed = await showCustomConfirm(translate('confirm.resetKeys'));
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
        const confirmed = await showCustomConfirm(translate('confirm.resetAll'));
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
        if (!controllerConnected()) {
            showCustomAlert(translate('alert.deviceNotConnected'));
            return;
        }

        showCustomAlert(translate('alert.writingProfile')); // Show pending status

        // A short delay to allow the pending message to render before potential blocking operation
        await new Promise(resolve => setTimeout(resolve, 50));

        const deviceDefinition = connectionTransport === 'hid'
            ? findDeviceDefinition(hidDevice)
            : null;
        if (connectionTransport === 'hid' && !deviceDefinition) {
            showCustomAlert(translate('alert.unsupportedDevice'));
            return;
        }

        const selectedIoUsbMode = Number(usbModeSelect.value) === USB_MODES.IO4
            ? USB_MODES.IO4
            : USB_MODES.RAW_IO;
        const targetUsbMode = currentProfile === 0
            ? selectedIoUsbMode
            : USB_MODES.RAW_IO;
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
        // USB mode belongs to profile 0 only. A zero value asks the firmware to
        // preserve that setting while profiles 1..5 run as RAW keyboard/mouse.
        data[43] = currentProfile === 0 ? selectedIoUsbMode : 0;

        // --- 调试日志 ---
        //console.log('--- 准备发送HID报告 ---');
        //console.log(`目标设备喵:`, hidDevice.productName);
        //console.log(`传输方式: ${connectionTransport}`);
        //console.log(`数据包 (Uint8Array, 长度: ${data.length} bytes):`, data);
        //console.log(`数据包内容 (Hex): ${Array.from(data).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')}`);
        //console.log('------------------------');

        try {
            await sendControllerReport(data);
            if (currentProfile === 0) {
                setSelectedUsbMode(selectedIoUsbMode);
            }
            if (targetUsbMode !== connectedUsbMode) {
                showCustomAlert(translate('alert.modeRestart'));
            } else {
                showCustomAlert(translate('alert.profileWritten', {
                    profile: currentProfile + 1,
                }));
            }
        } catch (error) {
            //console.error('配置文件写入失败了喵:', error);
            showCustomAlert(translate('alert.profileWriteFailed'));
        }
    }

    /**
     * Saves the CURRENTLY SELECTED profile to a local JSON file.
     */
    function handleSaveToFile() {
        const currentProfileConfig = profiles[currentProfile];
        if (!currentProfileConfig || Object.keys(currentProfileConfig).length === 0) {
            showCustomAlert(translate('alert.profileEmpty', {
                profile: currentProfile + 1,
            }));
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
                    showCustomAlert(translate('alert.profileLoaded', {
                        profile: currentProfile + 1,
                    }));
                } else {
                    showCustomAlert(translate('alert.invalidProfileFile'));
                }
            } catch (error) {
                //console.error('解析配置文件失败了喵:', error);
                showCustomAlert(translate('alert.invalidJson'));
            }
        };

        reader.onerror = () => {
             showCustomAlert(translate('alert.fileReadFailed'));
        };

        reader.readAsText(file);
        showCustomAlert(translate('alert.readingConfig')); // Show pending status
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
        setLocalizedText(recordKeyBtn, 'keyConfig.startRecording');
        recordKeyBtn.classList.remove('is-recording');
        isRecording = false;
    }

    function handleRecordKey() {
        if (isRecording) {
            cancelRecording();
            //console.log('取消按键录制喵~');
            return;
        }

        setLocalizedText(recordKeyBtn, 'keyConfig.recording');
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
                setPlainText(currentKeyDisplay, newKeySelection.keyDisplay);
                //console.log(`录制到按键: ${newKeySelection.keyDisplay} (码: 0x${hidCode.toString(16)}) 喵~`);
            } else {
                newKeySelection = null; // Invalidate selection if key is not mapped
                setLocalizedText(currentKeyDisplay, 'keyConfig.unmapped');
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
    const systemThemeMedia = window.matchMedia('(prefers-color-scheme: light)');

    function applySystemTheme() {
        document.body.classList.toggle('light-mode', systemThemeMedia.matches);
    }

    // --- Event Listeners ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
    });

    connectBtn.addEventListener('click', () => controllerConnected()
        ? handleUploadProfile()
        : showConnectionMethodModal());
    connectBleBtn.addEventListener('click', () => {
        hideConnectionMethodModal();
        handleBleConnect();
    });
    connectHidBtn.addEventListener('click', () => {
        hideConnectionMethodModal();
        handleHidConnect();
    });
    connectionMethodCloseBtn.addEventListener('click',
        hideConnectionMethodModal);
    connectionMethodCloseBtn.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            hideConnectionMethodModal();
        }
    });
    connectionMethodModal.addEventListener('click', event => {
        if (event.target === connectionMethodModal) hideConnectionMethodModal();
    });
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
            setLocalizedText(firmwareUpdateStatus, 'firmware.selectedRepository', {
                version: firmwareReleaseSelect.value,
            });
        }
    });
    firmwareFileInput.addEventListener('change', () => {
        if (!firmwareFileInput.files[0]) return;
        firmwareReleaseSelect.value = '';
        updateFirmwareReleaseInfo();
        setLocalizedText(firmwareUpdateStatus, 'firmware.selectedLocal', {
            name: firmwareFileInput.files[0].name,
        });
    });
    ioLightOverrideSwitch.addEventListener('change', handleIoLightSwitchChange);
    usbModeSelect.addEventListener('change', () => setSelectedUsbMode(Number(usbModeSelect.value)));
    actionSlotSelect.addEventListener('change', () => {
        actionCommandErrorKey = null;
        renderActionStatus(currentActionStatus);
    });
    actionRecordBtn.addEventListener('click', () => sendActionCommand(
        WEB_ACTION_OPERATIONS.START_RECORDING));
    actionPlayBtn.addEventListener('click', () => sendActionCommand(
        WEB_ACTION_OPERATIONS.START_PLAYBACK,
        selectedActionSlot(),
        actionLoopSwitch.checked ? WEB_ACTION_FLAG_LOOP : 0));
    actionStopBtn.addEventListener('click', handleStopAction);
    actionDeleteBtn.addEventListener('click', handleDeleteAction);
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
    languageToggleBtn.addEventListener('click', () => {
        setLanguage(currentLanguage === 'zh-CN' ? 'en' : 'zh-CN');
    });
    window.addEventListener('languagechange', () => {
        if (languageFollowsBrowser) setLanguage(resolveBrowserLanguage(), false);
    });
    if (typeof systemThemeMedia.addEventListener === 'function') {
        systemThemeMedia.addEventListener('change', applySystemTheme);
    } else {
        systemThemeMedia.addListener(applySystemTheme);
    }

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
    applySystemTheme();
    setLanguage(currentLanguage, false);
    renderFirmwareVersion(null);
    resetActionControls();
    setConnectButtonState(false);
    setSelectedUsbMode(Number(localStorage.getItem('pgeki-usb-mode')));
    switchProfile(0); // Activate the first profile by default
});
