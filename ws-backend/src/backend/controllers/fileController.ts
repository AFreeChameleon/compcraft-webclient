import { Request, Response } from 'express';

export const postUploadFile = (req: Request, res: Response) => {
    try {
        console.log(req.files, req.body);
        return res.send('doneee');
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'An error occurred while uploading your file.'
        });
    }
}

export const postUploadFiles = (req: Request, res: Response) => {
    try {
        if (!req.files) {
            return res.status(500).json({
                message: 'No files uploaded.'
            });
        }

        const fileList: any = req.files.selectedFiles;
        const { roomCode } = req.body;
        let data: any[] = [];
        Object.keys(fileList).forEach((key: any) => {
            let file = fileList[key];

            file.mv(`./uploads/${roomCode}-${file.name}`);
            data.push({
                name: file.name,
                mimetype: file.mimetype,
                size: file.size
            })
        });

        console.log(data)
        return res.json({
            message: 'Files are uploaded',
            data: data
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'An error occurred while uploading your files.'
        });
    }
}