import { Color } from '@luna/utils/rgb';
import * as rgb from '@luna/utils/rgb';

export interface ColorSnippetProps {
  color: Color;
}

export function ColorSnippet({ color }: ColorSnippetProps) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: rgb.asCSS(color) }}
      />
      <div className="opacity-50">#{rgb.asHex(color)}</div>
    </div>
  );
}
