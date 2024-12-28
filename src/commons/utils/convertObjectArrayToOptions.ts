import { ComboboxOptions } from "@/components/ui/combobox";




export function convertObjectArrayToOptions<
  T,
  K extends keyof T,
  V extends keyof T,
>(array: T[], valueKey: K, labelKey: V): ComboboxOptions[] {
  return array.map(item => {
    const value = String(item[valueKey]);
    const label = String(item[labelKey]);
    return { value, label };
  });
}