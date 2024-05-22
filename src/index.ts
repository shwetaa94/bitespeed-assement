import express from 'express';
import router from './routes/route';
import { Request, Response } from "express";
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const port:any = process.env.PORT || 8000;
app.use(express.json());


app.get('/',(req: Request, res: Response)=>{
    res.send("hello i am Identity Reconciliation")
})

//router call
app.use('/', router);
    

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
