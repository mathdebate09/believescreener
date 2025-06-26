declare module 'nativeflowcss' {
  import { ViewStyle, TextStyle } from 'react-native';

  type StyleObject = {
    [key: string]: ViewStyle | TextStyle | any;
  };

  // Layout utilities
  export const flex: StyleObject;
  export const p: StyleObject;
  export const m: StyleObject;
  export const w: StyleObject;
  export const h: StyleObject;
  export const size: StyleObject;

  // Positioning and alignment
  export const align: StyleObject;
  export const justify: StyleObject;
  export const place: StyleObject;
  export const pos: StyleObject;
  export const z: StyleObject;

  // Display and effects
  export const display: StyleObject;
  export const direction: StyleObject;
  export const fx: StyleObject;
  export const shadow: StyleObject;
  export const bdr: StyleObject;

  // Text and decoration
  export const text: StyleObject;
  export const decoration: StyleObject;

  // Object properties
  export const aspect: StyleObject;
  export const object_fit: StyleObject;
  export const overflow: StyleObject;
}