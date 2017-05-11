import diregister from "electrode-ota-server-diregister";

export const register = diregister({
    name: "ota!fileservice",
    multiple: false,
    connections: false,
}, ({downloadUrl}) => downloadUrl);
