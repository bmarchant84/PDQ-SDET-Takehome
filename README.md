# PDQ QA SDET Technical Assignment

This repository contains my solution for the PDQ SDET Technical Assessment. It includes a Playwright test suite built on the Page Object Model (POM), a custom PowerShell automation runner, and documented bug reports.  

---

## 📂 Project Topology

    .
    ├── tests/
    │   ├── todo.spec.ts        # Refactored test suite with Bug-Detection & Performance tests
    │   └── todoPage.ts         # Page Object Model (POM) containing locators and actions
    ├── run-tests.ps1           # PowerShell 7 automation script (Runs tests & parses JSON)
    ├── playwright.config.ts    # Multi-browser setup (Chromium, Firefox, Webkit)
    ├── results.json            # Generated JSON output (Created/Updated during execution)
    └── README.md               # Setup and execution instructions

---

## Installation & Setup

### 1. Prerequisites

- **Node.js**: v18.13.0 or higher  
- **PowerShell 7**: Required for the automation script  

#### Install PowerShell 7

**Mac:**
    brew install --cask powershell

**Windows:**
Download PowerShell 7

---

### 2. Dependencies

From the project root, run:

    npm install
    npx playwright install

---

## Running the Tests

### Option 1: PowerShell Automation (Requirement #4)

The `run-tests.ps1` script is a professional-grade wrapper that:

- Initializes the environment  
- Executes the test suite using the JSON reporter  
- Parses `results.json` as a PowerShell object  
- Determines the final exit status  

#### Execution

**Mac/Linux:**
    pwsh ./run-tests.ps1

**Windows:**
    ./run-tests.ps1

#### Flags

- `-ShowBrowser`: Runs tests in headed mode (UI visible)

#### Example

    pwsh ./run-tests.ps1 -ShowBrowser

---

### Option 2: Playwright UI Mode

Use the interactive "Time Travel" debugger and visual runner:

    npx playwright test --ui

---

## 📋 Technical Notes & Requirements Mapping

### 1. Page Object Model (POM)

Following requirement #2:

- All locators and page-specific actions are abstracted into:
  
      tests/todoPage.ts

- This keeps `todo.spec.ts` clean, readable, and maintainable.

---

### 2. Custom Test Cases

Requirement #3: Extended the test suite with comprehensive scenarios. Documentation for manual test cases is included in the header of `todo.spec.ts`, while automated implementations follow the existing performance benchmarks.

---

### 3. Environment Integrity (macOS 12 Compatibility)

- Executed on **macOS 12 (Monterey)**  
- Newer Playwright WebKit binaries may fail to launch on this OS  

#### Solution

The PowerShell script:

- Parses `results.json` → `errors.Count`  
- Returns exit code `1` if browser launch fails  

This demonstrates **defensive scripting** to protect CI/CD pipeline integrity.

---

### 4. Bug Reporting

- Three primary bugs were identified and automated
- One enhancement/usability issue reported  
- Detailed bug reports were submitted as GitHub Issues in this repository  