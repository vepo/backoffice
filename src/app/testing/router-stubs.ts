import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { of } from 'rxjs';

export function activatedRouteWithData<T extends Record<string, unknown>>(data: T): Partial<ActivatedRoute> {
  return {
    data: of(data),
    paramMap: of(convertToParamMap({}))
  };
}

export function activatedRouteWithParam(
  paramName: string,
  paramValue: string | null,
  data: Record<string, unknown> = {}
): Partial<ActivatedRoute> {
  const paramMap: ParamMap = paramValue != null
    ? convertToParamMap({ [paramName]: paramValue })
    : convertToParamMap({});

  return {
    data: of(data),
    paramMap: of(paramMap)
  };
}
