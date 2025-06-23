/**
 * Configuration constants and settings registration for Dungeon Turn Tracker
 */

console.log("Dungeon Turn Tracker | config.js executing");

window.DungeonTurnTracker = window.DungeonTurnTracker || {};

console.log("Dungeon Turn Tracker | Creating CONFIG object");

window.DungeonTurnTracker.CONFIG = {
    MODULE_ID: 'dungeon-turn-tracker',
    SOCKET: 'module.dungeon-turn-tracker',
    DEFAULTS: {
        CHECKBOXES_PER_PAGE: 30,
        MAX_CHECKBOXES: 200,
        DEFAULT_CHECKBOXES: 10,
        DEFAULT_LABEL: 'Turn',
        DEFAULT_POSITION: { top: 10, right: 10 }
    }
};

/**
 * Register all module settings
 */
window.DungeonTurnTracker.registerSettings = function() {
    const { MODULE_ID, DEFAULTS } = window.DungeonTurnTracker.CONFIG;
    console.log(`${MODULE_ID} | Registering settings...`);

    game.settings.register(MODULE_ID, 'numCheckboxes', {
        name: 'Number of Checkboxes',
        hint: 'How many checkboxes to display in the turn tracker',
        scope: 'world',
        config: true,
        type: Number,
        default: DEFAULTS.DEFAULT_CHECKBOXES,
        range: {
            min: 1,
            max: DEFAULTS.MAX_CHECKBOXES,
            step: 1
        }
    });

    game.settings.register(MODULE_ID, 'checkboxLabel', {
        name: 'Checkbox Label',
        hint: 'Label prefix for each checkbox (e.g., "Turn", "Phase", "Step")',
        scope: 'world',
        config: true,
        type: String,
        default: DEFAULTS.DEFAULT_LABEL
    });

    game.settings.register(MODULE_ID, 'buttonPosition', {
        name: 'Button Position',
        hint: 'Saved position of the Turn Tracker button',
        scope: 'client',
        config: false,
        type: Object,
        default: DEFAULTS.DEFAULT_POSITION
    });

    game.settings.register(MODULE_ID, 'lockButtonPosition', {
        name: 'Lock Button Position',
        hint: 'Prevent the Turn Tracker button from being dragged',
        scope: 'client',
        config: true,
        type: Boolean,
        default: false
    });

    console.log(`${MODULE_ID} | Settings registered successfully`);
};

console.log("Dungeon Turn Tracker | config.js completed - CONFIG:", window.DungeonTurnTracker.CONFIG);