import { Injectable } from '@angular/core';
import { TranslateService } from './translate.service';

export interface MapperOptions<T> {
  apiNameSourceConfigs: { default: string; [key: string]: string };
  apiNameTargetConfigs: { default: string; [key: string]: string };
  fieldMappings?: Record<string, keyof T>;
  customTransforms?: Partial<Record<keyof T, (value: any) => any>>;
  sourceName?: string;
  targetName?: string;
}

export interface MapperOptions<T> {
  apiNameSourceConfigs: { default: string; [key: string]: string };
  apiNameTargetConfigs: { default: string; [key: string]: string };
  fieldMappings?: Record<string, keyof T>;
  customTransforms?: Partial<Record<keyof T, (value: any) => any>>;
  sourceName?: string;
  targetName?: string;
}

@Injectable({ providedIn: 'root' })
export class Mapper {
  constructor(private translateService: TranslateService) {}

  map<T extends object>(
    source: any,
    target: T,
    options: MapperOptions<T>
  ): T {
    const fieldMappings = options.fieldMappings || {};
    const customTransforms = options.customTransforms || {};
    const apiNameSourceConfigs = options.apiNameSourceConfigs;
    const apiNameTargetConfigs = options.apiNameTargetConfigs;

    const sourceName = options.sourceName || source?.constructor?.name || 'source';
    const targetName = options.targetName || target?.constructor?.name || 'target';

    const mappedKeys = new Set<string>();
    const unmappedFromSource: Record<string, any> = {};

    // Map source -> target
    for (const sourceKey of Object.keys(source)) {
      const targetKey: string = (fieldMappings as Record<string, any>)[sourceKey] || sourceKey;

      if (targetKey in target) {
        const transform = (customTransforms as Record<string, any>)[targetKey];
        let mappedValue = transform ? transform(source[sourceKey]) : source[sourceKey];

        // Nested object/array
        if (mappedValue && typeof mappedValue === 'object') {
          const nestedApiSource = apiNameSourceConfigs[sourceKey] || apiNameSourceConfigs.default;
          const nestedApiTarget = apiNameTargetConfigs[targetKey] || apiNameTargetConfigs.default;

          mappedValue = this.map(mappedValue, Array.isArray(mappedValue) ? [] : {}, {
            apiNameSourceConfigs: { default: nestedApiSource },
            apiNameTargetConfigs: { default: nestedApiTarget }
          });
        }

        (target as any)[targetKey] = mappedValue;
        mappedKeys.add(targetKey);
      } else {
        unmappedFromSource[sourceKey] = source[sourceKey];
      }
    }

    // Translate unmapped
    const translatedUnmapped = this.translateService.translate(
      unmappedFromSource,
      apiNameSourceConfigs.default,
      apiNameSourceConfigs
    );

    // Translate mapped target
    const targetForLog = this.translateService.translate(
      target,
      apiNameTargetConfigs.default,
      apiNameTargetConfigs
    );

    // Gắn (KHỚP)
    for (const key of Object.keys(targetForLog)) {
      if (mappedKeys.has(key.split(' ')[0])) {
        const value = targetForLog[key];
        delete targetForLog[key];
        targetForLog[`(KHỚP) ${key}`] = value;
      }
    }

    console.log('%cTrường không map trong SOURCE (%s) :', 'color: red; font-weight: bold;', sourceName, translatedUnmapped);
    console.log('%cKẾT QUẢ của TARGET (%s):', 'color: red; font-weight: bold;', targetName, targetForLog);

    return target;
  }
}
