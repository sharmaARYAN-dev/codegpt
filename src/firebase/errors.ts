export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `Firestore Permission Denied: Cannot ${context.operation} on ${context.path}.`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }

  public toContextObject() {
    return {
      message: this.message,
      context: this.context,
    };
  }

  public toString() {
    return JSON.stringify(this.toContextObject(), null, 2);
  }
}
