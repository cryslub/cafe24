import * as express  from "express";
import { Request, Response } from "express";
import * as fs  from "fs";
import * as history  from "./history";

import * as cors from "cors";

const app = express()
const port:number = 8001



app.use(cors());
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use('/history',history);

