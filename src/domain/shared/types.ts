// Shared Domain Types
export interface DomainEvent {
  readonly id: string;
  readonly timestamp: Date;
  readonly type: string;
}

export interface ValueObject {
  equals(other: ValueObject): boolean;
}

export interface Entity {
  readonly id: string;
  equals(other: Entity): boolean;
}

// Common Value Objects
export class Timestamp implements ValueObject {
  constructor(private readonly _value: Date) {}

  get value(): Date {
    return new Date(this._value.getTime());
  }

  equals(other: ValueObject): boolean {
    return (
      other instanceof Timestamp &&
      this._value.getTime() === other._value.getTime()
    );
  }

  static now(): Timestamp {
    return new Timestamp(new Date());
  }

  static fromUnix(unixTimestamp: number): Timestamp {
    return new Timestamp(new Date(unixTimestamp * 1000));
  }
}

export class Identifier implements ValueObject {
  constructor(private readonly _value: string) {}

  get value(): string {
    return this._value;
  }

  equals(other: ValueObject): boolean {
    return other instanceof Identifier && this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}

// Common Errors
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", context);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, identifier: string) {
    super(`${resource} with id ${identifier} not found`, "NOT_FOUND", {
      resource,
      identifier,
    });
    this.name = "NotFoundError";
  }
}

// Result Pattern for Error Handling
export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  constructor(public readonly value: T) {}

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Failure<never> {
    return false;
  }
}

export class Failure<E> {
  constructor(public readonly error: E) {}

  isSuccess(): this is Success<never> {
    return false;
  }

  isFailure(): this is Failure<E> {
    return true;
  }
}
