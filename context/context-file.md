# App Blueprint Context File

---

## **1. Project Breakdown**

### **App Name:** ThreadTracker MVP
### **Platform:** Chrome Extension for Outlook Web
### **App Summary:**  
ThreadTracker is a Chrome extension that identifies and manages stalled email threads in Outlook Web. This MVP version focuses on the core functionality: detecting threads without clear resolution, visualizing thread status directly in the Outlook Web interface, providing basic follow-up tools, and tracking thread progress. The extension helps knowledge workers prevent important conversations from falling through the cracks, improving communication efficiency and reducing decision delays.

### **Primary Use Case:**  
Productivity tool for identifying and resolving stalled email threads within Outlook Web.

### **Authentication Requirements:**  
- **User Accounts:** Required (Microsoft account OAuth authentication).
- **Guest Users:** Not supported in MVP.
- **Social Login:** Microsoft 365 authentication only.
- **User Roles:** Single user role in MVP (admin features planned for future versions).

---

## **2. Core Features**

1. **Thread Detection Engine:**  
   - Algorithm to identify email threads without response for a set time period
   - Detection of questions without answers within thread content
   - Classification of threads as active, stalled, or resolved
   - Basic exclusion rules for specific contacts or domains
   - Configurable timeframe thresholds (e.g., 3 days, 1 week)

2. **Status Visualization:**  
   - Color-coded visual indicators in the Outlook Web interface
   - Simple icon system showing thread status (awaiting reply, stalled, resolved)
   - Thread list filtering option to focus on stalled threads
   - Basic tooltip showing thread age and status on hover
   - Toggle to enable/disable visual indicators

3. **Reminder System:**  
   - Notification when tracked threads become stalled
   - Option to snooze reminders for specific threads
   - Basic reminder scheduling (today, tomorrow, next week)
   - Mark thread as resolved to dismiss reminders
   - Chrome desktop notifications for critical reminders

4. **Follow-up Tools:**  
   - Pre-defined templates for follow-up emails
   - One-click creation of follow-up draft emails for stalled threads
   - Basic thread summary included in follow-up drafts
   - Thread resolution tracking
   - Thread history view showing activity timeline

---

## **3. User Flow**

1. **Installation & Setup:**  
   - User installs the ThreadTracker extension from Chrome Web Store
   - User grants necessary permissions for Outlook Web access
   - User authenticates with Microsoft account via OAuth
   - User completes brief onboarding wizard with preference selection

2. **Thread Monitoring:**  
   - Extension automatically scans emails when Outlook Web is open
   - Visual indicators appear next to emails in the inbox view
   - User can hover over indicators to see thread status details
   - User can toggle thread tracking on/off via extension popup

3. **Thread Management:**  
   - User clicks on a stalled thread indicator to see options
   - User can choose to follow up, snooze, or mark as resolved
   - When choosing follow up, user selects template and edits draft
   - User can add custom notes to tracked threads for context

4. **Reminder Handling:**  
   - User receives notifications for stalled threads based on settings
   - User can click notification to open the thread directly
   - User manages pending reminders via extension popup interface
   - User can adjust reminder schedule for individual threads

5. **Basic Reporting:**  
   - User accesses simple dashboard showing thread statistics
   - View displays counts of active, stalled, and resolved threads
   - User can see average resolution time for threads
   - Basic data visualization shows thread status distribution

---

## **4. Design and UI/UX**

### **Visual Design Guidelines:**  
- **Color Palette:**  
  - Primary: #0078D4 (Microsoft blue for Outlook consistency)
  - Secondary: #333333 (Dark gray for UI elements)
  - Success: #107C10 (Green for resolved threads)
  - Warning: #FFB900 (Amber for threads needing attention)
  - Danger: #D83B01 (Red for critical/overdue threads)

- **Typography:**  
  - Primary Font: Roboto (web-friendly, clean font for extension UI)
  - Font Sizes: 14px body, 16px headers, 12px labels
  - Font Weights: 400 regular, 500 medium, 700 bold

- **Layout:**  
  - Extension popup: 320px width, vertically scrollable
  - Compact list views with clear hierarchy
  - Sidebar panel for detailed thread information
  - Card-based design for thread information display

### **UX Guidelines:**  
- **Minimal Interference:** Extension should add value without disrupting normal email workflow.
- **Obvious Indicators:** Status indicators should be visible but not distracting.
- **Quick Actions:** Common actions should be accessible with 1-2 clicks.
- **Consistent Patterns:** Use familiar UI patterns from email applications.
- **Performance Priority:** Ensure minimal impact on Outlook Web performance.
- **Helpful Defaults:** Provide sensible default settings that work for most users.

---

## **5. Technical Implementation**

### **Frontend:**  
- **Framework:** React 18 with TypeScript for UI components.
- **State Management:** React Context API for simpler state requirements in MVP.
- **UI Components:** Custom components with Material-UI inspiration.
- **Extension Structure:**
  - Popup: React application for user interface
  - Content Script: DOM manipulation for Outlook Web integration
  - Background Script: Thread monitoring and notifications
- **API Client:** Axios for backend communication.

### **Backend:**  
- **Framework:** Python 3.9+ with FastAPI for REST endpoints.
- **Authentication:** OAuth 2.0 with Microsoft identity platform.
- **Database:** PostgreSQL for user data and thread tracking.
- **Email Processing:** NLTK for basic natural language processing.
- **Endpoints:**
  - User authentication and profile management
  - Thread status tracking and updates
  - Reminder management
  - Analytics data retrieval

### **Deployment Strategy:**  
- **Extension:** Chrome Web Store for distribution.
- **Backend API:** Azure App Service (Basic tier).
- **Database:** Azure Database for PostgreSQL (General Purpose).
- **Monitoring:** Basic Application Insights setup.
- **CI/CD:** GitHub Actions for automated builds and testing.
- **Environment Strategy:** Development, Staging, and Production environments.

---

## **6. Workflow Links and Setup Instructions**

### **Tools and Resources:**  
- **Development Tools:** 
  - Visual Studio Code with Chrome extension development tools
  - Git for version control
  - Node.js v16+ and npm for frontend development
  - Python 3.9+ for backend development
  - Docker for containerized development and testing
  - Postman for API testing

- **Documentation:**
  - Chrome Extension API: https://developer.chrome.com/docs/extensions/
  - Microsoft Graph API: https://developer.microsoft.com/en-us/graph
  - FastAPI: https://fastapi.tiangolo.com/
  - React: https://reactjs.org/docs/getting-started.html

### **Setup Instructions:**  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/your-org/threadtracker-mvp.git  
   cd threadtracker-mvp  
   ```  

2. Set up extension development environment:  
   ```bash  
   cd extension  
   npm install  
   # Configure development environment  
   cp .env.example .env.local  
   # Start development build with hot reload  
   npm run dev  
   ```  

3. Set up backend development environment:  
   ```bash  
   cd backend  
   # Create and activate virtual environment  
   python -m venv venv  
   source venv/bin/activate  # On Windows: venv\Scripts\activate  
   # Install dependencies  
   pip install -r requirements.txt  
   # Configure environment variables  
   cp .env.example .env  
   # Start development server  
   uvicorn app.main:app --reload  
   ```  

4. Load the extension in Chrome for testing:  
   ```bash  
   # In Chrome, go to chrome://extensions/
   # Enable Developer Mode (toggle in top-right)
   # Click "Load unpacked" and select the extension/dist directory
   # The extension should now appear in your browser toolbar
   ```  

5. Build for production:  
   ```bash  
   # Build extension  
   cd extension  
   npm run build  
   
   # Build backend  
   cd backend  
   docker build -t threadtracker-api:v1 .  
   ```  

6. Deploy to staging environment:  
   ```bash  
   # Deploy backend to Azure App Service  
   az webapp up --name threadtracker-api-staging --resource-group threadtracker-staging  
   
   # Package extension for Chrome Web Store  
   cd extension  
   npm run package  
   # This creates a zip file in the dist directory ready for upload to the Chrome Web Store
   ```  

---

This context document outlines the MVP version of ThreadTracker, focusing on essential features for thread detection and management while maintaining a path for future enhancements. The MVP aims to validate core functionality and user value before expanding to more advanced capabilities.