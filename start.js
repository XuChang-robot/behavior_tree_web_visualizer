/**
 * 行为树可视化工具 - Node.js启动脚本
 * 无需Python，使用Node.js内置模块
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8000;
const ROOT_DIR = __dirname;

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.dot': 'text/plain'
};

// 创建服务器
const server = http.createServer((req, res) => {
    // 处理URL
    let url = req.url;
    if (url === '/') {
        url = '/index.html';
    }
    
    // 解码URL
    try {
        url = decodeURIComponent(url);
    } catch (e) {
        // URL解码失败，使用原始URL
    }
    
    // 构建文件路径
    const filePath = path.join(ROOT_DIR, url);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // 安全检查：确保文件在根目录内
    if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Forbidden');
        return;
    }
    
    // 读取文件
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('500 Internal Server Error');
            }
            return;
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

// 检查端口是否被占用
const net = require('net');
const checkPort = new Promise((resolve, reject) => {
    const tester = net.createServer()
        .once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false); // 端口被占用
            } else {
                reject(err);
            }
        })
        .once('listening', () => {
            tester.close();
            resolve(true); // 端口可用
        })
        .listen(PORT);
});

// 启动服务器
checkPort.then((available) => {
    if (!available) {
        console.log(`端口 ${PORT} 已被占用，尝试停止现有进程...`);
        
        // 尝试停止占用端口的进程
        const killCommand = process.platform === 'win32' 
            ? `for /f "tokens=5" %a in ('netstat -ano ^| findstr ":${PORT}" ^| findstr "LISTENING"') do taskkill /F /PID %a`
            : `lsof -ti:${PORT} | xargs kill -9`;
        
        exec(killCommand, (error) => {
            // 无论是否成功停止，都尝试启动
            setTimeout(() => {
                startServer();
            }, 1000);
        });
    } else {
        startServer();
    }
}).catch((err) => {
    console.error('检查端口时出错:', err);
    process.exit(1);
});

function startServer() {
    server.listen(PORT, () => {
        console.log('='.repeat(50));
        console.log('  行为树可视化工具 - 服务器已启动');
        console.log('='.repeat(50));
        console.log();
        console.log(`  访问地址: http://localhost:${PORT}`);
        console.log();
        console.log('  按 Ctrl+C 停止服务器');
        console.log();
        
        // 自动打开浏览器
        const openCommand = process.platform === 'win32' 
            ? `start http://localhost:${PORT}`
            : process.platform === 'darwin'
                ? `open http://localhost:${PORT}`
                : `xdg-open http://localhost:${PORT}`;
        
        exec(openCommand, (error) => {
            if (error) {
                console.log('  请手动在浏览器中打开上述地址');
            }
        });
    });
    
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`错误：端口 ${PORT} 已被占用`);
        } else {
            console.error('服务器错误:', err);
        }
        process.exit(1);
    });
}

// 处理退出信号
process.on('SIGINT', () => {
    console.log();
    console.log('正在停止服务器...');
    server.close(() => {
        console.log('服务器已停止');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    server.close(() => {
        process.exit(0);
    });
});
