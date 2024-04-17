const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const port =  3000;

// API endpoint to stream video
app.get('/api/url/:videoUrl',(req,res) => {
    const vdoName = req.params.videoUrl
    const vdoPath = path.join(__dirname,'earth.mp4')

    res.json({status : 'success' , videoUrl : vdoPath})
    
})
app.get('/api/video', (req, res) => {
    const videoPath = './earth.mp4'; // Video file ka path
    const videoStat = fs.statSync(videoPath);  
    const fileSize = videoStat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        (file.pipe(res));
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
