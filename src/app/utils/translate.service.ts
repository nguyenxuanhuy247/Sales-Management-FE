import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private translations: Record<string, string> = {};

  constructor(private http: HttpClient) {
    firstValueFrom(this.http.get<Record<string, string>>('/assets/vi.json'))
        .then(data => this.translations = data);
  }

translate(obj: any, apiName: string, configs: Record<string, string> = {}): any {
  const walk = (value: any, currentApi: string, parentKey?: string): any => {
    // Array → lặp từng phần tử nhưng API name giữ nguyên theo configs
    if (Array.isArray(value)) {
      return value.map(v => walk(v, currentApi, parentKey));
    }

    // Object → tạo object mới và dịch key
    if (value !== null && typeof value === "object") {
      const result: Record<string, any> = {};

      for (const key of Object.keys(value)) {
        // Nếu key có cấu hình API riêng → dùng API đó, nếu không dùng currentApi
        const nextApi = configs[key] || currentApi;

        const translationKey = `${nextApi}.update.${key}`;
        const label = this.translations[translationKey] ?? "X";
        const displayKey = `${key} (${label})`;

        result[displayKey] = walk(value[key], nextApi, key);
      }

      return result;
    }

    // Primitive → trả nguyên
    return value;
  };

  return walk(obj, apiName);
}
}
