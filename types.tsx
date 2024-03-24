export type Node = {
    id: number;
    prompt: string;
    meta: string;
    children: Node[]
}