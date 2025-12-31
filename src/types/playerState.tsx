export type PlayerData = {
    status: "playing" | "paused" | "empty";
    current: number;
    queue: Array<string>;
    queue_position: number;
}