const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
let players = new Map(); // Store players as Map (WebSocket -> playerId)

wss.on("connection", (ws) => {
    const playerId = Math.random().toString(36).substr(2, 9); // Assign unique ID
    players.set(ws, playerId); // Store player

    console.log(`New player connected! ID: ${playerId}`);

    ws.on("message", (message) => {
        try {
            let data = JSON.parse(message);
            console.log("📩 Received from player:", data);

            if (data.type === "playerUpdate") {
                let update = JSON.stringify(data);
                players.forEach((id, player) => {
                    if (player !== ws && player.readyState === WebSocket.OPEN) {
                        player.send(update);
                    }
                });
            } else if (data.type === "playerShoots") {
                let update = JSON.stringify(data);
                players.forEach((id, player) => {
                    if (player !== ws && player.readyState === WebSocket.OPEN) {
                        player.send(update);
                    }
                });
            }
        } catch (error) {
            console.error("Invalid JSON received:", message);
        }
    });

    ws.on("close", () => {
        const disconnectedPlayerId = players.get(ws); // Get player ID
        players.delete(ws); // Remove from active players

        console.log(`Player disconnected: ${disconnectedPlayerId}`);

        let update = JSON.stringify({ type: "playerDisconnected", playerId: disconnectedPlayerId });

        players.forEach((id, player) => {
            if (player.readyState === WebSocket.OPEN) {
                player.send(update);
            }
        });
    });
});

console.log("WebSocket server running on ws://localhost:8080");
