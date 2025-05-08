export class TreeTool {

    /**
     * 列表转树
     * @param list - 节点列表
     * @param idKey - 节点ID键名
     * @param parentKey - 父节点ID键名
     * @returns 树型结构列表
     */
    public static listToTree<T>(list: T[], idKey: string = 'id', parentKey: string = 'parentId'): T[] {
        if (!list || list.length === 0) {
            return [];
        }

        // 创建一个映射，用于快速查找节点
        const map = new Map<any, T>();
        list.forEach(item => {
            map.set((item as any)[idKey], item);
        });

        const rootNodes: T[] = [];

        list.forEach(item => {
            const itemParentId = (item as any)[parentKey];
            if (!itemParentId || !map.has(itemParentId)) {
                // 如果没有父节点或父节点不存在，则为根节点
                rootNodes.push(item);
            } else {
                // 否则，将其添加到父节点的子节点中
                const parent = map.get(itemParentId);
                if (!parent) return;
                if (!(parent as any).children) {
                    (parent as any).children = [];
                }
                (parent as any).children.push(item);
            }
        });

        return rootNodes;
    }

    /**
     * 递归树
     * @param treeData - 树型结构数据
     * @param recursionTree - 递归处理函数
     * @param res - 递归返回值
     */
    public static recursion<T, R>(
        treeData: T[],
        recursionTree: (node: T, result: R) => void,
        res: R
    ): void {
        if (treeData && treeData.length > 0) {
            treeData.forEach((data: any) => {
                recursionTree(data, res); // 假设这个回调负责前后处理逻辑
                this.recursion(data.children, recursionTree, res);
            });
        }
    }
}