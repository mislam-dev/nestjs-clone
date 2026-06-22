export interface OnModuleInit {
  onModuleInit(): void;
}

export interface OnModuleDestroy {
  onModuleDestroy(): void;
}

export interface OnModuleDebug {
  onModuleDebug(): void; // for debugging purpose
}

export interface OnModuleError {
  onModuleError(): void; // for error handling
}
