local function downloadAPIs()
    local jsonRes = http.get("https://pastebin.com/raw/4nRg9CHU")
    local ltn12Res = http.get("https://raw.githubusercontent.com/lunarmodules/luasocket/master/src/ltn12.lua")

    local jsonFile = fs.open("/" .. shell.dir() .. "/json", "w")
    local ltn12File = fs.open("/" .. shell.dir() .. "/ltn12", "w")

    jsonFile.write(jsonRes.readAll())
    ltn12File.write(ltn12Res.readAll())

    jsonFile.close()
    ltn12File.close()
end

os.loadAPI("json")
ltn12 = require("ltn12")

downloadAPIs()

local ws, err = http.websocket(

);

function GetTableLng(tbl)
    local getN = 0
    for n in pairs(tbl) do 
        getN = getN + 1 
    end
    return getN
end

local function getDiskData()
    local locations = {
        "bottom",
        "top",
        "left",
        "right",
        "front",
        "back"
    }
    local paths = {}
    for _, loc in pairs(locations) do
        if disk.isPresent(loc) then
            table.insert(
                paths,
                {
                    ["name"] = disk.getLabel(),
                    ["path"] = disk.getMountPath(),
                }
            )
        end
        return paths
    end
end

local function uploadFile(path, url)
    local fileHandle = io.open(path, "rb")
    if fileHandle then
        local fileContent = fileHandle:read("*a")
        fileHandle:close()
        local boundary = "abcd"
        local header_b = 'Content-Disposition: form-data; name="file"; filename="' .. path .. '"\r\nContent-Type: text/plain\r\n'
        local fileContent =  '--' ..boundary .. '\r\n' ..header_b ..'\r\n'.. fileContent .. '\r\n--' .. boundary ..'--\r\n'
        local response_body = {}
        local _, code = http.request {
            url = url,
            method = "POST",
            headers = {    
                ["Content-Length"] =  fileContent:len(),
                ['Content-Type'] = 'multipart/form-data; boundary=' .. boundary
            },
            source = ltn12.source.string(fileContent),
            sink = ltn12.sink.table(response_body),
        }
        return code, table.concat(response_body)  
    else
        return false, "File Not Found"
    end
end

local function routeAction(req)
    if req.action == 'ping' then
        ws.send(json.encode({
            ["action"] = 'ping'
        }))
    elseif req.action == 'get-files-data' then
        local path = req.data.path
        local dirItems = fs.list(path)
        local files = {}
        for _, dirItem in pairs(dirItems) do
            table.insert(
                files,
                {
                    ["name"] = dirItem,
                    ["directory"] = fs.isDir(path .. dirItem)
                }
            )
        end
        ws.send(json.encode({
            ["action"] = "set-files-data",
            ["roomCode"] = req.roomCode,
            ["data"] = {
                ["structure"] = files,
                ["disks"] = getDiskData(),
                ["path"] = path
            }
        }))
    elseif req.action == 'get-time' then
        local time = os.time()
        local date = os.day("ingame")
        ws.send(json.encode({
            ["action"] = "set-time",
            ["roomCode"] = req.roomCode,
            ["data"] = {
                ["time"] = time,
                ["date"] = date
            }
        }))
    elseif req.action == 'create-file' then
        local path = req.data.path
        local fileName = req.data.fileName
        if fs.isDir(path .. fileName) or GetTableLng(fs.find(path .. fileName)) > 0 then
            ws.send(json.encode({
                ["action"] = "create-file-response",
                ["status"] = "Failed",
                ["roomCode"] = req.roomCode,
                ["data"] = {
                    ["message"] = "File/folder already exists."
                }
            })) 
        else
            local file = fs.open(path .. fileName, "w")
            file.close()
            ws.send(json.encode({
                ["action"] = "refresh-file-data",
                ["roomCode"] = req.roomCode,
                ["data"] = {
                    ["path"] = path
                }
            }))
        end
    elseif req.action == 'create-folder' then
        local path = req.data.path
        local folderName = req.data.folderName

        if fs.isDir(path .. folderName) or GetTableLng(fs.find(path .. folderName)) > 0 then
            ws.send(json.encode({
                ["action"] = "create-folder-response",
                ["status"] = "Failed",
                ["roomCode"] = req.roomCode,
                ["data"] = {
                    ["message"] = "File/folder already exists."
                }
            })) 
        else
            local folder = fs.makeDir(path .. folderName)
            ws.send(json.encode({
                ["action"] = "refresh-file-data",
                ["roomCode"] = req.roomCode,
                ["data"] = {
                    ["path"] = path
                }
            }))
        end
    elseif req.action == 'delete-item' then
        local path = req.data.path
        local fileName = req.data.fileName
        if fs.isDir(path .. fileName) or GetTableLng(fs.find(path .. fileName)) > 0 then
            fs.delete(path .. fileName)
            ws.send(json.encode({
                ["action"] = "refresh-file-data",
                ["roomCode"] = req.roomCode,
                ["data"] = {
                    ["path"] = path
                }
            }))
        else
            ws.send(json.encode({
                ["action"] = "delete-item-response",
                ["status"] = "Failed",
                ["roomCode"] = req.roomCode,
                ["data"] = {
                    ["message"] = "File/folder doesn't exist."
                }
            })) 
        end
    elseif req.action == 'rename-item' then
        local path = req.data.path
        local originalName = req.data.originalName
        local dest = req.data.dest
        local destName = req.data.destName
        if not fs.isDir(path .. originalName or not (GetTableLng(fs.find(path .. originalName)) > 0)) then
            ws.send(json.encode({
                ["action"] = "rename-item-response",
                ["status"] = "Failed",
                ["roomCode"] = req.roomCode,
                ["data"] = {
                    ["message"] = "Original file/folder already exists."
                }
            })) 
        elseif (fs.isDir(dest .. destName) or GetTableLng(fs.find(dest .. destName)) > 0) then
            ws.send(json.encode({
                ["action"] = "rename-item-response",
                ["status"] = "Failed",
                ["roomCode"] = req.roomCode,
                ["data"] = {
                    ["message"] = "Destination file/folder already exists."
                }
            }))
        else
            fs.move(path .. originalName, dest .. destName)
            ws.send(json.encode({
                ["action"] = "refresh-file-data",
                ["roomCode"] = req.roomCode,
                ["data"] = {
                    ["path"] = {path, dest}
                }
            }))
        end
    elseif req.action == "upload-files" then
        local paths = req.data.paths
        local selectedFiles = {}
        for _, path in pairs(paths) do
            table.insert(selectedFiles, ltn12.source.file(io.open(path, "r")))
        end
        print(selectedFiles)
        http.post("/api/upload-files", {
            ["selectedFiles"] = selectedFiles
        }, {
            ["Content-Type"] =  "multipart/form-data"
        })
    elseif req.action == "upload-file" then
        local path = req.data.path
        local r_status, r_content = uploadFile(path, "")

        print(r_status, r_content)
    end
end

if ws then
    ws.send(json.encode({
        ["action"] = "create-room",
        ["data"] = {
            ["files"] = {
                ["disks"] = getDiskData()
            }
        }
    }))
    while true do
        local rawMsg = ws.receive()
        local req = json.decode(rawMsg)
        print(req, rawMsg)
        routeAction(req)
    end
end