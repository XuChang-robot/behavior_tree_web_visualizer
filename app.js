// 全局变量
let svg, simulation, link, node;
let graphData = { nodes: [], links: [] };

// 初始化函数
function init() {
    setupFileUpload();
    setupSaveButtons();
    // 直接加载示例文件进行测试
    loadSampleFile();
}

// 加载示例文件
function loadSampleFile() {
    // 直接嵌入示例文件内容，避免CORS问题
    const sampleContent = `digraph pastafarianism {
    graph [fontname="SimHei,Microsoft YaHei,Heiti TC,WenQuanYi Micro Hei,sans-serif"];
    node [fontname="SimHei,Microsoft YaHei,Heiti TC,WenQuanYi Micro Hei,sans-serif"];
    edge [fontname="SimHei,Microsoft YaHei,Heiti TC,WenQuanYi Micro Hei,sans-serif"];
ordering=out;
创建天气数据记录系统 [label="Ⓜ 创建天气数据记录系统", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
准备工作 [label="Ⓜ 准备工作", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
创建天气数据记录系统 -> 准备工作;
创建主目录 [label=创建主目录, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
准备工作 -> 创建主目录;
创建当前天气目录 [label=创建当前天气目录, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
准备工作 -> 创建当前天气目录;
创建天气预报目录 [label=创建天气预报目录, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
准备工作 -> 创建天气预报目录;
创建天气报告目录 [label=创建天气报告目录, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
准备工作 -> 创建天气报告目录;
并行天气查询 [label="⚡ 并行天气查询\nSuccessOnAll", shape=parallelogram, style=filled, fillcolor=gold, fontsize=9, fontcolor=black];
创建天气数据记录系统 -> 并行天气查询;
查询当前IP天气 [label="Ⓜ 查询当前IP天气", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
并行天气查询 -> 查询当前IP天气;
查询IP天气 [label=查询IP天气, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询当前IP天气 -> 查询IP天气;
保存IP天气数据 [label=保存IP天气数据, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询当前IP天气 -> 保存IP天气数据;
查询国内城市天气 [label="Ⓜ 查询国内城市天气", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
并行天气查询 -> 查询国内城市天气;
查询北京天气 [label="Ⓜ 查询北京天气", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
查询国内城市天气 -> 查询北京天气;
"查询北京天气*" [label="查询北京天气*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询北京天气 -> "查询北京天气*";
保存北京天气数据 [label=保存北京天气数据, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询北京天气 -> 保存北京天气数据;
查询上海天气 [label="Ⓜ 查询上海天气", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
查询国内城市天气 -> 查询上海天气;
"查询上海天气*" [label="查询上海天气*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询上海天气 -> "查询上海天气*";
保存上海天气数据 [label=保存上海天气数据, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询上海天气 -> 保存上海天气数据;
查询广州天气 [label="Ⓜ 查询广州天气", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
查询国内城市天气 -> 查询广州天气;
"查询广州天气*" [label="查询广州天气*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询广州天气 -> "查询广州天气*";
保存广州天气数据 [label=保存广州天气数据, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询广州天气 -> 保存广州天气数据;
查询深圳天气 [label="Ⓜ 查询深圳天气", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
查询国内城市天气 -> 查询深圳天气;
"查询深圳天气*" [label="查询深圳天气*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询深圳天气 -> "查询深圳天气*";
保存深圳天气数据 [label=保存深圳天气数据, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询深圳天气 -> 保存深圳天气数据;
查询国外城市天气 [label="Ⓜ 查询国外城市天气", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
并行天气查询 -> 查询国外城市天气;
查询纽约天气 [label="Ⓜ 查询纽约天气", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
查询国外城市天气 -> 查询纽约天气;
"查询纽约天气*" [label="查询纽约天气*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询纽约天气 -> "查询纽约天气*";
保存纽约天气数据 [label=保存纽约天气数据, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询纽约天气 -> 保存纽约天气数据;
查询伦敦天气 [label="Ⓜ 查询伦敦天气", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
查询国外城市天气 -> 查询伦敦天气;
"查询伦敦天气*" [label="查询伦敦天气*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询伦敦天气 -> "查询伦敦天气*";
保存伦敦天气数据 [label=保存伦敦天气数据, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询伦敦天气 -> 保存伦敦天气数据;
查询东京天气 [label="Ⓜ 查询东京天气", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
查询国外城市天气 -> 查询东京天气;
"查询东京天气*" [label="查询东京天气*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询东京天气 -> "查询东京天气*";
保存东京天气数据 [label=保存东京天气数据, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
查询东京天气 -> 保存东京天气数据;
数据记录 [label="Ⓜ 数据记录", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
创建天气数据记录系统 -> 数据记录;
"保存IP天气数据*" [label="保存IP天气数据*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
数据记录 -> "保存IP天气数据*";
"保存北京天气数据*" [label="保存北京天气数据*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
数据记录 -> "保存北京天气数据*";
"保存上海天气数据*" [label="保存上海天气数据*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
数据记录 -> "保存上海天气数据*";
"保存广州天气数据*" [label="保存广州天气数据*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
数据记录 -> "保存广州天气数据*";
"保存深圳天气数据*" [label="保存深圳天气数据*", shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
数据记录 -> "保存深圳天气数据*";
保存国外城市天气数据 [label=保存国外城市天气数据, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
数据记录 -> 保存国外城市天气数据;
报告生成 [label="Ⓜ 报告生成", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
创建天气数据记录系统 -> 报告生成;
生成详细天气报告 [label=生成详细天气报告, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
报告生成 -> 生成详细天气报告;
生成简洁天气摘要 [label=生成简洁天气摘要, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
报告生成 -> 生成简洁天气摘要;
验证和清理 [label="Ⓜ 验证和清理", shape=box, style=filled, fillcolor=orange, fontsize=9, fontcolor=black];
创建天气数据记录系统 -> 验证和清理;
验证文件创建 [label=验证文件创建, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
验证和清理 -> 验证文件创建;
生成任务完成报告 [label=生成任务完成报告, shape=ellipse, style=filled, fillcolor=gray, fontsize=9, fontcolor=black];
验证和清理 -> 生成任务完成报告;
}`;
    
    console.log('使用嵌入式示例文件内容');
    try {
        parseDotFile(sampleContent);
        visualizeTree();
    } catch (error) {
        console.error('加载示例文件失败:', error);
        document.getElementById('error-message').textContent = '加载示例文件失败: ' + error.message;
    }
}

// 设置文件上传功能
function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const errorMessage = document.getElementById('error-message');

    // 拖拽功能
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.classList.add('drag-over');
    }

    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }

    uploadArea.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }

    function processFile(file) {
        if (file.name.endsWith('.dot')) {
            errorMessage.textContent = '';
            const loading = document.getElementById('loading');
            loading.style.display = 'block';
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                try {
                    parseDotFile(content);
                    visualizeTree();
                } catch (error) {
                    errorMessage.textContent = '解析文件失败: ' + error.message;
                } finally {
                    loading.style.display = 'none';
                }
            };
            reader.onerror = function() {
                errorMessage.textContent = '文件读取失败';
                loading.style.display = 'none';
            };
            reader.readAsText(file);
        } else {
            errorMessage.textContent = '请上传 .dot 文件';
        }
    }
}

// 解析 .dot 文件
function parseDotFile(content) {
    try {
        const nodes = [];
        const links = [];
        const nodeMap = new Map();

        // 处理跨行的属性值（将断开的行合并）
        let processedContent = content;
        let prevLength = 0;
        while (processedContent.length !== prevLength) {
            prevLength = processedContent.length;
            // 匹配以 [ 开头但没有以 ] 结尾的行，与下一行合并
            processedContent = processedContent.replace(/(\[[^\]]*)\n([^\[]*\])/g, '$1$2');
        }

        // 提取节点和连接
        const lines = processedContent.split('\n');
        let nodeId = 0;

        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // 跳过空行、注释和graph定义
            if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('#') || trimmedLine.startsWith('digraph') || trimmedLine.startsWith('graph') || trimmedLine.startsWith('}') || trimmedLine.startsWith('graph [') || trimmedLine.startsWith('node [') || trimmedLine.startsWith('edge [') || trimmedLine === 'ordering=out;') {
                continue;
            }

            // 处理节点定义
            if (trimmedLine.includes('[label=')) {
                // 处理节点名（可能带引号或空格）
                let nodeName, rest;
                
                // 处理带引号的节点名
                if (trimmedLine.startsWith('"')) {
                    const quoteEnd = trimmedLine.indexOf('"', 1);
                    if (quoteEnd !== -1) {
                        nodeName = trimmedLine.substring(1, quoteEnd);
                        rest = trimmedLine.substring(quoteEnd + 1);
                    }
                } 
                // 处理不带引号的节点名（可能包含中文）
                else {
                    const bracketIndex = trimmedLine.indexOf('[');
                    if (bracketIndex !== -1) {
                        nodeName = trimmedLine.substring(0, bracketIndex).trim();
                        rest = trimmedLine.substring(bracketIndex);
                    }
                }

                if (nodeName && rest) {
                    // 提取标签（处理带引号的值，可能包含转义字符）
                    const labelMatch = rest.match(/label="([^"]*)"/);
                    const labelMatch2 = rest.match(/label=([^,\]]+)/);
                    let label = nodeName;
                    if (labelMatch) {
                        label = labelMatch[1].replace(/\\n/g, '\n'); // 处理换行符转义
                    } else if (labelMatch2) {
                        label = labelMatch2[1].replace(/"/g, '');
                    }
                    
                    // 提取其他属性
                    const shapeMatch = rest.match(/shape=(["']?)([^"',\]]+)\1/);
                    const styleMatch = rest.match(/style=(["']?)([^"',\]]+)\1/);
                    const colorMatch = rest.match(/fillcolor=(["']?)([^"',\]]+)\1/);
                    const colorMatch2 = rest.match(/color=(["']?)([^"',\]]+)\1/);
                    
                    // 处理颜色，优先使用fillcolor，然后是color
                    let nodeColor = 'gray';
                    if (colorMatch) {
                        nodeColor = colorMatch[2];
                    } else if (colorMatch2) {
                        nodeColor = colorMatch2[2];
                    }
                    
                    // 处理形状
                    let nodeShape = 'rectangle';
                    if (shapeMatch) {
                        nodeShape = shapeMatch[2];
                    }
                    
                    // 输出调试信息
                    console.log('Node:', nodeName, 'Shape:', nodeShape, 'Label:', label);
                    
                    const node = {
                        id: nodeId++,
                        name: nodeName,
                        label: label,
                        shape: nodeShape,
                        style: styleMatch ? styleMatch[2] : '',
                        color: nodeColor
                    };
                    
                    nodes.push(node);
                    nodeMap.set(nodeName, node.id);
                }
            }
            
            // 处理连接
            else if (trimmedLine.includes('->')) {
                // 处理带引号的节点名
                let sourceName, targetName;
                const arrowIndex = trimmedLine.indexOf('->');
                
                if (arrowIndex !== -1) {
                    const sourcePart = trimmedLine.substring(0, arrowIndex).trim();
                    const targetPart = trimmedLine.substring(arrowIndex + 2).trim().replace(';', '');
                    
                    // 处理带引号的源节点
                    if (sourcePart.startsWith('"')) {
                        const quoteEnd = sourcePart.indexOf('"', 1);
                        if (quoteEnd !== -1) {
                            sourceName = sourcePart.substring(1, quoteEnd);
                        }
                    } else {
                        sourceName = sourcePart;
                    }
                    
                    // 处理带引号的目标节点
                    if (targetPart.startsWith('"')) {
                        const quoteEnd = targetPart.indexOf('"', 1);
                        if (quoteEnd !== -1) {
                            targetName = targetPart.substring(1, quoteEnd);
                        }
                    } else {
                        targetName = targetPart;
                    }
                    
                    // 确保节点存在
                    if (sourceName && !nodeMap.has(sourceName)) {
                        const node = {
                            id: nodeId++,
                            name: sourceName,
                            label: sourceName,
                            shape: 'ellipse',
                            style: '',
                            color: 'gray'
                        };
                        nodes.push(node);
                        nodeMap.set(sourceName, node.id);
                    }
                    
                    if (targetName && !nodeMap.has(targetName)) {
                        const node = {
                            id: nodeId++,
                            name: targetName,
                            label: targetName,
                            shape: 'ellipse',
                            style: '',
                            color: 'gray'
                        };
                        nodes.push(node);
                        nodeMap.set(targetName, node.id);
                    }
                    
                    if (sourceName && targetName) {
                        links.push({
                            source: nodeMap.get(sourceName),
                            target: nodeMap.get(targetName)
                        });
                    }
                }
            }
        }

        graphData = { nodes, links };
        console.log('解析结果:', graphData);
    } catch (error) {
        console.error('解析错误:', error);
        throw error;
    }
}

// 构建树结构
function buildTreeStructure(nodes, links) {
    try {
        const nodeMap = new Map();
        
        // 为每个节点添加children属性
        nodes.forEach(node => {
            node.children = [];
            nodeMap.set(node.id, node);
        });
        
        // 构建父子关系
        links.forEach(link => {
            const source = nodeMap.get(link.source);
            const target = nodeMap.get(link.target);
            if (source && target) {
                source.children.push(target);
            }
        });
        
        // 找到根节点（没有父节点的节点）
        let rootNode = null;
        for (const node of nodes) {
            const hasParent = links.some(link => link.target === node.id);
            if (!hasParent) {
                rootNode = nodeMap.get(node.id);
                break;
            }
        }
        
        // 如果没有找到根节点，返回第一个节点
        if (!rootNode && nodes.length > 0) {
            rootNode = nodeMap.get(nodes[0].id);
        }
        
        console.log('根节点:', rootNode);
        return rootNode;
    } catch (error) {
        console.error('构建树结构错误:', error);
        return null;
    }
}

// 可视化行为树（带锚点）
function visualizeTree() {
    try {
        const container = document.getElementById('tree-container');
        let width = container.clientWidth;
        let height = container.clientHeight;

        // 清除之前的内容
        d3.select('#tree-container').selectAll('*').remove();

        // 检查数据
        if (!graphData || graphData.nodes.length === 0) {
            console.error('没有数据可可视化');
            return;
        }

        // 构建树结构用于布局
        const root = buildTreeStructure(graphData.nodes, graphData.links);
        
        // 计算节点大小
        graphData.nodes.forEach(node => {
            // 更准确的文字宽度计算
            const label = node.label || '';
            // 使用更精确的字符宽度计算
            // 中文字符和全角字符每个占12px，英文字符和半角字符每个占6px
            let textWidth = 0;
            for (let i = 0; i < label.length; i++) {
                const charCode = label.charCodeAt(i);
                if (charCode > 127 || (charCode >= 0xFF00 && charCode <= 0xFFEF)) {
                    // 中文字符或全角字符
                    textWidth += 12;
                } else {
                    // 英文字符或半角字符
                    textWidth += 6;
                }
            }
            // 加上左右边距（增加外扩距离）
            let extraWidth = 60; // 基础边距
            // 平行四边形需要额外的宽度，因为倾斜会占用空间
            if (node.shape === 'parallelogram') {
                extraWidth += 60; // 额外增加60px用于倾斜部分
            }
            node.width = Math.max(100, textWidth + extraWidth);
            node.height = 50;
        });
        
        // 计算初始布局 - 使用更智能的树布局算法
        function calculateLayout() {
            if (!root) {
                // 如果没有根节点，使用网格布局
                const cols = 3;
                graphData.nodes.forEach((node, index) => {
                    const col = index % cols;
                    const row = Math.floor(index / cols);
                    node.x = 100 + col * 300;
                    node.y = 100 + row * 150;
                });
                return;
            }
            
            // 使用层级布局，逐层放置节点
            const levels = [];
            
            // 按层级分组节点
            function groupNodesByLevel(node, level = 0) {
                if (!levels[level]) {
                    levels[level] = [];
                }
                levels[level].push(node);
                
                if (node.children && node.children.length > 0) {
                    node.children.forEach(child => {
                        groupNodesByLevel(child, level + 1);
                    });
                }
            }
            
            groupNodesByLevel(root);
            
            // 使用自底向上的方式计算节点位置
            // 首先，按层级从下到上计算每个子树的宽度
            function calculateSubtreeWidth(node) {
                const nodeObj = graphData.nodes.find(n => n.id === node.id);
                if (!nodeObj) return 0;
                
                if (!node.children || node.children.length === 0) {
                    // 叶节点，宽度就是节点自身宽度
                    nodeObj.subtreeWidth = nodeObj.width;
                    return nodeObj.width;
                }
                
                // 计算所有子节点的子树宽度
                let childrenWidth = 0;
                node.children.forEach(child => {
                    childrenWidth += calculateSubtreeWidth(child);
                });
                childrenWidth += (node.children.length - 1) * 50; // 节点间距
                
                // 当前节点的子树宽度是子节点总宽度和自身宽度的最大值
                nodeObj.subtreeWidth = Math.max(nodeObj.width, childrenWidth);
                return nodeObj.subtreeWidth;
            }
            
            // 计算所有子树的宽度
            calculateSubtreeWidth(root);
            
            // 然后，按层级从上到下计算每个节点的位置
            function calculateNodePosition(node, startX, level = 0) {
                const nodeObj = graphData.nodes.find(n => n.id === node.id);
                if (!nodeObj) return;
                
                // 设置Y坐标
                nodeObj.y = 100 + level * 150;
                
                if (!node.children || node.children.length === 0) {
                    // 叶节点，直接放置
                    nodeObj.x = startX + nodeObj.width / 2;
                    return;
                }
                
                // 计算子节点的起始位置（以当前节点为中心）
                let currentChildX = startX;
                node.children.forEach(child => {
                    const childObj = graphData.nodes.find(n => n.id === child.id);
                    if (childObj) {
                        // 递归计算子节点位置
                        calculateNodePosition(child, currentChildX, level + 1);
                        // 更新下一个子节点的起始位置
                        currentChildX += childObj.subtreeWidth + 50;
                    }
                });
                
                // 将当前节点放在子节点的中心
                const firstChild = node.children[0];
                const firstChildObj = graphData.nodes.find(n => n.id === firstChild.id);
                const lastChild = node.children[node.children.length - 1];
                const lastChildObj = graphData.nodes.find(n => n.id === lastChild.id);
                
                if (firstChildObj && lastChildObj) {
                    nodeObj.x = (firstChildObj.x + lastChildObj.x) / 2;
                } else {
                    nodeObj.x = startX + nodeObj.width / 2;
                }
            }
            
            // 计算根节点的起始位置（居中）
            const rootObj = graphData.nodes.find(n => n.id === root.id);
            if (rootObj) {
                const rootStartX = (width - rootObj.subtreeWidth) / 2;
                calculateNodePosition(root, rootStartX);
            }
        }
        
        // 执行布局计算，使用容器的实际大小
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // 调整布局参数
        width = containerWidth;
        height = containerHeight;
        
        // 执行布局计算
        calculateLayout();

        // 创建SVG，使用容器的实际大小
        const svg = d3.select('#tree-container')
            .append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight);

        // 创建一个g元素用于缩放
        const g = svg.append('g');

        // 添加缩放和平移功能
        let isZooming = false;
        
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('start', (event) => {
                console.log('Zoom start - scale:', event.transform.k);
            })
            .on('zoom', (event) => {
                console.log('Zoom - scale:', event.transform.k);
                // 应用变换，允许平移和缩放
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // 创建连接线组（放在节点组下面，这样连接线会在节点后面）
        const linkGroup = g.append('g')
            .attr('class', 'links');

        // 创建节点组
        const nodeGroup = g.append('g')
            .attr('class', 'nodes');

        // 创建节点
        const nodeElements = nodeGroup.selectAll('.node')
            .data(graphData.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        // 添加节点形状
        nodeElements.each(function(d) {
            const element = d3.select(this);
            const shape = d.shape || 'rectangle';
            const width = d.width;
            const height = d.height;
            const color = d.color || 'gray';
            
            if (shape === 'ellipse' || shape === 'circle') {
                // 绘制椭圆
                element.append('ellipse')
                    .attr('rx', width / 2)
                    .attr('ry', height / 2)
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('fill', color)
                    .attr('stroke', '#333')
                    .attr('stroke-width', 1);
            } else if (shape === 'diamond') {
                // 绘制菱形
                const points = [
                    0, -height/2,
                    width/2, 0,
                    0, height/2,
                    -width/2, 0
                ];
                element.append('polygon')
                    .attr('points', points.join(','))
                    .attr('fill', color)
                    .attr('stroke', '#333')
                    .attr('stroke-width', 1);
            } else if (shape === 'parallelogram') {
                // 绘制平行四边形
                const skew = 30; // 倾斜角度
                const points = [
                    -width/2 + skew, -height/2,
                    width/2 + skew, -height/2,
                    width/2 - skew, height/2,
                    -width/2 - skew, height/2
                ];
                element.append('polygon')
                    .attr('points', points.join(','))
                    .attr('fill', color)
                    .attr('stroke', '#333')
                    .attr('stroke-width', 1);
            } else if (shape === 'box') {
                // 绘制矩形
                element.append('rect')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('x', -width / 2)
                    .attr('y', -height / 2)
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .attr('fill', color)
                    .attr('stroke', '#333')
                    .attr('stroke-width', 1);
            } else {
                // 默认绘制矩形
                element.append('rect')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('x', -width / 2)
                    .attr('y', -height / 2)
                    .attr('rx', 5)
                    .attr('ry', 5)
                    .attr('fill', color)
                    .attr('stroke', '#333')
                    .attr('stroke-width', 1);
            }
        });

        // 添加节点标签
        nodeElements.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('fill', '#333')
            .text(d => d.label || '');

        // 添加锚点
        nodeElements.each(function(d) {
            const element = d3.select(this);
            const isRoot = !graphData.links.some(link => link.target === d.id);
            const isLeaf = !graphData.links.some(link => link.source === d.id);
            
            // 只有非根节点才添加顶部锚点
            if (!isRoot) {
                element.append('circle')
                    .attr('class', 'anchor top-anchor')
                    .attr('r', 5)
                    .attr('cx', 0)
                    .attr('cy', -d.height / 2)
                    .attr('fill', '#4CAF50')
                    .attr('stroke', '#333')
                    .attr('stroke-width', 1);
            }
            
            // 只有非叶节点才添加底部锚点
            if (!isLeaf) {
                element.append('circle')
                    .attr('class', 'anchor bottom-anchor')
                    .attr('r', 5)
                    .attr('cx', 0)
                    .attr('cy', d.height / 2)
                    .attr('fill', '#2196F3')
                    .attr('stroke', '#333')
                    .attr('stroke-width', 1);
            }
        });

        // 创建连接线
        setTimeout(() => {
            updateLinks();
        }, 100);

        // 保存引用
        window.svg = svg;
        window.nodeElements = nodeElements;
        window.linkGroup = linkGroup;
        window.zoom = zoom;
        
        // 延迟执行自动缩放，确保容器尺寸和节点布局都已完成
        setTimeout(() => {
            autoZoom(svg, g, zoom);
        }, 100);
    
    // 自动调整缩放函数
    function autoZoom(svg, g, zoom) {
        if (!graphData || graphData.nodes.length === 0) return;
        
        // 计算所有节点的边界
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        graphData.nodes.forEach(node => {
            const nodeLeft = node.x - node.width / 2 - 40; // 增加更大的缓冲区
            const nodeRight = node.x + node.width / 2 + 40;
            const nodeTop = node.y - node.height / 2 - 40;
            const nodeBottom = node.y + node.height / 2 + 40;
            
            minX = Math.min(minX, nodeLeft);
            minY = Math.min(minY, nodeTop);
            maxX = Math.max(maxX, nodeRight);
            maxY = Math.max(maxY, nodeBottom);
        });
        
        // 计算行为树的宽度和高度
        const treeWidth = maxX - minX;
        const treeHeight = maxY - minY;
        
        // 获取容器大小
        const containerEl = document.getElementById('tree-container');
        const containerWidth = containerEl.clientWidth;
        const containerHeight = containerEl.clientHeight;
        
        // 计算缩放比例
        const scaleX = containerWidth / treeWidth;
        const scaleY = containerHeight / treeHeight;
        const scale = Math.min(scaleX, scaleY, 1); // 最大缩放为1
        
        console.log('AutoZoom scale:', scale);
        console.log('Tree size:', treeWidth, 'x', treeHeight);
        console.log('Container size:', containerWidth, 'x', containerHeight);
        
        // 计算偏移量，使行为树居中
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const translateX = containerWidth / 2 - centerX * scale;
        const translateY = containerHeight / 2 - centerY * scale;
        
        // 应用缩放和偏移，并更新zoom行为的内部状态
        const transform = d3.zoomIdentity
            .translate(translateX, translateY)
            .scale(scale);
        
        // 更新g元素的transform
        g.attr('transform', transform);
        
        // 强制更新zoom行为的内部状态，确保缩放时不会跳跃
        svg.transition().duration(0).call(zoom.transform, transform);
    }
    
    console.log('可视化完成');

    } catch (error) {
        console.error('可视化错误:', error);
        document.getElementById('error-message').textContent = '可视化错误: ' + error.message;
    }
}

// 更新连接线
function updateLinks() {
    if (!window.linkGroup || !graphData) return;

    // 清除旧连接
    window.linkGroup.selectAll('path').remove();

    // 创建新连接
    const links = window.linkGroup.selectAll('path')
        .data(graphData.links)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', d => {
            const targetNode = graphData.nodes.find(n => n.id === d.target);
            return targetNode ? targetNode.color : '#666';
        })
        .attr('stroke-opacity', 0.8)
        .attr('stroke-width', 3)
        .attr('marker-end', 'url(#arrowhead)');

    // 定义箭头标记
        if (!window.svg.select('#arrowhead').node()) {
            window.svg.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '0 -2.5 5 5')
                .attr('refX', 5)
                .attr('refY', 0)
                .attr('markerWidth', 3)
                .attr('markerHeight', 3)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-2.5L5,0L0,2.5')
                .attr('fill', '#666');
        }

    // 更新连接路径
    links.attr('d', (d, i) => {
        const sourceNode = graphData.nodes.find(n => n.id === d.source);
        const targetNode = graphData.nodes.find(n => n.id === d.target);
        
        if (!sourceNode || !targetNode) return '';

        // 计算锚点位置
        // 源节点底部锚点（从锚点出发）
        const sourceX = sourceNode.x;
        const sourceY = sourceNode.y + sourceNode.height / 2;
        
        // 目标节点顶部锚点（从锚点出发）
        const targetX = targetNode.x;
        const targetY = targetNode.y - targetNode.height / 2;
        
        // 直接使用节点的位置和锚点的偏移量
        console.log('Source anchor position:', sourceX, sourceY);
        console.log('Target anchor position:', targetX, targetY);
        
        // 验证锚点位置
        console.log('Node position:', sourceNode.x, sourceNode.y);
        console.log('Node size:', sourceNode.width, sourceNode.height);
        console.log('Calculated source anchor:', sourceX, sourceY);
        console.log('Calculated target anchor:', targetX, targetY);
        
        // 确保连接线从锚点出发
        console.log('Source anchor:', sourceX, sourceY);
        console.log('Target anchor:', targetX, targetY);
        
        // 计算距离和方向
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 检查连接线是否与其他节点碰撞
        let hasNodeCollision = false;
        let collisionNode = null;
        
        graphData.nodes.forEach(node => {
            if (node.id === sourceNode.id || node.id === targetNode.id) return;
            
            const nodeRect = {
                x: node.x - node.width / 2 - 10, // 增加一些缓冲区
                y: node.y - node.height / 2 - 10,
                width: node.width + 20,
                height: node.height + 20
            };
            
            if (lineRectCollision(sourceX, sourceY, targetX, targetY, nodeRect)) {
                hasNodeCollision = true;
                collisionNode = node;
            }
        });
        
        // 检查连接线是否与其他连接线碰撞
        let hasLinkCollision = false;
        let collisionLinks = [];
        
        graphData.links.forEach((otherLink, j) => {
            if (i === j) return; // 跳过自己
            
            const otherSourceNode = graphData.nodes.find(n => n.id === otherLink.source);
            const otherTargetNode = graphData.nodes.find(n => n.id === otherLink.target);
            
            if (!otherSourceNode || !otherTargetNode) return;
            
            const otherSourceX = otherSourceNode.x;
            const otherSourceY = otherSourceNode.y + otherSourceNode.height / 2;
            const otherTargetX = otherTargetNode.x;
            const otherTargetY = otherTargetNode.y - otherTargetNode.height / 2;
            
            // 检查两条线段是否相交
            if (lineLineCollision(sourceX, sourceY, targetX, targetY, otherSourceX, otherSourceY, otherTargetX, otherTargetY)) {
                hasLinkCollision = true;
                collisionLinks.push(otherLink);
            }
        });
        
        // 创建贝塞尔曲线
        let path;
        // 无论是否有碰撞，都确保连接线从锚点出发
        // 源端控制点：向右下方偏移
        const controlPoint1X = sourceX + dx * 0.3;
        const controlPoint1Y = sourceY + 80;
        // 目标端控制点：向左上方偏移
        const controlPoint2X = targetX - dx * 0.3;
        const controlPoint2Y = targetY - 80;
        
        path = `M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${targetX} ${targetY}`;
        
        return path;
    });
    
    console.log('可视化完成');
}

// 拖拽功能
function dragstarted(event, d) {
    if (d) {
        d.fx = d.x;
        d.fy = d.y;
    }
}

function dragged(event, d) {
    if (d) {
        const moveChildrenWithParent = document.getElementById('move-children-with-parent').checked;
        
        if (moveChildrenWithParent) {
            // 计算位移量
            const dx = event.x - d.x;
            const dy = event.y - d.y;
            
            // 移动当前节点
            d.fx = event.x;
            d.fy = event.y;
            d.x = event.x;
            d.y = event.y;
            d3.select(this).attr('transform', `translate(${event.x},${event.y})`);
            
            // 递归移动所有子节点
            function moveChildren(node, dx, dy) {
                const nodeObj = graphData.nodes.find(n => n.id === node.id);
                if (!nodeObj) return;
                
                // 移动子节点
                nodeObj.x += dx;
                nodeObj.y += dy;
                
                // 更新子节点的DOM位置
                const childElement = window.nodeElements.filter(n => n.id === node.id);
                childElement.attr('transform', `translate(${nodeObj.x},${nodeObj.y})`);
                
                // 递归移动子节点的子节点
                if (node.children && node.children.length > 0) {
                    node.children.forEach(child => {
                        moveChildren(child, dx, dy);
                    });
                }
            }
            
            // 移动所有子节点
            if (d.children && d.children.length > 0) {
                d.children.forEach(child => {
                    moveChildren(child, dx, dy);
                });
            }
        } else {
            // 不移动子节点，只移动当前节点
            d.fx = event.x;
            d.fy = event.y;
            // 更新节点位置
            d3.select(this).attr('transform', `translate(${event.x},${event.y})`);
            // 实时更新连接线
            d.x = event.x;
            d.y = event.y;
        }
        
        // 更新连接线
        updateLinks();
    }
}

function dragended(event, d) {
    if (d) {
        d.x = d.fx;
        d.y = d.fy;
        d.fx = null;
        d.fy = null;
        
        // 只有当选项未启用时才进行碰撞检测
        const moveChildrenWithParent = document.getElementById('move-children-with-parent').checked;
        if (!moveChildrenWithParent) {
            // 碰撞检测和自动布局
            detectCollisions(d);
        }
        
        // 更新连接线
        updateLinks();
    }
}

// 碰撞检测和自动布局
function detectCollisions(movedNode) {
    const collisionDistance = 10; // 碰撞检测的距离阈值
    const processedNodes = new Set(); // 记录已处理的节点
    
    // 递归检测碰撞
    function processCollisions(node) {
        if (processedNodes.has(node.id)) return; // 避免重复处理
        processedNodes.add(node.id);
        
        const nodeRect = {
            x: node.x - node.width / 2,
            y: node.y - node.height / 2,
            width: node.width,
            height: node.height
        };
        
        // 检测与其他节点的碰撞
        graphData.nodes.forEach(otherNode => {
            if (otherNode.id === node.id || processedNodes.has(otherNode.id)) return;
            
            const otherRect = {
                x: otherNode.x - otherNode.width / 2,
                y: otherNode.y - otherNode.height / 2,
                width: otherNode.width,
                height: otherNode.height
            };
            
            // 检测碰撞
            if (isColliding(nodeRect, otherRect, collisionDistance)) {
                // 计算新位置
                const newPosition = findNewPosition(otherNode, node);
                otherNode.x = newPosition.x;
                otherNode.y = newPosition.y;
                
                // 更新节点在DOM中的位置
                d3.selectAll('.node')
                    .filter(d => d.id === otherNode.id)
                    .attr('transform', `translate(${otherNode.x},${otherNode.y})`);
                
                // 递归处理被移动的节点，检查它是否与其他节点碰撞
                processCollisions(otherNode);
            }
        });
    }
    
    // 开始处理
    processCollisions(movedNode);
}

// 检测两个矩形是否碰撞
function isColliding(rect1, rect2, distance) {
    return !(
        rect1.x > rect2.x + rect2.width + distance ||
        rect1.x + rect1.width + distance < rect2.x ||
        rect1.y > rect2.y + rect2.height + distance ||
        rect1.y + rect1.height + distance < rect2.y
    );
}

// 检测线段与矩形是否碰撞
function lineRectCollision(x1, y1, x2, y2, rect) {
    // 检查线段是否与矩形的四条边相交
    return (
        lineLineCollision(x1, y1, x2, y2, rect.x, rect.y, rect.x + rect.width, rect.y) ||
        lineLineCollision(x1, y1, x2, y2, rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height) ||
        lineLineCollision(x1, y1, x2, y2, rect.x + rect.width, rect.y + rect.height, rect.x, rect.y + rect.height) ||
        lineLineCollision(x1, y1, x2, y2, rect.x, rect.y + rect.height, rect.x, rect.y) ||
        // 检查线段是否完全在矩形内部
        (x1 >= rect.x && x1 <= rect.x + rect.width && y1 >= rect.y && y1 <= rect.y + rect.height) ||
        (x2 >= rect.x && x2 <= rect.x + rect.width && y2 >= rect.y && y2 <= rect.y + rect.height)
    );
}

// 检测两条线段是否相交
function lineLineCollision(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return false;
    
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    
    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

// 为碰撞的节点找到新位置
function findNewPosition(node, movedNode) {
    // 计算移动节点的边界
    const movedLeft = movedNode.x - movedNode.width / 2;
    const movedRight = movedNode.x + movedNode.width / 2;
    const movedTop = movedNode.y - movedNode.height / 2;
    const movedBottom = movedNode.y + movedNode.height / 2;
    
    // 计算当前节点的边界
    const nodeLeft = node.x - node.width / 2;
    const nodeRight = node.x + node.width / 2;
    const nodeTop = node.y - node.height / 2;
    const nodeBottom = node.y + node.height / 2;
    
    // 计算方向向量
    const dx = node.x - movedNode.x;
    const dy = node.y - movedNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 计算重叠距离
    let overlapX = 0;
    let overlapY = 0;
    
    if (dx > 0) {
        // 节点在移动节点的右侧
        overlapX = (movedRight + 10) - nodeLeft; // 10px 间隙
    } else if (dx < 0) {
        // 节点在移动节点的左侧
        overlapX = nodeRight - (movedLeft - 10);
    }
    
    if (dy > 0) {
        // 节点在移动节点的下方
        overlapY = (movedBottom + 10) - nodeTop;
    } else if (dy < 0) {
        // 节点在移动节点的上方
        overlapY = nodeBottom - (movedTop - 10);
    }
    
    // 计算需要移动的距离
    let moveDistance = 0;
    if (Math.abs(dx) > Math.abs(dy)) {
        // 主要在水平方向碰撞
        moveDistance = Math.abs(overlapX) + 10;
    } else {
        // 主要在垂直方向碰撞
        moveDistance = Math.abs(overlapY) + 10;
    }
    
    // 确保最小移动距离
    moveDistance = Math.max(moveDistance, 20);
    
    let newX, newY;
    
    if (distance === 0) {
        // 如果两个节点中心重合，随机选择一个方向
        const angle = Math.random() * Math.PI * 2;
        newX = node.x + Math.cos(angle) * moveDistance;
        newY = node.y + Math.sin(angle) * moveDistance;
    } else {
        // 沿远离移动节点的方向移动
        newX = node.x + (dx / distance) * moveDistance;
        newY = node.y + (dy / distance) * moveDistance;
    }
    
    return { x: newX, y: newY };
}

// 设置保存按钮
function setupSaveButtons() {
    document.getElementById('save-svg').addEventListener('click', saveAsSVG);
    document.getElementById('save-png').addEventListener('click', saveAsPNG);
}

// 计算整个树的边界
function calculateTreeBounds() {
    if (!graphData || graphData.nodes.length === 0) {
        return {
            minX: 0,
            minY: 0,
            maxX: 1000,
            maxY: 800
        };
    }
    
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    graphData.nodes.forEach(node => {
        const nodeLeft = node.x - node.width / 2 - 40; // 增加缓冲区
        const nodeRight = node.x + node.width / 2 + 40;
        const nodeTop = node.y - node.height / 2 - 40;
        const nodeBottom = node.y + node.height / 2 + 40;
        
        minX = Math.min(minX, nodeLeft);
        minY = Math.min(minY, nodeTop);
        maxX = Math.max(maxX, nodeRight);
        maxY = Math.max(maxY, nodeBottom);
    });
    
    return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
    };
}

// 保存为SVG
function saveAsSVG() {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;

    // 计算整个树的边界
    const bounds = calculateTreeBounds();
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    
    // 创建一个新的SVG元素，包含整个树
    const svgCopy = svgElement.cloneNode(true);
    
    // 设置SVG尺寸
    svgCopy.setAttribute('width', width);
    svgCopy.setAttribute('height', height);
    
    // 调整g元素的位置，使整个树居中
    const gElement = svgCopy.querySelector('g');
    if (gElement) {
        // 移除当前的transform
        gElement.setAttribute('transform', `translate(${-bounds.minX}, ${-bounds.minY})`);
    }

    const svgData = new XMLSerializer().serializeToString(svgCopy);
    const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'behavior_tree.svg';
    link.click();
    URL.revokeObjectURL(url);
}

// 保存为PNG
function saveAsPNG() {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;

    // 计算整个树的边界
    const bounds = calculateTreeBounds();
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    
    // 创建一个新的SVG元素，包含整个树
    const svgCopy = svgElement.cloneNode(true);
    
    // 设置SVG尺寸
    svgCopy.setAttribute('width', width);
    svgCopy.setAttribute('height', height);
    
    // 调整g元素的位置，使整个树居中
    const gElement = svgCopy.querySelector('g');
    if (gElement) {
        // 移除当前的transform
        gElement.setAttribute('transform', `translate(${-bounds.minX}, ${-bounds.minY})`);
    }

    const svgData = new XMLSerializer().serializeToString(svgCopy);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小为整个树的大小
    canvas.width = width;
    canvas.height = height;
    
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngData;
        link.download = 'behavior_tree.png';
        link.click();
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
}

// 初始化应用
window.onload = init;