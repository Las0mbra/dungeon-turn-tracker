/**
 * UI helpers and button management for Dungeon Turn Tracker
 */

window.DungeonTurnTracker = window.DungeonTurnTracker || {};

let trackerButton;

/**
 * Create the draggable tracker button
 */
window.DungeonTurnTracker.createTrackerButton = function(turnTrackerInstance) {
    const { MODULE_ID } = window.DungeonTurnTracker.CONFIG;
    // Get saved position and lock status
    const savedPosition = game.settings.get(MODULE_ID, 'buttonPosition');
    const isLocked = game.settings.get(MODULE_ID, 'lockButtonPosition');
    
    // Create a more visible button with different styling
    trackerButton = $(`<button id="dungeon-turn-tracker-btn" style="
        position: fixed; 
        top: ${savedPosition.top}px; 
        right: ${savedPosition.right}px; 
        z-index: 1000; 
        padding: 10px 15px; 
        background: #782e22; 
        color: white; 
        border: none; 
        border-radius: 5px; 
        cursor: ${isLocked ? 'pointer' : 'move'};
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        user-select: none;
    " title="Open Dungeon Turn Tracker${isLocked ? '' : ' (Drag to move)'}">
        📋 Turn Tracker ${isLocked ? '🔒' : ''}
    </button>`);
    
    // Add click handler
    trackerButton.click(() => {
        console.log(`${MODULE_ID} | Button clicked`);
        console.log(`${MODULE_ID} | Instance rendered:`, turnTrackerInstance.rendered);
        
        try {
            if (turnTrackerInstance.rendered) {
                console.log(`${MODULE_ID} | Closing window`);
                turnTrackerInstance.close();
            } else {
                console.log(`${MODULE_ID} | Opening window`);
                turnTrackerInstance.render(true);
            }
        } catch (error) {
            console.error(`${MODULE_ID} | Error:`, error);
            ui.notifications.error("Error opening Dungeon Turn Tracker: " + error.message);
        }
    });
    
    // Add drag functionality if not locked
    if (!isLocked) {
        addDragFunctionality(trackerButton);
    }
    
    // Add to body to ensure visibility
    $('body').append(trackerButton);
    console.log(`${MODULE_ID} | Button created and added to body`);
}

/**
 * Add drag and drop functionality to the button
 */
function addDragFunctionality(button) {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    button.on('mousedown', (e) => {
        if (e.which === 1) { // Left mouse button
            isDragging = true;
            const buttonRect = button[0].getBoundingClientRect();
            dragOffset.x = e.clientX - buttonRect.left;
            dragOffset.y = e.clientY - buttonRect.top;
            e.preventDefault();
        }
    });
    
    $(document).on('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            
            // Keep button within viewport bounds
            const maxX = window.innerWidth - button.outerWidth();
            const maxY = window.innerHeight - button.outerHeight();
            
            const constrainedX = Math.max(0, Math.min(x, maxX));
            const constrainedY = Math.max(0, Math.min(y, maxY));
            
            button.css({
                left: constrainedX + 'px',
                right: 'auto',
                top: constrainedY + 'px'
            });
            
            e.preventDefault();
        }
    });
    
    $(document).on('mouseup', (e) => {
        if (isDragging) {
            isDragging = false;
            
            // Save new position
            const buttonRect = button[0].getBoundingClientRect();
            const newPosition = {
                top: buttonRect.top,
                right: window.innerWidth - buttonRect.right
            };
            
            game.settings.set(MODULE_ID, 'buttonPosition', newPosition);
            console.log(`${MODULE_ID} | Button position saved:`, newPosition);
        }
    });
}

/**
 * Refresh the button when settings change
 */
window.DungeonTurnTracker.refreshButton = function(turnTrackerInstance) {
    if (trackerButton) {
        trackerButton.remove();
    }
    window.DungeonTurnTracker.createTrackerButton(turnTrackerInstance);
};

/**
 * Setup chat commands for the tracker
 */
window.DungeonTurnTracker.setupChatCommands = function(turnTrackerInstance) {
    const { MODULE_ID } = window.DungeonTurnTracker.CONFIG;
    Hooks.on('chatMessage', (html, content, msg) => {
        if (content === '/turntracker' || content === '/tt') {
            if (turnTrackerInstance.rendered) {
                turnTrackerInstance.close();
            } else {
                turnTrackerInstance.render(true);
            }
            return false; // Prevent the message from being sent to chat
        }
    });
    
    console.log(`${MODULE_ID} | Chat commands registered: /turntracker, /tt`);
};