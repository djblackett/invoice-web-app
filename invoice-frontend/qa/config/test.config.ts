/**
 * Test Configuration and Constants
 * Centralized configuration for E2E tests
 */

export const TEST_CONFIG = {
  // Timeouts
  timeouts: {
    default: 30000, // 30 seconds
    short: 5000, // 5 seconds
    medium: 10000, // 10 seconds
    long: 60000, // 60 seconds
    navigation: 15000, // 15 seconds
    api: 10000, // 10 seconds
  },

  // Retry configuration
  retry: {
    default: 0,
    ci: 1,
  },

  // URLs
  urls: {
    base: process.env.TEST_BASE_URL || "https://localhost:3000",
    backend: process.env.VITE_BACKEND_URL || "https://localhost:4000/graphql",
    invoices: "/#/invoices",
    login: "/login",
  },

  // Test data defaults
  defaults: {
    paymentTerms: ["Net 1 Day", "Net 7 Days", "Net 14 Days", "Net 30 Days"],
    invoiceStatuses: ["Draft", "Pending", "Paid"],
  },

  // Selectors (data-testid values)
  selectors: {
    // Buttons
    newInvoiceButton: "newInvoiceButton",
    filterButton: "filterButton",
    loginButton: "login-button",
    logoutButton: "logout-button",
    darkModeButton: "dark-mode-button",
    markAsPaidButton: "mark-as-paid",

    // Common elements
    avatar: "avatar",
    logo: "logo",
    welcomeText: "welcome-text",

    // Invoice form
    invoiceDate: "invoiceDate",
    itemsContainer: "items-container",
    invoiceItem: "invoice-item",

    // Theme
    sunIcon: "sun",
    moonIcon: "moon",

    // Filters
    draftFilter: "draft-filter",
    pendingFilter: "pending-filter",
    paidFilter: "paid-filter",
  },

  // Screenshots
  screenshots: {
    enabled: process.env.NODE_ENV === "CI" || process.env.DEBUG_SCREENSHOTS === "true",
    path: "debug-screenshots",
  },

  // Video recording
  video: {
    enabled: true,
    mode: "retain-on-failure" as const,
  },

  // Network
  network: {
    ignoreHTTPSErrors: true,
  },
} as const;

/**
 * Common text constants used in tests
 */
export const TEXT_CONSTANTS = {
  welcome: "Please login to view your invoices",
  editInvoice: "Edit Invoice",
  newInvoice: "New Invoice",
  billFrom: "Bill From",
  billTo: "Bill To",
  invoiceDate: "Invoice Date",
  paymentTerms: "Payment Terms",
  projectDescription: "Project Description",
  itemList: "Item List",
  addNewItem: "+ Add New Item",

  // Buttons
  save: "Save",
  saveAsDraft: "Save as Draft",
  discard: "Discard",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  markAsPaid: "Mark as Paid",
  goBack: "Go back",

  // Status
  draft: "Draft",
  pending: "Pending",
  paid: "Paid",

  // Messages
  invoiceCreated: "Invoice created successfully",
  invoiceUpdated: "Invoice updated successfully",
  invoiceDeleted: "Invoice deleted successfully",
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  graphql: "/graphql",
  testSetup: "/test-setup",
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  requiredField: "This field is required",
  invalidEmail: "Please enter a valid email",
  invalidDate: "Please enter a valid date",
  networkError: "Network error occurred",
  unauthorized: "Unauthorized",
} as const;

/**
 * Test tags for filtering tests
 */
export const TEST_TAGS = {
  smoke: "@smoke",
  regression: "@regression",
  critical: "@critical",
  auth: "@auth",
  crud: "@crud",
  ui: "@ui",
  api: "@api",
  slow: "@slow",
  fast: "@fast",
} as const;

/**
 * Helper to get environment-specific config
 */
export function getEnvConfig() {
  return {
    isCI: process.env.CI === "true" || process.env.NODE_ENV === "CI",
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    testLogin: process.env.TEST_LOGIN,
    testPassword: process.env.TEST_PASSWORD,
  };
}

/**
 * Helper to get timeout based on environment
 */
export function getTimeout(type: keyof typeof TEST_CONFIG.timeouts = "default"): number {
  const config = getEnvConfig();
  const baseTimeout = TEST_CONFIG.timeouts[type];

  // Increase timeouts in CI
  return config.isCI ? baseTimeout * 1.5 : baseTimeout;
}

/**
 * Helper to check if screenshots should be taken
 */
export function shouldTakeScreenshot(): boolean {
  return TEST_CONFIG.screenshots.enabled;
}

/**
 * Helper to get retry count based on environment
 */
export function getRetryCount(): number {
  const config = getEnvConfig();
  return config.isCI ? TEST_CONFIG.retry.ci : TEST_CONFIG.retry.default;
}
