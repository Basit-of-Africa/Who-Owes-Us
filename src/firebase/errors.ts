/**
 * @fileOverview Specialized error classes for Firestore operations.
 */

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `Firestore Error: Missing or insufficient permissions at path: ${context.path} (operation: ${context.operation})`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This ensures that the stack trace points to the right place
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirestorePermissionError);
    }
  }
}
