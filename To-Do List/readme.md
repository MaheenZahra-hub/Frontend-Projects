# Field Notes — Cafe Journal

Field Notes is a lightweight, responsive task management application designed around a cozy "Cafe Journal" aesthetic. Featuring an academic crimson, cream, and luxury gold color profile, the app couples an elegant workspace design with an interactive, animated mascot companion that tracks productivity milestones.

## Application Preview
<img width="1684" height="856" alt="Screenshot 2026-07-13 025149" src="https://github.com/user-attachments/assets/09a1885c-5150-4d55-8153-8e7eef9760c1" />

## Key Features

* **Interactive Task Architecture:** Add, edit, check, and permanently delete notebook entries dynamically with robust input handling.
* **Cozy Mascot Companion:** An interactive SVG mascot provides micro-state speech interactions, grows a stem when tasks are added, and shifts to happy arc eyes when your dashboard hits 100% completion.
* **Inline Task Editing:** Double-click directly on any task text or select the edit button to open an instantaneous, stress-free update box.
* **Dynamic Navigation Filters:** Tab through interactive project filter categories to separate items cleanly by active status, completed items, or look at your entire historical notebook logs.
* **Custom Modals and Alerts:** A native dialog wrapper triggers an editorial assurance modal before deleting your checked workspace tasks.
* **Accessibility and Screen-Reader Sync:** Includes full background announcements for visibility states alongside custom focal indicator flags to ensure assistive accessibility standards are fully met.

## Core Logic and Optimization

The application runs directly inside standard client-side browser modules without external frameworks:

* **Custom Vector Micro-Animations:** Responsive layout tracking leverages clean keyframe definitions to execute light floating movements, spring transformations, and linear gradient transitions.
* **Self-Contained Browser Scope:** Form handling operates securely behind custom scoping wrappers that isolate logical modules from polluting the global client window namespace.
* **Quota-Insulated Storage:** Dedicated local database abstractions monitor browser memory allocation issues directly, integrating immediate alerts if local disk storage quotas run low.

## Technologies Used

* **Front-End Design:** High-contrast editorial HTML5 elements paired with advanced CSS3 grid backgrounds, variable font scaling, dual-layered shadow rendering, and vector components.
* **System Programming:** Pure, modern JavaScript (ES6 Modules) driving immediate DOM tree fragment rendering.
* **Data Persistence:** Browser LocalStorage API to track data states across separate tabs and sessions.
