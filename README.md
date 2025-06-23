# Dungeon Turn Tracker

A sophisticated, feature-rich turn tracking module for FoundryVTT that transforms simple checkbox tracking into a powerful campaign management tool. Perfect for tracking combat rounds, exploration phases, resource management, story beats, and any sequential game events.

## 🎯 What It Does

The Dungeon Turn Tracker provides an elegant, floating interface that allows GMs and players to track progress through numbered checkboxes. Beyond basic turn tracking, it offers advanced interval highlighting, multi-user synchronization, and intelligent visual cues that help organize complex campaign mechanics.

## ✨ Core Features

### 📋 **Smart Checkbox Management**
- **Configurable Quantity**: Set anywhere from 1 to 200 checkboxes
- **Dynamic Pagination**: Automatically organizes large numbers into manageable pages (5-100 per page)
- **Page-Specific Notes**: Add custom text notes to each page for context
- **Persistent State**: Checkbox states and notes are maintained across sessions

### 🎨 **Advanced Interval Highlighting System**
Experience the module's most powerful feature - a **triple interval highlighting system** that brings visual organization to your tracking:

#### **Three Independent Interval Systems**
- **Interval 1**: Primary events (default: every 3rd checkbox, yellow)
- **Interval 2**: Secondary phases (default: every 5th checkbox, blue)  
- **Interval 3**: Major milestones (default: every 10th checkbox, green)

#### **Six Beautiful Color Options**
- 🟡 **Yellow**: Warm, attention-grabbing highlights
- 🟠 **Orange**: Energetic, milestone marking
- 🔵 **Blue**: Cool, phase indication
- 🟢 **Green**: Success, progress markers
- 🟣 **Purple**: Special events, magic phases
- 🔴 **Red**: Danger, critical intervals

#### **Intelligent Collision Handling**
When multiple intervals overlap on the same checkbox:
- **Priority System**: Interval 1 > Interval 2 > Interval 3
- **Visual Indicators**: Multi-interval dot (●) for double overlaps
- **Epic Convergence**: ⭐ **Golden star effect** when all three intervals align
- **Enhanced Effects**: Pulsing animations, enhanced shadows, and glowing borders

### 🌟 **Spectacular Triple Convergence**
When all three intervals converge on a single checkbox, witness the **Golden Convergence Effect**:
- ✨ **Radial golden gradient** background
- ⭐ **Twinkling golden star** indicator
- 🌟 **Pulsing glow animation** with enhanced shadows
- 🎇 **Sparkle overlay** with rotating border effects
- 📏 **Enlarged scale** (105%) that floats above other checkboxes

### 🎮 **User Experience Excellence**

#### **Floating Button Interface**
- **Draggable Positioning**: Move the tracker button anywhere on screen
- **Position Memory**: Remembers placement between sessions
- **Lock Option**: Prevent accidental dragging
- **Reset to Center**: Built-in function to center the button

#### **Multi-User Synchronization**
- **Player Sync Setting**: Choose whether players can interact or just GMs
- **Real-time Updates**: Changes appear instantly for all connected users
- **Optimized Performance**: Batched updates prevent lag during rapid clicking
- **Smooth Operation**: Debounced rendering maintains 60fps performance

#### **Theme Support**
- **Light Theme**: Clean, professional appearance with subtle shadows
- **Dark Theme**: Rich, high-contrast styling perfect for dark environments
- **Automatic Adaptation**: All interval colors optimized for both themes

## 🔧 Configuration Options

### **Basic Settings**
- **Number of Checkboxes**: 1-200 total checkboxes
- **Checkboxes Per Page**: 5-100 checkboxes displayed per page
- **Player Sync**: Enable/disable player interaction (GM-only when disabled)
- **Theme**: Light or Dark visual theme

### **Interval Settings** (Per System)
- **Enable/Disable Toggle**: Turn each interval system on/off independently
- **Interval Number**: Set the frequency (every Nth checkbox, 2-50 range)
- **Color Selection**: Choose from six carefully designed color schemes

### **UI Settings**
- **Button Position**: Automatically saved and restored
- **Lock Position**: Prevent accidental button movement
- **Reset to Defaults**: One-click restoration of all settings

## 🚀 Performance Features

### **Optimized for Heavy Use**
- **Debounced Rendering**: Smooth 60fps performance even with rapid clicking
- **Batched Socket Updates**: Efficient network communication prevents lag
- **Memory Management**: Proper cleanup prevents resource leaks
- **Responsive Design**: Maintains performance with hundreds of checkboxes

## 💡 Use Case Examples

### **D&D Combat Tracking**
- **Interval 1** (every 3, yellow): Initiative resets, concentration checks
- **Interval 2** (every 6, blue): Lair actions, environmental effects
- **Interval 3** (every 10, green): Major phase transitions
- **Triple Convergence** (30): Epic moment when all systems align!

### **Exploration Campaign**
- **Interval 1** (every 4, orange): Random encounters, resource checks
- **Interval 2** (every 8, purple): Weather changes, rest opportunities
- **Interval 3** (every 12, red): Major discoveries, story beats

### **Resource Management**
- **Interval 1** (every 2, yellow): Minor resource depletion
- **Interval 2** (every 5, blue): Moderate challenges
- **Interval 3** (every 10, green): Major resource refresh points

## 🎯 Quick Start Guide

1. **Install & Enable**: Add to FoundryVTT and enable in module settings
2. **Configure Basics**: Set total checkboxes (recommended: 30-60 for most campaigns)
3. **Setup Intervals**: Enable and configure 1-3 interval systems based on your needs
4. **Position Button**: Drag the floating button to your preferred screen location
5. **Start Tracking**: Click checkboxes to track progress - watch for beautiful interval highlights!

## 🛠️ Chat Commands

- `/turntracker` or `/tt` - Toggle the tracker window open/closed
- Works for all users when Player Sync is enabled
- GM-only when Player Sync is disabled

## 📱 Accessibility

- **High Contrast**: All colors maintain excellent readability
- **Clear Visual Hierarchy**: Different effect levels are easily distinguishable
- **Responsive Design**: Works on various screen sizes
- **Intuitive Controls**: Drag-and-drop interface with clear visual feedback

## 🔄 Version Information

**Current Version**: 2.0.0  
**Compatibility**: FoundryVTT v12+  
**Performance**: Optimized for 1-200 checkboxes with smooth 60fps operation  
**Network**: Efficient batched synchronization for multi-user environments

---

*Transform your campaign tracking from mundane checkboxes into a visually stunning, highly organized system that brings clarity and excitement to every session!*