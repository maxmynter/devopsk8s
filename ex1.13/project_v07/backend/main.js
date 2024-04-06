const http = require('http');
const https = require('https')
const fsPromises = require('fs').promises;
const fs = require('fs');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

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

const server = http.createServer(async (req, res) => {
	if (req.method == 'GET' && req.url == '/image') {
		await ensureImage();
		try {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end({ 'filepath': 'cache/imge.jpg' });
		} catch {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end('Error getting image');

		}
	}
	else {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/error');
		res.end('Not Found\n');
	}
});

server.listen(port, hostname, () => { console.log(`Server running at http://${hostname}:${port}/`); });
