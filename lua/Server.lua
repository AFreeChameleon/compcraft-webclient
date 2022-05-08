os.loadAPI("json")

local ws, err = http.websocket(

);

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

        if fs.exists(path .. fileName) then
            ws.send(json.encode({
                ["action"] = "create-file-response",
                ["status"] = "Failed",
                ["roomCode"] = req.roomCode,
                ["data"] = {
                    ["message"] = "File already exists."
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