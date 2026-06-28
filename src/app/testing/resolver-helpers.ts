import { Observable, firstValueFrom, isObservable } from 'rxjs';

export async function resolveRouteData<T>(result: unknown): Promise<T> {
  if (isObservable(result)) {
    return firstValueFrom(result as Observable<T>);
  }
  if (result instanceof Promise) {
    return result as Promise<T>;
  }
  return result as T;
}
