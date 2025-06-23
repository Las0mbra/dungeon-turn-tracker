/**
 * Dungeon Turn Tracker - Complete Module
 * A configurable turn tracker with pagination, drag-and-drop button, and multi-user sync
 */

console.log("Dungeon Turn Tracker | Module loaded successfully");

// ===================================================================
// CONFIGURATION & CONSTANTS
// ===================================================================

const MODULE_ID = 'dungeon-turn-tracker';
const SOCKET = 'module.dungeon-turn-tracker';

const DEFAULTS = {
    CHECKBOXES_PER_PAGE: 30,
    MAX_CHECKBOXES: 200,
    DEFAULT_CHECKBOXES: 10,
    DEFAULT_LABEL: 'Turn',
    DEFAULT_POSITION: { top: 50, right: 50 }
};

// ===================================================================
// RESET DEFAULTS MENU
// ===================================================================

class ResetDefaultsMenu extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Reset Dungeon Turn Tracker to Defaults",
            template: "modules/dungeon-turn-tracker/templates/reset-defaults.html",
            width: 400,
            height: 200,
            classes: ["dungeon-turn-tracker-reset"]
        });
    }

    async getData() {
        return {
            message: "This will reset all Dungeon Turn Tracker settings to their default values and center the tracker button on screen."
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        
        html.find('button[name="close"]').click(() => {
            this.close();
        });
    }

    async _updateObject(event, formData) {
        if (formData.confirm) {
            await this.resetToDefaults();
        }
    }

    async resetToDefaults() {
        // Reset all settings to their defaults
        await game.settings.set(MODULE_ID, 'numCheckboxes', DEFAULTS.DEFAULT_CHECKBOXES);
        await game.settings.set(MODULE_ID, 'checkboxesPerPage', DEFAULTS.CHECKBOXES_PER_PAGE);
        await game.settings.set(MODULE_ID, 'buttonPosition', DEFAULTS.DEFAULT_POSITION);
        await game.settings.set(MODULE_ID, 'lockButtonPosition', false);
        await game.settings.set(MODULE_ID, 'playerSync', false);
        await game.settings.set(MODULE_ID, 'theme', 'light');
        await game.settings.set(MODULE_ID, 'interval1Enable', false);
        await game.settings.set(MODULE_ID, 'interval1Number', 3);
        await game.settings.set(MODULE_ID, 'interval1Color', 'yellow');
        await game.settings.set(MODULE_ID, 'interval2Enable', false);
        await game.settings.set(MODULE_ID, 'interval2Number', 5);
        await game.settings.set(MODULE_ID, 'interval2Color', 'blue');
        await game.settings.set(MODULE_ID, 'interval3Enable', false);
        await game.settings.set(MODULE_ID, 'interval3Number', 10);
        await game.settings.set(MODULE_ID, 'interval3Color', 'green');
        
        // Refresh the button position
        if (window.dungeonTurnTracker && trackerButton) {
            refreshButton(window.dungeonTurnTracker);
        }
        
        // Refresh the tracker window if open
        if (window.dungeonTurnTracker && window.dungeonTurnTracker.rendered) {
            window.dungeonTurnTracker.render();
        }
        
        ui.notifications.info("Dungeon Turn Tracker settings have been reset to defaults!");
        this.close();
    }
}

// ===================================================================
// SETTINGS REGISTRATION
// ===================================================================

function registerSettings() {
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

    game.settings.register(MODULE_ID, 'checkboxesPerPage', {
        name: 'Checkboxes Per Page',
        hint: 'How many checkboxes to display on each page',
        scope: 'world',
        config: true,
        type: Number,
        default: DEFAULTS.CHECKBOXES_PER_PAGE,
        range: {
            min: 5,
            max: 100,
            step: 5
        }
    });

    game.settings.register(MODULE_ID, 'checkboxLabel', {
        name: 'Checkbox Label (Deprecated)',
        hint: 'This setting is no longer used as only checkbox numbers are displayed',
        scope: 'world',
        config: false,
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

    game.settings.register(MODULE_ID, 'playerSync', {
        name: 'Player Sync',
        hint: 'Allow players to see and interact with the turn tracker. If disabled, only GMs can use the module.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(MODULE_ID, 'theme', {
        name: 'Theme',
        hint: 'Choose the visual theme for the turn tracker',
        scope: 'client',
        config: true,
        type: String,
        choices: {
            'light': 'Light Theme',
            'dark': 'Dark Theme'
        },
        default: 'light'
    });

    // Interval 1 Settings
    game.settings.register(MODULE_ID, 'interval1Enable', {
        name: 'Enable Interval 1',
        hint: 'Enable first interval highlighting system',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(MODULE_ID, 'interval1Number', {
        name: 'Interval 1 Number',
        hint: 'Highlight every Nth checkbox for Interval 1 (e.g., 3 = every 3rd checkbox)',
        scope: 'world',
        config: true,
        type: Number,
        default: 3,
        range: {
            min: 2,
            max: 50,
            step: 1
        }
    });

    game.settings.register(MODULE_ID, 'interval1Color', {
        name: 'Interval 1 Color',
        hint: 'Color for Interval 1 highlighted checkboxes',
        scope: 'world',
        config: true,
        type: String,
        choices: {
            'yellow': 'Yellow',
            'orange': 'Orange',
            'blue': 'Blue',
            'green': 'Green',
            'purple': 'Purple',
            'red': 'Red'
        },
        default: 'yellow'
    });

    // Interval 2 Settings
    game.settings.register(MODULE_ID, 'interval2Enable', {
        name: 'Enable Interval 2',
        hint: 'Enable second interval highlighting system',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(MODULE_ID, 'interval2Number', {
        name: 'Interval 2 Number',
        hint: 'Highlight every Nth checkbox for Interval 2 (e.g., 5 = every 5th checkbox)',
        scope: 'world',
        config: true,
        type: Number,
        default: 5,
        range: {
            min: 2,
            max: 50,
            step: 1
        }
    });

    game.settings.register(MODULE_ID, 'interval2Color', {
        name: 'Interval 2 Color',
        hint: 'Color for Interval 2 highlighted checkboxes',
        scope: 'world',
        config: true,
        type: String,
        choices: {
            'yellow': 'Yellow',
            'orange': 'Orange',
            'blue': 'Blue',
            'green': 'Green',
            'purple': 'Purple',
            'red': 'Red'
        },
        default: 'blue'
    });

    // Interval 3 Settings
    game.settings.register(MODULE_ID, 'interval3Enable', {
        name: 'Enable Interval 3',
        hint: 'Enable third interval highlighting system',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register(MODULE_ID, 'interval3Number', {
        name: 'Interval 3 Number',
        hint: 'Highlight every Nth checkbox for Interval 3 (e.g., 10 = every 10th checkbox)',
        scope: 'world',
        config: true,
        type: Number,
        default: 10,
        range: {
            min: 2,
            max: 50,
            step: 1
        }
    });

    game.settings.register(MODULE_ID, 'interval3Color', {
        name: 'Interval 3 Color',
        hint: 'Color for Interval 3 highlighted checkboxes',
        scope: 'world',
        config: true,
        type: String,
        choices: {
            'yellow': 'Yellow',
            'orange': 'Orange',
            'blue': 'Blue',
            'green': 'Green',
            'purple': 'Purple',
            'red': 'Red'
        },
        default: 'green'
    });

    // Add a reset button in the settings menu
    game.settings.registerMenu(MODULE_ID, 'resetDefaults', {
        name: 'Reset to Defaults',
        hint: 'Reset all settings to their default values and center the tracker button',
        icon: 'fas fa-undo',
        type: ResetDefaultsMenu,
        restricted: false
    });

    console.log(`${MODULE_ID} | Settings registered successfully`);
}

// ===================================================================
// MAIN DUNGEON TURN TRACKER APPLICATION CLASS
// ===================================================================

class DungeonTurnTracker extends foundry.applications.api.ApplicationV2 {
    constructor(options = {}) {
        super(options);
        this.checkboxStates = {};
        this.pageTexts = {};
        this.currentPage = 1;
        this.lastPageChange = 0; // Throttling for page changes
        this.lastRender = 0; // Throttling for renders
        this.renderTimeout = null; // Debounced render
        this.socketBatchTimeout = null; // Batched socket updates
        this.pendingSocketUpdates = []; // Queue for socket updates
        console.log(`${MODULE_ID} | DungeonTurnTracker constructor called`);
    }

    static DEFAULT_OPTIONS = {
        id: "dungeon-turn-tracker-{id}",
        tag: "div",
        window: {
            title: "Dungeon Turn Tracker",
            icon: "fas fa-tasks",
            resizable: true
        },
        position: {
            width: 450,
            height: 450
        },
        classes: ["dungeon-turn-tracker-app"]
    };

    async _prepareContext(options) {
        console.log(`${MODULE_ID} | Preparing context for render`);
        
        const numCheckboxes = game.settings.get(MODULE_ID, 'numCheckboxes');
        const checkboxesPerPage = game.settings.get(MODULE_ID, 'checkboxesPerPage');
        
        // Get all interval settings
        const intervals = [
            {
                enabled: game.settings.get(MODULE_ID, 'interval1Enable'),
                number: game.settings.get(MODULE_ID, 'interval1Number'),
                color: game.settings.get(MODULE_ID, 'interval1Color'),
                priority: 1
            },
            {
                enabled: game.settings.get(MODULE_ID, 'interval2Enable'),
                number: game.settings.get(MODULE_ID, 'interval2Number'),
                color: game.settings.get(MODULE_ID, 'interval2Color'),
                priority: 2
            },
            {
                enabled: game.settings.get(MODULE_ID, 'interval3Enable'),
                number: game.settings.get(MODULE_ID, 'interval3Number'),
                color: game.settings.get(MODULE_ID, 'interval3Color'),
                priority: 3
            }
        ];
        
        console.log(`${MODULE_ID} | numCheckboxes: ${numCheckboxes}, checkboxesPerPage: ${checkboxesPerPage}`);
        
        // Calculate pagination
        const totalPages = Math.ceil(numCheckboxes / checkboxesPerPage);
        const startIndex = (this.currentPage - 1) * checkboxesPerPage + 1;
        const endIndex = Math.min(this.currentPage * checkboxesPerPage, numCheckboxes);
        
        const checkboxes = [];
        for (let i = startIndex; i <= endIndex; i++) {
            // Check which intervals this checkbox belongs to
            const activeIntervals = intervals.filter(interval => 
                interval.enabled && (i % interval.number === 0)
            );
            
            let intervalData = null;
            if (activeIntervals.length > 0) {
                // Handle collisions by priority (lower number = higher priority)
                const primaryInterval = activeIntervals.reduce((prev, curr) => 
                    prev.priority < curr.priority ? prev : curr
                );
                
                intervalData = {
                    primary: primaryInterval.color,
                    secondary: activeIntervals.length > 1 ? activeIntervals.filter(i => i !== primaryInterval).map(i => i.color) : [],
                    count: activeIntervals.length,
                    isTriple: activeIntervals.length === 3,
                    intervals: activeIntervals.map(i => ({ color: i.color, number: i.number }))
                };
            }
            
            checkboxes.push({
                id: i,
                checked: this.checkboxStates[i] || false,
                hasInterval: activeIntervals.length > 0,
                intervalData: intervalData
            });
        }

        const theme = game.settings.get(MODULE_ID, 'theme');
        
        const context = {
            checkboxes: checkboxes,
            isGM: game.user.isGM,
            theme: theme,
            pageText: this.pageTexts[this.currentPage] || '',
            pagination: {
                currentPage: this.currentPage,
                totalPages: totalPages,
                hasPrevious: this.currentPage > 1,
                hasNext: this.currentPage < totalPages,
                startIndex: startIndex,
                endIndex: endIndex,
                totalCheckboxes: numCheckboxes,
                showPagination: totalPages > 1
            }
        };
        
        console.log(`${MODULE_ID} | Context - Page ${this.currentPage}/${totalPages}, hasPrevious: ${context.pagination.hasPrevious}, hasNext: ${context.pagination.hasNext}`);
        return context;
    }

    async _renderHTML(context, options) {
        console.log(`${MODULE_ID} | _renderHTML called with context:`, context);
        try {
            const html = await renderTemplate("modules/dungeon-turn-tracker/templates/turn-tracker.html", context);
            console.log(`${MODULE_ID} | Template rendered successfully`);
            return html;
        } catch (error) {
            console.error(`${MODULE_ID} | Template render error:`, error);
            throw error;
        }
    }

    _replaceHTML(result, content, options) {
        content.innerHTML = result;
        this._activateListeners(content);
    }
    
    _onRender(context, options) {
        super._onRender(context, options);
        console.log(`${MODULE_ID} | _onRender called`);
    }

    // Debounced render to prevent excessive re-renders
    debouncedRender() {
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
        }
        
        this.renderTimeout = setTimeout(() => {
            const now = Date.now();
            if (now - this.lastRender > 50) { // Minimum 50ms between renders
                this.lastRender = now;
                this.render();
            }
            this.renderTimeout = null;
        }, 16); // ~60fps max
    }

    // Batch socket updates to prevent spam
    batchSocketUpdate(update) {
        this.pendingSocketUpdates.push(update);
        
        if (this.socketBatchTimeout) {
            clearTimeout(this.socketBatchTimeout);
        }
        
        this.socketBatchTimeout = setTimeout(() => {
            const playerSync = game.settings.get(MODULE_ID, 'playerSync');
            if (playerSync && this.pendingSocketUpdates.length > 0) {
                // Send batched updates
                game.socket.emit(SOCKET, {
                    type: 'batchUpdate',
                    updates: this.pendingSocketUpdates,
                    userId: game.user.id
                });
            }
            
            this.pendingSocketUpdates = [];
            this.socketBatchTimeout = null;
        }, 100); // Batch updates over 100ms window
    }

    _activateListeners(content) {
        // Use modern event delegation with addEventListener
        content.addEventListener('change', (event) => {
            if (event.target.matches('.checkbox-column input[type="checkbox"]')) {
                const checkboxId = parseInt(event.target.dataset.id);
                const isChecked = event.target.checked;
                this.updateCheckbox(checkboxId, isChecked);
            }
            
            if (event.target.matches('#page-text')) {
                const text = event.target.value;
                this.updatePageText(this.currentPage, text);
            }
        });

        // Handle page input separately with blur and keypress events to avoid conflicts
        const pageInput = content.querySelector('#page-input');
        if (pageInput) {
            // Handle Enter key
            pageInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    const page = parseInt(event.target.value);
                    if (page !== this.currentPage && !isNaN(page)) {
                        console.log(`${MODULE_ID} | Page input: changing from ${this.currentPage} to ${page}`);
                        this.goToPage(page);
                    }
                }
            });
            
            // Handle when user clicks away from input
            pageInput.addEventListener('blur', (event) => {
                const page = parseInt(event.target.value);
                if (page !== this.currentPage && !isNaN(page)) {
                    console.log(`${MODULE_ID} | Page input blur: changing from ${this.currentPage} to ${page}`);
                    this.goToPage(page);
                }
            });
        }

        content.addEventListener('click', (event) => {
            if (event.target.matches('#reset-all')) {
                this.resetAllCheckboxes();
            }
            
            if (event.target.matches('#prev-page')) {
                event.preventDefault();
                event.stopPropagation();
                
                // Check if button is disabled
                if (event.target.disabled) {
                    console.log(`${MODULE_ID} | Previous page button is disabled - ignoring click`);
                    return;
                }
                
                console.log(`${MODULE_ID} | Previous page clicked: ${this.currentPage} -> ${this.currentPage - 1}`);
                
                // Double-check state logic
                if (this.currentPage <= 1) {
                    console.log(`${MODULE_ID} | Previous page - already at page 1, should not proceed`);
                    return;
                }
                
                this.previousPage();
            }
            
            if (event.target.matches('#next-page')) {
                event.preventDefault();
                event.stopPropagation();
                
                // Check if button is disabled
                if (event.target.disabled) {
                    console.log(`${MODULE_ID} | Next page button is disabled - ignoring click`);
                    return;
                }
                
                console.log(`${MODULE_ID} | Next page clicked: ${this.currentPage} -> ${this.currentPage + 1}`);
                
                // Double-check state logic
                const numCheckboxes = game.settings.get(MODULE_ID, 'numCheckboxes');
                const checkboxesPerPage = game.settings.get(MODULE_ID, 'checkboxesPerPage');
                const totalPages = Math.ceil(numCheckboxes / checkboxesPerPage);
                
                if (this.currentPage >= totalPages) {
                    console.log(`${MODULE_ID} | Next page - already at last page ${totalPages}, should not proceed`);
                    return;
                }
                
                this.nextPage();
            }
        });
    }

    updateCheckbox(checkboxId, isChecked) {
        this.checkboxStates[checkboxId] = isChecked;
        
        // Batch socket updates instead of sending immediately
        this.batchSocketUpdate({
            type: 'updateCheckbox',
            checkboxId: checkboxId,
            isChecked: isChecked
        });

        // Use debounced render instead of immediate render
        this.debouncedRender();
    }

    resetAllCheckboxes() {
        this.checkboxStates = {};
        
        const playerSync = game.settings.get(MODULE_ID, 'playerSync');
        if (playerSync) {
            game.socket.emit(SOCKET, {
                type: 'resetAll',
                userId: game.user.id
            });
        }

        this.render();
    }

    previousPage() {
        // Throttle rapid clicks
        const now = Date.now();
        if (now - this.lastPageChange < 100) {
            console.log(`${MODULE_ID} | previousPage() - Throttled rapid click`);
            return;
        }
        this.lastPageChange = now;
        
        const newPage = this.currentPage - 1;
        console.log(`${MODULE_ID} | previousPage() - Current: ${this.currentPage}, Target: ${newPage}`);
        
        if (newPage >= 1) {
            this.currentPage = newPage;
            console.log(`${MODULE_ID} | previousPage() - Changed to page ${this.currentPage}`);
            this.debouncedRender();
        } else {
            console.log(`${MODULE_ID} | previousPage() - Cannot go below page 1`);
        }
    }

    nextPage() {
        // Throttle rapid clicks
        const now = Date.now();
        if (now - this.lastPageChange < 100) {
            console.log(`${MODULE_ID} | nextPage() - Throttled rapid click`);
            return;
        }
        this.lastPageChange = now;
        
        const numCheckboxes = game.settings.get(MODULE_ID, 'numCheckboxes');
        const checkboxesPerPage = game.settings.get(MODULE_ID, 'checkboxesPerPage');
        const totalPages = Math.ceil(numCheckboxes / checkboxesPerPage);
        const newPage = this.currentPage + 1;
        
        console.log(`${MODULE_ID} | nextPage() - Current: ${this.currentPage}, Target: ${newPage}, Total Pages: ${totalPages}`);
        
        if (newPage <= totalPages) {
            this.currentPage = newPage;
            console.log(`${MODULE_ID} | nextPage() - Changed to page ${this.currentPage}`);
            this.debouncedRender();
        } else {
            console.log(`${MODULE_ID} | nextPage() - Cannot go beyond page ${totalPages}`);
        }
    }

    goToPage(page) {
        const numCheckboxes = game.settings.get(MODULE_ID, 'numCheckboxes');
        const checkboxesPerPage = game.settings.get(MODULE_ID, 'checkboxesPerPage');
        const totalPages = Math.ceil(numCheckboxes / checkboxesPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.debouncedRender();
        }
    }

    updatePageText(page, text) {
        this.pageTexts[page] = text;
        
        const playerSync = game.settings.get(MODULE_ID, 'playerSync');
        if (playerSync) {
            game.socket.emit(SOCKET, {
                type: 'updatePageText',
                page: page,
                text: text,
                userId: game.user.id
            });
        }
    }

    handleSocketMessage(data) {
        const playerSync = game.settings.get(MODULE_ID, 'playerSync');
        if (!playerSync && !game.user.isGM) {
            return;
        }
        
        if (data.type === 'updateCheckbox') {
            this.checkboxStates[data.checkboxId] = data.isChecked;
            this.debouncedRender();
        } else if (data.type === 'batchUpdate') {
            // Handle batched updates efficiently
            let needsRender = false;
            for (const update of data.updates) {
                if (update.type === 'updateCheckbox') {
                    this.checkboxStates[update.checkboxId] = update.isChecked;
                    needsRender = true;
                }
            }
            if (needsRender) {
                this.debouncedRender();
            }
        } else if (data.type === 'resetAll') {
            this.checkboxStates = {};
            this.debouncedRender();
        } else if (data.type === 'updatePageText') {
            this.pageTexts[data.page] = data.text;
            if (this.currentPage === data.page) {
                this.debouncedRender();
            }
        }
    }

    // Cleanup method to prevent memory leaks
    close(options = {}) {
        // Clear any pending timeouts
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
            this.renderTimeout = null;
        }
        
        if (this.socketBatchTimeout) {
            clearTimeout(this.socketBatchTimeout);
            this.socketBatchTimeout = null;
        }
        
        // Clear pending updates
        this.pendingSocketUpdates = [];
        
        return super.close(options);
    }
}

// ===================================================================
// UI MANAGEMENT & BUTTON CREATION
// ===================================================================

let trackerButton;

function createTrackerButton(turnTrackerInstance) {
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

function addDragFunctionality(button) {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let animationFrame = null;
    let currentPosition = { x: 0, y: 0 };
    
    const buttonElement = button[0];
    
    // Convert jQuery button to use native events for better performance
    const handleMouseDown = (e) => {
        if (e.button === 0) { // Left mouse button
            isDragging = true;
            const buttonRect = buttonElement.getBoundingClientRect();
            dragOffset.x = e.clientX - buttonRect.left;
            dragOffset.y = e.clientY - buttonRect.top;
            
            // Add visual feedback
            buttonElement.style.transition = 'none';
            buttonElement.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
            
            e.preventDefault();
            e.stopPropagation();
        }
    };
    
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        // Cancel any pending animation frame
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        
        // Calculate new position
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        // Keep button within viewport bounds
        const buttonRect = buttonElement.getBoundingClientRect();
        const maxX = window.innerWidth - buttonRect.width;
        const maxY = window.innerHeight - buttonRect.height;
        
        currentPosition.x = Math.max(0, Math.min(x, maxX));
        currentPosition.y = Math.max(0, Math.min(y, maxY));
        
        // Use requestAnimationFrame for smooth updates
        animationFrame = requestAnimationFrame(() => {
            buttonElement.style.left = currentPosition.x + 'px';
            buttonElement.style.right = 'auto';
            buttonElement.style.top = currentPosition.y + 'px';
        });
        
        e.preventDefault();
    };
    
    const handleMouseUp = () => {
        if (isDragging) {
            isDragging = false;
            
            // Cancel any pending animation frame
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
            
            // Restore visual state
            buttonElement.style.cursor = 'move';
            buttonElement.style.transition = '';
            document.body.style.userSelect = '';
            
            // Save new position
            const buttonRect = buttonElement.getBoundingClientRect();
            const newPosition = {
                top: buttonRect.top,
                right: window.innerWidth - buttonRect.right
            };
            
            game.settings.set(MODULE_ID, 'buttonPosition', newPosition);
            console.log(`${MODULE_ID} | Button position saved:`, newPosition);
        }
    };
    
    // Use native event listeners for better performance
    buttonElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Store cleanup function for later removal
    button.data('cleanup', () => {
        buttonElement.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });
}

function refreshButton(turnTrackerInstance) {
    if (trackerButton) {
        // Clean up event listeners if they exist
        const cleanup = trackerButton.data('cleanup');
        if (cleanup) {
            cleanup();
        }
        trackerButton.remove();
    }
    createTrackerButton(turnTrackerInstance);
}

function setupChatCommands(turnTrackerInstance) {
    Hooks.on('chatMessage', (html, content) => {
        if (content === '/turntracker' || content === '/tt') {
            const playerSync = game.settings.get(MODULE_ID, 'playerSync');
            if (!game.user.isGM && !playerSync) {
                ui.notifications.warn("Turn Tracker is only available to GMs when Player Sync is disabled.");
                return false;
            }
            
            if (turnTrackerInstance.rendered) {
                turnTrackerInstance.close();
            } else {
                turnTrackerInstance.render(true);
            }
            return false; // Prevent the message from being sent to chat
        }
    });
    
    console.log(`${MODULE_ID} | Chat commands registered: /turntracker, /tt`);
}

// ===================================================================
// SOCKET COMMUNICATION
// ===================================================================

function initializeSocket(turnTrackerInstance) {
    game.socket.on(SOCKET, (data) => {
        if (turnTrackerInstance) {
            turnTrackerInstance.handleSocketMessage(data);
        }
    });
    
    console.log(`${MODULE_ID} | Socket listeners initialized`);
}

// ===================================================================
// MODULE INITIALIZATION
// ===================================================================

let turnTrackerInstance;

Hooks.once('init', () => {
    console.log(`${MODULE_ID} | Initializing module...`);
    registerSettings();
});

Hooks.once('ready', () => {
    console.log(`${MODULE_ID} | Starting up...`);
    
    ui.notifications.info("Dungeon Turn Tracker loaded!");
    
    // Create the main tracker instance
    turnTrackerInstance = new DungeonTurnTracker();
    
    // Initialize socket communication
    initializeSocket(turnTrackerInstance);
    
    // Create the UI button only for GMs or if player sync is enabled
    const playerSync = game.settings.get(MODULE_ID, 'playerSync');
    if (game.user.isGM || playerSync) {
        createTrackerButton(turnTrackerInstance);
        setupChatCommands(turnTrackerInstance);
    }
    
    // Listen for setting changes to refresh button
    Hooks.on('updateSetting', (setting) => {
        if (setting.key === `${MODULE_ID}.lockButtonPosition`) {
            refreshButton(turnTrackerInstance);
        } else if (setting.key === `${MODULE_ID}.playerSync`) {
            // Refresh UI based on player sync setting change
            const newPlayerSync = game.settings.get(MODULE_ID, 'playerSync');
            if (game.user.isGM || newPlayerSync) {
                if (!trackerButton) {
                    createTrackerButton(turnTrackerInstance);
                    setupChatCommands(turnTrackerInstance);
                }
            } else {
                // Remove button for non-GM players when sync is disabled
                if (trackerButton && !game.user.isGM) {
                    trackerButton.remove();
                    trackerButton = null;
                    if (turnTrackerInstance.rendered) {
                        turnTrackerInstance.close();
                    }
                }
            }
        } else if (setting.key === `${MODULE_ID}.theme`) {
            // Refresh the tracker window to apply new theme
            if (turnTrackerInstance.rendered) {
                turnTrackerInstance.render();
            }
        } else if (setting.key === `${MODULE_ID}.checkboxesPerPage` || setting.key === `${MODULE_ID}.numCheckboxes`) {
            // Refresh the tracker window when pagination settings change
            if (turnTrackerInstance.rendered) {
                // Reset to page 1 if current page would be invalid
                const numCheckboxes = game.settings.get(MODULE_ID, 'numCheckboxes');
                const checkboxesPerPage = game.settings.get(MODULE_ID, 'checkboxesPerPage');
                const totalPages = Math.ceil(numCheckboxes / checkboxesPerPage);
                if (turnTrackerInstance.currentPage > totalPages) {
                    turnTrackerInstance.currentPage = 1;
                }
                turnTrackerInstance.render();
            }
        } else if (setting.key === `${MODULE_ID}.interval1Enable` || 
                   setting.key === `${MODULE_ID}.interval1Number` || 
                   setting.key === `${MODULE_ID}.interval1Color` ||
                   setting.key === `${MODULE_ID}.interval2Enable` || 
                   setting.key === `${MODULE_ID}.interval2Number` || 
                   setting.key === `${MODULE_ID}.interval2Color` ||
                   setting.key === `${MODULE_ID}.interval3Enable` || 
                   setting.key === `${MODULE_ID}.interval3Number` || 
                   setting.key === `${MODULE_ID}.interval3Color`) {
            // Refresh the tracker window when interval settings change
            if (turnTrackerInstance.rendered) {
                turnTrackerInstance.render();
            }
        }
    });
    
    // Make available globally for console access
    window.dungeonTurnTracker = turnTrackerInstance;
    
    console.log(`${MODULE_ID} | Initialization complete`);
    console.log(`${MODULE_ID} | Chat commands: /turntracker, /tt`);
    console.log(`${MODULE_ID} | Console access: window.dungeonTurnTracker.render(true)`);
});