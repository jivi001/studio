// src/firebase/errors.ts

/**
 * Defines the context for a Firestore security rule violation.
 * This information is used to construct a detailed error message
 * that helps developers debug their security rules.
 */
export type SecurityRuleContext = {
  // The path of the document or collection being accessed (e.g., 'users/userId123').
  path: string;
  // The type of operation that was denied (e.g., 'get', 'list', 'create', 'update', 'delete').
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  // The data that was being sent with a write request (for 'create' or 'update').
  requestResourceData?: any;
};

/**
 * A custom error class for Firestore permission errors.
 *
 * This error is designed to be thrown in a development environment to provide
 * detailed, actionable feedback directly in the Next.js error overlay. It
 * transforms a generic "Missing or insufficient permissions" error into a
 * rich, structured object that explains exactly what failed and why.
 */
export class FirestorePermissionError extends Error {
  // The structured context of the security rule violation.
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    // We construct a detailed error message that will be displayed in the console
    // and in the Next.js error overlay.
    const message = `FirestoreError: Missing or insufficient permissions.
The following request was denied by Firestore Security Rules:
${JSON.stringify({ ...context, auth: 'See browser console for user auth details.' }, null, 2)}`;

    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This is for V8's stack trace API (used by Node.js and Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirestorePermissionError);
    }
  }

  /**
   * A method to get a string representation of the error,
   * which can be useful for logging in production.
   */
  public toString(): string {
    return this.message;
  }
}
