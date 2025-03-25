export const displayInspectorTabs = ['general', 'animator'] as const;
export type DisplayInspectorTab = (typeof displayInspectorTabs)[number];
