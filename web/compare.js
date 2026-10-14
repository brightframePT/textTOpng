// Compare only the fields that affect title exports; row order is irrelevant.
export function compareSessions(current, previous) {
    const index = (items, label) => {
        const map = new Map();
        for (const item of items) {
            if (!item.key) throw Error(`${label}: falta um ID de sessão. Mantém a coluna Session Record ID ou Shorthand Session Record ID nos dois CSVs.`);
            if (map.has(item.key)) throw Error(`${label}: ID repetido (${item.key}). A comparação precisa de IDs únicos.`);
            map.set(item.key, item);
        }
        return map;
    };
    const old = index(previous, 'CSV anterior');
    const now = index(current, 'CSV novo');
    const entries = current.map(item => {
        const before = old.get(item.key);
        const change = !before ? 'added' : before.title !== item.title || before.stage !== item.stage ? 'changed' : 'unchanged';
        return {...item, change, before: before ? {title: before.title, stage: before.stage} : null};
    });
    const removed = previous.filter(item => !now.has(item.key));
    return {entries, removed};
}
