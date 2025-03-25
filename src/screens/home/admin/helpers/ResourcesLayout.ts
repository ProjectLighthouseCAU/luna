export const resourcesLayouts = ['column', 'list'] as const;
export type ResourcesLayout = (typeof resourcesLayouts)[number];
