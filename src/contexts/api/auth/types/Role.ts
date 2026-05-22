export interface Role {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export function newUninitializedRole(): Role {
  return {
    id: 0,
    name: '',
    createdAt: new Date(0),
    updatedAt: new Date(0),
  };
}
