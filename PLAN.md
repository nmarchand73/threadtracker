# ThreadTracker Development Plan

## 📆 Daily Log
> Add new entries at the top using H3 for dates

### 2024-04-08 (Week 1 Complete)
- **Time:** 240min
- **Slice:** Migration
- **Done:**
  - Completed Firefox extension migration
  - Fixed build process issues
  - Created automated setup script with detailed logging
  - Added extensive error handling and troubleshooting
  - Fixed browser-polyfill.js loading issues
  - Created extension_ready_to_load directory with fully working extension
  - Successfully tested in Firefox
  - Committed all code to GitHub repository
- **Next:** 
  - Implement Microsoft authentication (Slice 1)
  - Complete thread reading functionality
- **Notes:** 
  - Week 1 objectives completed successfully
  - Extension now works properly in Firefox

### 2024-04-08
- **Time:** 180min
- **Slice:** Migration
- **Done:**
  - Converted extension from Chrome to Firefox
  - Updated manifest.json to Firefox standard (manifest v2)
  - Added WebExtension polyfill for cross-browser compatibility
  - Created browserAPI utility module for consistent API usage
  - Updated build process for Firefox
  - Generated SVG icons for better Firefox compatibility
  - Updated all documentation for Firefox
- **Next:** 
  - Complete Slice 1 features
  - Test extension functionality in Firefox
- **Notes:** 
  - Will maintain Chrome compatibility via polyfill but primary focus is now Firefox

### 2024-04-07
- **Time:** 120min
- **Slice:** 1
- **Done:**
  - Set up extension project structure
  - Created manifest.json
  - Implemented basic React components
  - Added placeholder authentication flow
  - Created mock thread reading functionality
- **Next:** 
  - Implement Microsoft OAuth authentication
  - Test extension in Firefox
- **Notes:** 
  - Used placeholder data for threads until authentication is working

### 2024-03-19
- **Time:** 60min
- **Slice:** 1
- **Done:**
  - Created initial project plan
  - Set up repository
- **Next:** 
  - Set up extension manifest
- **Notes:** 
  - Need to review OAuth documentation

---

## 🎯 Development Slices

### ✅ Migration: Firefox Compatibility (COMPLETED)
> Goal: Convert Chrome extension to Firefox WebExtensions API

#### Features & Tasks
- [x] Firefox Manifest
  - [x] Convert manifest.json to version 2
  - [x] Add Firefox-specific settings
  - [x] Update permissions model
- [x] API Compatibility
  - [x] Add WebExtension polyfill
  - [x] Create browserAPI utility
  - [x] Update background script
  - [x] Update content script
- [x] Build Process
  - [x] Configure webpack for Firefox
  - [x] Create SVG icons
  - [x] Update post-build process
  - [x] Create automated setup script
  - [x] Add troubleshooting and error handling
- [x] Documentation
  - [x] Update README.md for Firefox
  - [x] Update SETUP.md with Firefox instructions
  - [x] Add Firefox troubleshooting section

#### BDD Scenarios

**Scenario: Installing the extension in Firefox**
```gherkin
Given I am a user with Firefox browser
When I load the ThreadTracker extension
Then it should be properly installed in Firefox
And all functionality should work as expected
```

**Scenario: Cross-browser API compatibility**
```gherkin
Given I have code that accesses browser extension APIs
When the code runs in either Firefox or Chrome
Then it should use the appropriate API for each browser
And maintain consistent behavior across browsers
```

**Scenario: Building for Firefox**
```gherkin
Given I have the ThreadTracker source code
When I run the build process
Then it should generate a Firefox-compatible extension
And include all necessary polyfills and configurations
```

### Slice 1: View Threads
> Goal: User can authenticate and view email threads

#### Features & Tasks
- [x] Basic Extension
  - [x] Project setup
  - [x] Manifest.json
  - [x] Build process
- [ ] Microsoft Auth
  - [ ] OAuth flow with Microsoft 365
  - [x] Token storage and management
  - [x] Permission handling for Outlook access
- [x] Thread Reading
  - [x] Scan emails in Outlook Web
  - [x] Basic thread list display
  - [x] Simple UI for thread viewing

#### BDD Scenarios

**Scenario: Installing the extension**
```gherkin
Given I am a user with a Firefox browser
When I install the ThreadTracker extension
Then I should be prompted to grant permissions for Outlook access
```

**Scenario: Authenticating with Microsoft**
```gherkin
Given I have installed the ThreadTracker extension
When I click the login button
Then I should be redirected to Microsoft authentication
And after successful login, I should return to Outlook with the extension active
```

**Scenario: Viewing email threads**
```gherkin
Given I am authenticated in the ThreadTracker extension
When I open Outlook Web
Then the extension should scan my emails
And display a list of threads in the extension popup
```

### Slice 2: Thread Status
> Goal: Detect and visualize thread status

#### Features & Tasks
- [ ] Classification
  - [ ] Detect reply timeframes
  - [ ] Identify questions without answers
  - [ ] Track & store thread status
  - [ ] Support exclusion rules for contacts/domains
- [ ] Visual Indicators
  - [ ] Status icons in Outlook Web interface
  - [ ] Color-coded indicators (active/stalled/resolved)
  - [ ] Thread age and status tooltips
  - [ ] Status filtering options

#### BDD Scenarios

**Scenario: Detecting stalled threads**
```gherkin
Given I have emails in my Outlook inbox
When a thread has had no response for the configured timeframe
Then the thread should be marked as "stalled"
And a visual indicator should appear next to the thread in my inbox
```

**Scenario: Filtering threads by status**
```gherkin
Given I have threads with different statuses
When I select a status filter in the extension
Then I should only see threads with the selected status
```

**Scenario: Excluding specific contacts**
```gherkin
Given I have added a contact to my exclusion list
When emails from that contact are processed
Then they should not trigger stalled status regardless of reply time
```

### Slice 3: Reminders
> Goal: Get notified about stalled threads

#### Features & Tasks
- [ ] Basic Reminders
  - [ ] Create/edit reminders for threads
  - [ ] Configure reminder timeframes
  - [ ] Store reminder preferences
- [ ] Notifications
  - [ ] Firefox desktop notifications
  - [ ] Click-to-open thread functionality
  - [ ] Snooze/dismiss actions
  - [ ] Reminder management interface

#### BDD Scenarios

**Scenario: Receiving stalled thread notification**
```gherkin
Given I have a thread that becomes stalled
When the stalled condition is detected
Then I should receive a Firefox desktop notification
And the notification should include the thread subject
```

**Scenario: Snoozing a reminder**
```gherkin
Given I have received a reminder notification
When I click the "snooze" action
Then I should be prompted to select a snooze duration
And the reminder should reappear after the selected time period
```

**Scenario: Managing reminder preferences**
```gherkin
Given I am viewing the extension settings
When I adjust the reminder frequency settings
Then my preferences should be saved
And future reminders should follow the new schedule
```

### Slice 4: Follow-ups
> Goal: Easily respond to stalled threads

#### Features & Tasks
- [ ] Templates
  - [ ] Pre-defined follow-up templates
  - [ ] Template variables
  - [ ] Template management
- [ ] Quick Actions
  - [ ] One-click draft creation
  - [ ] Thread summary in drafts
  - [ ] Follow-up tracking
  - [ ] Thread history timeline

#### BDD Scenarios

**Scenario: Creating a follow-up from template**
```gherkin
Given I am viewing a stalled thread
When I click "Create Follow-up"
Then I should see a list of available templates
And selecting a template should create a draft email
And the draft should include the thread summary
```

**Scenario: Managing templates**
```gherkin
Given I am in the template management section
When I create a new template with variables
Then the template should be saved
And be available when creating follow-ups
```

**Scenario: Tracking thread resolution**
```gherkin
Given I have sent a follow-up for a stalled thread
When a reply is received to that thread
Then the thread status should update to "active"
And the follow-up should be marked as "responded"
```

### Slice 5: Polish & Reporting
> Goal: Get insights and prepare for release

#### Features & Tasks
- [ ] Basic Reporting
  - [ ] Thread statistics dashboard
  - [ ] Active/stalled/resolved counts
  - [ ] Resolution time tracking
  - [ ] Status distribution visualization
- [ ] Enhancements
  - [ ] Performance optimization
  - [ ] UI polish
  - [ ] Onboarding wizard
- [ ] Launch Prep
  - [ ] Firefox Add-on Store listing
  - [ ] Documentation
  - [ ] Optional Chrome Web Store listing

#### BDD Scenarios

**Scenario: Viewing thread statistics**
```gherkin
Given I have been using ThreadTracker for some time
When I open the statistics dashboard
Then I should see counts of active, stalled, and resolved threads
And visualization of thread status distribution
```

**Scenario: Completing onboarding**
```gherkin
Given I have just installed the extension
When I open it for the first time
Then I should see an onboarding wizard
And be guided through initial setup and preferences
```

**Scenario: Performance impact**
```gherkin
Given I am using Outlook Web with ThreadTracker active
When I perform typical email actions
Then the UI should remain responsive
And page load times should not increase significantly
```

---

## ✅ BDD Development Process

### For Each Feature
- [x] Write scenarios before implementation (Given-When-Then)
- [ ] Implement step definitions
- [ ] Develop minimal code to pass scenarios
- [ ] Refactor while maintaining passing tests

---

## 🔄 Browser Compatibility Strategy

### Firefox (Primary)
- Use manifest version 2
- Follow Firefox extension guidelines
- Test on Firefox Developer Edition and stable
- Use native Firefox API names (browser.*)
- Build with WebExtension polyfill included

### Chrome (Secondary)
- Maintain compatibility via WebExtension polyfill
- Test occasionally to ensure compatibility
- Document any Chrome-specific limitations
- Use browserAPI utility for all API calls

### Implementation Approach
- All browser API calls go through the browserAPI utility
- Use Promise-based approach consistent with Firefox API style
- Feature detect capabilities before using them
- Document browser-specific features and limitations

---

## 📈 Progress

- [x] Migration (100%) ✅
- [ ] Slice 1 (80%)
- [ ] Slice 2 (0%)
- [ ] Slice 3 (0%)
- [ ] Slice 4 (0%)
- [ ] Slice 5 (0%)

## 🏆 Milestones
- [x] Week 1: Firefox Extension Migration (Apr 8, 2024) ✅
- [ ] Week 2: Complete Microsoft Authentication & Thread Reading
- [ ] Week 3: Thread Status Implementation
- [ ] Week 4: Reminder System
- [ ] Week 5: Follow-up Templates and Actions
- [ ] Week 6: Final Polish and Firefox Store Release

---

## 🎨 Design References

### Color Palette
- Primary: #0078D4 (Microsoft blue)
- Secondary: #333333 (Dark gray)
- Success: #107C10 (Green for resolved)
- Warning: #FFB900 (Amber for attention needed)
- Danger: #D83B01 (Red for critical/overdue)

### UX Guidelines
- Minimal interference with email workflow
- Status indicators visible but not distracting
- Actions accessible within 1-2 clicks
- Consistent with familiar email patterns
- Performance priority 