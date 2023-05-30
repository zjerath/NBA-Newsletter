import type { IncomingMessage, ServerResponse } from 'http';
export declare const createServerHandler: ({ port, hostname, dir, minimalMode, }: {
    port: number;
    hostname: string;
    dir: string;
    minimalMode: boolean;
}) => Promise<(req: IncomingMessage, res: ServerResponse) => Promise<void>>;
