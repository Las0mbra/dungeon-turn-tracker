// tracker.js
export default class TrackerModule {
    static id = 'dungeon-turn-tracker';
    
    static settings = {
        numBoxes: 'numBoxes'
    }

    static init() {
        game.settings.register(this.id, this.settings.numBoxes, {
            name: "Number of Boxes",
            hint: "Choose the number of boxes to display (1-30)",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 1,
                max: 30,
                step: 1
            },
            default: 10,
            onChange: () => {
                // Refresh UI when setting changes
                if (this.trackerApp) {
                    this.trackerApp.render(true);
                }
            }
        });
    }

    static ready() {
        this.trackerApp = new TrackerApplication();
        this.trackerApp.render(true);
    }
}

class TrackerApplication extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "tracker-app",
            template: `modules/${TrackerModule.id}/templates/tracker.hbs`,
            title: "Tracker",
            width: 300,
            height: "auto",
            resizable: false
        });
    }

    getData() {
        const numBoxes = game.settings.get(TrackerModule.id, TrackerModule.settings.numBoxes);
        const boxes = Array(numBoxes).fill().map((_, i) => ({
            id: i,
            checked: false
        }));
        
        // Group boxes into rows of 10
        const rows = [];
        for (let i = 0; i < boxes.length; i += 10) {
            rows.push(boxes.slice(i, i + 10));
        }

        return {
            rows: rows
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.tracker-box').on('click', this._onBoxClick.bind(this));
    }

    _onBoxClick(event) {
        const box = event.currentTarget;
        box.classList.toggle('checked');
    }
}

Hooks.once('init', () => {
    TrackerModule.init();
});

Hooks.once('ready', () => {
    TrackerModule.ready();
});