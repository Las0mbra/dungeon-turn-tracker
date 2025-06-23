/**
 * Socket communication handling for Dungeon Turn Tracker
 */

window.DungeonTurnTracker = window.DungeonTurnTracker || {};

/**
 * Initialize socket listeners
 */
window.DungeonTurnTracker.initializeSocket = function(turnTrackerInstance) {
    const { MODULE_ID, SOCKET } = window.DungeonTurnTracker.CONFIG;
    
    game.socket.on(SOCKET, (data) => {
        if (turnTrackerInstance) {
            turnTrackerInstance.handleSocketMessage(data);
        }
    });
    
    console.log(`${MODULE_ID} | Socket listeners initialized`);
};

/**
 * Emit a socket message
 */
window.DungeonTurnTracker.emitSocketMessage = function(type, data = {}) {
    const { MODULE_ID, SOCKET } = window.DungeonTurnTracker.CONFIG;
    
    const message = {
        type: type,
        userId: game.user.id,
        ...data
    };
    
    game.socket.emit(SOCKET, message);
    console.log(`${MODULE_ID} | Socket message emitted:`, message);
};