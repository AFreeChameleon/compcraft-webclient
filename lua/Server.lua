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