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
        local path = req.data.currentPath
        local dirItems = fs.list(path)
        local files = {}
        print(textutils.serialize(dirItems))
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
                ["id"] = req.data.id
            }
        }))
    elseif req.action == 'get-time' then
        local time = textutils.formatTime(os.time())
        local date = os.date("%d/%m/%Y")
        ws.send(json.encode({
            ["action"] = "set-time",
            ["roomCode"] = req.roomCode,
            ["data"] = {
                ["time"] = time,
                ["date"] = date
            }
        }))
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