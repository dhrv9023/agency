/**
 * Ambient type declarations for Next.js App Router and Edge runtime
 */

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly DATABASE_URL?: string;
    readonly DIRECT_URL?: string;
    readonly AUTH_SECRET?: string;
    readonly AUTH_SESSION_COOKIE_NAME?: string;
    readonly AUTH_SESSION_MAX_AGE?: string;
    readonly INITIAL_ADMIN_EMAIL?: string;
    readonly INITIAL_ADMIN_NAME?: string;
    readonly INITIAL_ADMIN_PASSWORD?: string;
    readonly NEXT_PUBLIC_SITE_URL?: string;
    readonly NEXT_PUBLIC_ADMIN_URL?: string;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
  exit(code?: number): never;
};

declare module 'next' {
  export interface Metadata {
    title?: string | { default: string; template: string };
    description?: string;
    robots?: {
      index?: boolean;
      follow?: boolean;
    };
    [key: string]: unknown;
  }
}

declare module 'next/link' {
  import React from 'react';
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    replace?: boolean;
    scroll?: boolean;
    prefetch?: boolean;
    children?: React.ReactNode;
  }
  const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

declare module 'next/navigation' {
  export interface AppRouterInstance {
    push(href: string, options?: { scroll?: boolean }): void;
    replace(href: string, options?: { scroll?: boolean }): void;
    refresh(): void;
    back(): void;
    forward(): void;
    prefetch(href: string): void;
  }

  export function useRouter(): AppRouterInstance;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams(): Record<string, string | string[]>;
  export function redirect(url: string): never;
  export function notFound(): never;
}

declare module 'next/headers' {
  export interface RequestCookie {
    name: string;
    value: string;
  }

  export interface ResponseCookie {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    sameSite?: 'lax' | 'strict' | 'none';
    secure?: boolean;
    httpOnly?: boolean;
  }

  export interface ReadonlyRequestCookies {
    get(name: string): RequestCookie | undefined;
    getAll(): RequestCookie[];
    has(name: string): boolean;
    set(name: string, value: string, options?: Partial<ResponseCookie>): this;
    delete(name: string): this;
  }

  export function cookies(): Promise<ReadonlyRequestCookies>;
  export function headers(): Promise<Headers>;
}

declare module 'next/server' {
  export interface NextRequest extends Request {
    nextUrl: URL;
    cookies: {
      get(name: string): { name: string; value: string } | undefined;
      getAll(): { name: string; value: string }[];
      has(name: string): boolean;
    };
  }

  export class NextResponse extends Response {
    static next(): NextResponse;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
    static json<T = unknown>(body: T, init?: ResponseInit): NextResponse;
  }
}
