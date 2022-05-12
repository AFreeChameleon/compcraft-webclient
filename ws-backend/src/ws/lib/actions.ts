import { 
    createRoom, 
    getFilesData, 
    joinRoom, 
    setFilesData, 
    getTime,
    setTime, 
    ping,
    createFile,
    createFileResponse,
    createFolder,
    renameItem,
    deleteItem,
    refreshFiles,
    uploadFiles
} from "./controllers";

export const routeAction = (req: any, socket: any) => {
    try {
        switch(req.action) {
            case 'create-room':
                createRoom(req, socket);
                break;
            case 'join-room':
                joinRoom(req, socket);
                break;
            case 'get-files-data':
                getFilesData(req, socket);
                break;
            case 'set-files-data':
                setFilesData(req, socket);
                break;
            case 'get-time':
                getTime(req, socket);
                break;
            case 'set-time':
                setTime(req, socket);
                break;
            case 'create-file':
                createFile(req, socket);
                break;
            case 'create-file-response':
                createFileResponse(req, socket);
                break;
            case 'create-folder':
                createFolder(req, socket);
                break;
            case 'delete-item':
                deleteItem(req, socket);
                break;
            case 'rename-item':
                renameItem(req, socket);
                break;
            case 'refresh-file-data':
                refreshFiles(req, socket);
                break;
            case 'upload-files':
                uploadFiles(req, socket);
                break;
            case 'ping':
                ping(req, socket);
                break;
            default:
                console.log(req)
                break;
        }
    } catch (err) {
        console.log(err);
        socket.send(JSON.stringify({
            action: req.action,
            status: 'failed'
        }));
    }
}