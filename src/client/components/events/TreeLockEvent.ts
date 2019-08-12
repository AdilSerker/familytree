export class TreeLockEvent extends CustomEvent<boolean> {
    constructor(lock: boolean) {
        super('tree-lock', { detail: lock });
    }
}
