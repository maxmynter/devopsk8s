"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
function generateRandomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomPosition = Math.floor(Math.random() * charset.length);
        randomString += charset.substring(randomPosition, randomPosition + 1);
    }
    return randomString;
}
const server = http.createServer((req, res) => {
    if (req.url === '/status') {
        const currentTimestamp = new Date().toISOString();
        const randomString = generateRandomString(36);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<html><body><p> Timestamp: ${currentTimestamp}</p><p> Random String: ${randomString} </p></body></html>`);
    }
    else {
        res.writeHead(404);
        res.end();
    }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`); });
