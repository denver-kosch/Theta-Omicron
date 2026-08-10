import fs, { promises as fsp } from 'fs';
import path from 'path';
import os from 'os';
import { connect } from 'mongoose';
import { port, host, mongodbUri } from './config.js';
import { pathToFileURL } from "url";
import { execFile } from "child_process";
import { promisify } from 'util';

const runFile = promisify(execFile);

const libreOfficeBin = process.env.LIBREOFFICE_BIN ?? '/Applications/LibreOffice.app/Contents/MacOS/soffice';

export const connectDB = async () => {
	try {
		console.log(`Attempting MongoDB connect`);
		await connect(mongodbUri);
		console.log(`MongoDB connected`);
		return [port, host];
	} catch (error) {
		console.log(`Error: ${error.message}`);
		process.exit(1);
	}
};

export const appendImgPath = (obj, dirname, imgFolder) => {
	const id = String(obj._id);
	const basePath = path.join(dirname, 'public', 'images', imgFolder);
	const exts = ['jpg', 'png', 'jpeg'];
	const foundExt = exts.find(ext => fs.existsSync(path.join(basePath, `${id}.${ext}`)));
	const imageUrl = foundExt
		? `/images/${imgFolder}/${id}.${foundExt}`
		: `/images/${imgFolder}/default.png`;

	obj.imageUrl = `http://${host}:${port}${imageUrl}`;
	return obj;
};

export const abbrSt = state => ({
	"Alabama": "AL",
	"Alaska": "AK",
	"Arizona": "AZ",
	"Arkansas": "AR",
	"California": "CA",
	"Colorado": "CO",
	"Connecticut": "CT",
	"Delaware": "DE",
	"Florida": "FL",
	"Georgia": "GA",
	"Hawaii": "HI",
	"Idaho": "ID",
	"Illinois": "IL",
	"Indiana": "IN",
	"Iowa": "IA",
	"Kansas": "KS",
	"Kentucky": "KY",
	"Louisiana": "LA",
	"Maine": "ME",
	"Maryland": "MD",
	"Massachusetts": "MA",
	"Michigan": "MI",
	"Minnesota": "MN",
	"Mississippi": "MS",
	"Missouri": "MO",
	"Montana": "MT",
	"Nebraska": "NE",
	"Nevada": "NV",
	"New Hampshire": "NH",
	"New Jersey": "NJ",
	"New Mexico": "NM",
	"New York": "NY",
	"North Carolina": "NC",
	"North Dakota": "ND",
	"Ohio": "OH",
	"Oklahoma": "OK",
	"Oregon": "OR",
	"Pennsylvania": "PA",
	"Rhode Island": "RI",
	"South Carolina": "SC",
	"South Dakota": "SD",
	"Tennessee": "TN",
	"Texas": "TX",
	"Utah": "UT",
	"Vermont": "VT",
	"Virginia": "VA",
	"Washington": "WA",
	"West Virginia": "WV",
	"Wisconsin": "WI",
	"Wyoming": "WY"
}[state] ?? state);

export class ApiError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
		this.name = 'ApiError';
	}
};

const sendJsonResponse = (res, status, content = {}) => {
	content.success = (status >= 200 && status < 300) ? true : false;
	res.status(status).json(content);
};

const handleError = (error, res) => {
	if (error instanceof ApiError) sendJsonResponse(res, error.status, { error: error.message });
	else sendJsonResponse(res, 500, { error: 'Internal Server Error' });
};

export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next, res))
	.then(({status, content = {}}) => sendJsonResponse(res, status, content))
	.catch(error => handleError(error, res));

export const generateUserSlug = (brother) => {
	const { firstName, lastName, _id } = brother;
	return `${firstName.toLowerCase().replace(/\s+/g, '')}-${lastName.toLowerCase().replace(/\s+/g, '')}-${_id}`;
};

export const decodeUserSlug = (slug) => slug.split("-");

export const log = (...content) => {console.log(`%c${content.join(" ")}`, "background-color:#00d138;")};

export async function convertDocumentToPdf({ inputBuffer, fileName, outputDir }) {
	await fsp.mkdir(outputDir, { recursive: true });

	const workingDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'document-conversion-'));
	const profileDir = path.join(workingDir, 'libreoffice-profile');
	const inputPath = path.join(workingDir, path.basename(fileName));

	try {
		await fsp.mkdir(profileDir);
		await fsp.writeFile(inputPath, inputBuffer);

		const { stderr } = await runFile(
			libreOfficeBin,
			[ '--headless', '--nologo', '--norestore', `-env:UserInstallation=${pathToFileURL(profileDir).href}`, '--convert-to', 'pdf', '--outdir', workingDir, inputPath ],
			{ timeout: 60_000, maxBuffer: 1024 * 1024 }
		);

		const parsedName = path.parse(fileName);
		const outputPath = path.join(outputDir, `${parsedName.name}.pdf`);

		try {
			await fsp.access(outputPath);
		} catch {
			throw new Error(`LibreOffice did not produce a PDF${stderr ? `: ${stderr}` : ''}`);
		}

		return outputPath;
	} finally {
		await fsp.rm(workingDir, { recursive: true, force: true });
	}
};