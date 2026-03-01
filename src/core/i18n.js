/**
 * 国际化模块
 * 支持中英文切换
 */

const translations = {
    zh: {
        title: '行为树可视化系统',
        fileOperation: '文件操作',
        selectDotFile: '选择 .dot 文件',
        viewControl: '视图控制',
        resetView: '视角重置',
        saveOptions: '保存选项',
        saveSVG: '保存 SVG',
        savePNG: '保存 PNG',
        instructions: '操作说明',
        dragNodes: '节点支持拖拽移动',
        panView: '鼠标左键平移视场',
        zoomWheel: '鼠标滚轮缩放（细）',
        zoomCtrlWheel: 'Ctrl+鼠标滚轮缩放（粗）',
        displaySettings: '显示设置',
        moveChildrenWithParent: '子节点随父节点一起移动',
        errorParseFailed: '解析文件失败',
        errorInvalidFile: '请上传 .dot 文件',
        errorReadFailed: '文件读取失败',
        resetViewShortcut: '视角重置 (R)',
        resetViewText: '视角重置',
        language: '语言',
        zh: '中文',
        en: 'English'
    },
    en: {
        title: 'Behavior Tree Visualization System',
        fileOperation: 'File Operation',
        selectDotFile: 'Select .dot File',
        viewControl: 'View Control',
        resetView: 'Reset View',
        saveOptions: 'Save Options',
        saveSVG: 'Save SVG',
        savePNG: 'Save PNG',
        instructions: 'Instructions',
        dragNodes: 'Nodes support drag and drop',
        panView: 'Left click to pan view',
        zoomWheel: 'Mouse wheel zoom (fine)',
        zoomCtrlWheel: 'Ctrl+Mouse wheel zoom (coarse)',
        displaySettings: 'Display Settings',
        moveChildrenWithParent: 'Move children with parent',
        errorParseFailed: 'Failed to parse file',
        errorInvalidFile: 'Please upload .dot file',
        errorReadFailed: 'Failed to read file',
        resetViewShortcut: 'Reset View (R)',
        resetViewText: 'Reset View',
        language: 'Language',
        zh: 'Chinese',
        en: 'English'
    }
};

let currentLang = 'zh';

export function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        updateUI();
    }
}

export function getLanguage() {
    return currentLang;
}

export function getTranslation(key) {
    return translations[currentLang][key] || key;
}

export function updateUI() {
    // Update text content for elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation) {
            element.textContent = translation;
        }
    });

    // Update title
    document.title = getTranslation('title');
}

export function initLanguage() {
    // Check localStorage for saved language
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    } else {
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en')) {
            currentLang = 'en';
        } else {
            currentLang = 'zh';
        }
    }
    
    updateUI();
    
    // Set language selector value
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLang;
    }
}

export function setupLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
}

export default { setLanguage, getLanguage, getTranslation, updateUI, initLanguage, setupLanguageSelector };
