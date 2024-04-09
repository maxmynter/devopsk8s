const http = require('http');
const https = require('https')
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path')

const hostname = '0.0.0.0';
const port = process.env.PORT || 4000;
const loadbalancerPortForwardFullAddress = 'http://localhost:3005/'

const updatedTimestampFilename = 'cache/lastUpdated.txt'

async function recursiveEnsureDir(dir) {
	try {
		await fsPromises.mkdir(dir, { recursive: true });
	} catch (err) {
		if (err.code !== 'EEXIST') {
			throw err;
		}
	}
	return dir;
}

async function ensureImage() {
	let now = Date.now();
	let lastUpdated;

	try {
		const data = await fsPromises.readFile(updatedTimestampFilename, 'utf8');
		lastUpdated = new Date(data.trim());
		if (!lastUpdated || (now - lastUpdated.getTime() > 1000 * 3600 * 24)) {
			await updateImageInCache();
		}
	} catch (err) {
		await updateImageInCache();
	}
}

async function updateImageInCache() {
	try {
		const response = await fetchImage('https://picsum.photos/1200');
		await recursiveEnsureDir('cache');
		const fileStream = fs.createWriteStream('cache/image.jpg');
		response.pipe(fileStream);
		await new Promise((resolve, reject) => {
			fileStream.on('finish', resolve);
			fileStream.on('error', reject);
		});
		await fsPromises.writeFile(updatedTimestampFilename, new Date().toISOString());
	} catch (err) {
		console.log(err);
	}
}

function fetchImage(url) {
	return new Promise((resolve, reject) => {
		const request = https.get(url, response => {
			if (response.statusCode === 200) {
				resolve(response)
			} else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
				fetchImage(response.headers.location).then(resolve).catch(reject);
			} else {
				reject(new Error(`Could not fetch image from ${url}. Status code: ${response.statusCode}`))
			}
		});
		request.on('error', error => reject(error));
	})
}

function setCORSHeaders(req, res) {
	const origin = req.headers.origin;
	res.setHeader('Access-Control-Allow-Origin', '*') // allow any origin
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', 'false');

	if (req.method === 'OPTIONS') {
		res.writeHead(204);
		res.end();
		return true;
	}
	return false;
}

function serveStaticFile(req, res) {
	let filePath = decodeURI(req.url);

	if (filePath.includes('..')) {
		// nono bad boy, do not leave project dir
		res.statusCode(400);
		res.end('Invalid request');
		return;
	}
	const fullPath = path.join(__dirname, filePath);
	fs.exists(fullPath, (exists) => {
		if (!exists) {
			res.statusCode(400);
			res.end('File not found');
			return;
		}

		fs.readFile(fullPath, (err, data) => {
			const ext = path.extname(fullPath.toLowerCase());
			if (ext === '.jpg' || '.jpeg') {
				res.setHeader('Content-Type', 'image/jpg');
			} else {
				res.set('Content-Type', 'application/octet-stream');
			}
			res.writeHead(200);
			res.end();
		})
	})
}

const server = http.createServer(async (req, res) => {
	if (setCORSHeaders(req, res)) {
		return;
	}
	if (req.method == 'Get' && req.url.startsWith('/cache')) {
		serveStaticFile(req, res);
		return;
	}
	else if (req.method == 'GET' && req.url == '/image') {
		await ensureImage();
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ 'filepath': loadbalancerPortForwardFullAddress + 'cache/image.jpg' }));
	} else {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/error');
		res.end('Not Found\n');
	}
});

server.listen(port, hostname, () => { console.log(`Server running at http://${hostname}:${port}/`); });
