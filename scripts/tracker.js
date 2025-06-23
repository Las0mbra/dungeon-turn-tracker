/**
 * Main DungeonTurnTracker Application class
 */

window.DungeonTurnTracker = window.DungeonTurnTracker || {};

window.DungeonTurnTracker.TrackerApp = class extends Application {
    constructor() {
        super();
        this.checkboxStates = {};
        this.currentPage = 1;
        this.checkboxesPerPage = window.DungeonTurnTracker.CONFIG.DEFAULTS.CHECKBOXES_PER_PAGE;
        console.log(`${window.DungeonTurnTracker.CONFIG.MODULE_ID} | DungeonTurnTracker constructor called`);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Dungeon Turn Tracker",
            template: "modules/dungeon-turn-tracker/templates/turn-tracker.html",
            width: 450,
            height: 450,
            resizable: true,
            classes: ["dungeon-turn-tracker-app"]
        });
    }

    getData() {
        const { MODULE_ID } = window.DungeonTurnTracker.CONFIG;
        console.log(`${MODULE_ID} | Getting data for render`);
        
        const numCheckboxes = game.settings.get(MODULE_ID, 'numCheckboxes');
        const checkboxLabel = game.settings.get(MODULE_ID, 'checkboxLabel');
        
        console.log(`${MODULE_ID} | numCheckboxes: ${numCheckboxes}, label: ${checkboxLabel}`);
        
        // Calculate pagination
        const totalPages = Math.ceil(numCheckboxes / this.checkboxesPerPage);
        const startIndex = (this.currentPage - 1) * this.checkboxesPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.checkboxesPerPage, numCheckboxes);
        
        const checkboxes = [];
        for (let i = startIndex; i <= endIndex; i++) {
            checkboxes.push({
                id: i,
                label: `${checkboxLabel} ${i}`,
                checked: this.checkboxStates[i] || false
            });
        }

        const data = {
            checkboxes: checkboxes,
            isGM: game.user.isGM,
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
        
        const { MODULE_ID } = window.DungeonTurnTracker.CONFIG;
        console.log(`${MODULE_ID} | Data:`, data);
        return data;
    }

    async _renderInner(data) {
        const { MODULE_ID } = window.DungeonTurnTracker.CONFIG;
        console.log(`${MODULE_ID} | _renderInner called with data:`, data);
        try {
            const html = await super._renderInner(data);
            console.log(`${MODULE_ID} | Template rendered successfully`);
            return html;
        } catch (error) {
            console.error(`${MODULE_ID} | Template render error:`, error);
            throw error;
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        
        html.find('.checkbox-column input[type="checkbox"]').change((event) => {
            const checkboxId = parseInt(event.target.dataset.id);
            const isChecked = event.target.checked;
            
            this.updateCheckbox(checkboxId, isChecked);
        });

        html.find('#reset-all').click(() => {
            this.resetAllCheckboxes();
        });

        html.find('#prev-page').click(() => {
            this.previousPage();
        });

        html.find('#next-page').click(() => {
            this.nextPage();
        });

        html.find('#page-input').change((event) => {
            const page = parseInt(event.target.value);
            this.goToPage(page);
        });
    }

    updateCheckbox(checkboxId, isChecked) {
        const { SOCKET } = window.DungeonTurnTracker.CONFIG;
        this.checkboxStates[checkboxId] = isChecked;
        
        game.socket.emit(SOCKET, {
            type: 'updateCheckbox',
            checkboxId: checkboxId,
            isChecked: isChecked,
            userId: game.user.id
        });

        this.render();
    }

    resetAllCheckboxes() {
        const { SOCKET } = window.DungeonTurnTracker.CONFIG;
        this.checkboxStates = {};
        
        game.socket.emit(SOCKET, {
            type: 'resetAll',
            userId: game.user.id
        });

        this.render();
        ui.notifications.info("All checkboxes reset!");
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.render();
        }
    }

    nextPage() {
        const { MODULE_ID } = window.DungeonTurnTracker.CONFIG;
        const numCheckboxes = game.settings.get(MODULE_ID, 'numCheckboxes');
        const totalPages = Math.ceil(numCheckboxes / this.checkboxesPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.render();
        }
    }

    goToPage(page) {
        const { MODULE_ID } = window.DungeonTurnTracker.CONFIG;
        const numCheckboxes = game.settings.get(MODULE_ID, 'numCheckboxes');
        const totalPages = Math.ceil(numCheckboxes / this.checkboxesPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.render();
        }
    }

    handleSocketMessage(data) {
        if (data.type === 'updateCheckbox') {
            this.checkboxStates[data.checkboxId] = data.isChecked;
            this.render();
        } else if (data.type === 'resetAll') {
            this.checkboxStates = {};
            this.render();
        }
    }
};