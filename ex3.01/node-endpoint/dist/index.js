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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const PORT = process.env.PORT ? +process.env.PORT : 3000;
const pingpongPort = 3001;
const pingpongEndpoint = `http://pingpong-svc:${pingpongPort}/pingpong`;
const infoTxtPath = "/etc/config/information.txt";
const getPongCount = () => new Promise((resolve, reject) => {
    http.get(pingpongEndpoint, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            resolve(data);
        });
    }).on('error', (err) => {
        console.log(`Error getting pongs: ${err}`);
        reject(new Error());
    });
});
function getMessageFromTxt(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            (0, fs_1.readFile)(filepath, 'utf-8', (err, data) => {
                if (err) {
                    console.log(`Error reading from ${filepath}, error: ${err}`);
                    reject(new Error(`Failed to read textfile ${filepath}, error: ${err}`));
                }
                else {
                    resolve(data);
                }
            });
        });
    });
}
const server = http.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.url === '/' && req.method == 'GET') {
        try {
            const timestamp = Math.floor(Date.now() / 1000); // In seconds
            const hash = (0, crypto_1.createHash)('sha256').update(String(timestamp)).digest('hex');
            let pongcount = yield getPongCount();
            let infoContent = yield getMessageFromTxt(infoTxtPath);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`<html><body><p> Timestamp: ${timestamp}</p><p> Random String: ${hash} </p><p>Pong: ${pongcount}</p><br/><span>${infoContent}</span><span> Message:${process.env.MESSAGE || 'Did not get MESSAGE'}</body></html>`);
        }
        catch (error) {
            console.log(`Error: ${error}`);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server error");
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
}));
server.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`); });
