import * as express  from "express";
import { Request, Response } from "express";

import * as db  from "./db";

import * as path from "path";



	const prefix = '/history';
	var router = express.Router();


	router.get('/data/scenario', async function (req:Request, res:Response) {
		
		res.json(await db.query('getScenario'));
	})
	
	router.get('/data/faction', async function (req:Request, res:Response) {
		
		res.json(await db.query('getFaction'));
	})
	
	
	router.get('/data/scenarioCities/:scenario', async function (req:Request, res:Response) {
		
		res.json(await db.query('getScenarioCities',req.params));
	})
	
	router.get('/data/road/scenario/:scenario', async function (req:Request, res:Response) {
		
		res.json(await db.query('getRoads',req.params));
	})
	
	router.get('/data/road/sub', async function (req:Request, res:Response) {
		
		res.json(await db.query('getRoadSubs'));
	
	})
	
	router.use(express.static(__dirname+prefix+'/public'))
	router.use(express.static(__dirname+prefix+ '/build'));
	
	router.get('/', function(req, res) {
		console.log(`history root`)
	  res.sendFile(path.join(__dirname+prefix, '/build', 'index.html'));
	});
	
	
	console.log(`history load`)
module.exports = router