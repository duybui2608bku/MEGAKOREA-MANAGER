/**
 * @description Chuyển đổi dữ liệu dạng phẳng (flat data) thành cấu trúc cây (tree structure)
 * @param data Nguồn dữ liệu (mảng các đối tượng)
 * @param id Tên trường định danh (ID), mặc định là "id"
 * @param parentId Tên trường của ID cha, mặc định là "parentId"
 * @param children Tên trường của danh sách con, mặc định là "children"
 * @returns Cấu trúc cây sau khi chuyển đổi
 *
 * @example
 * const data = [
 *   { id: 1, parentId: 0, name: "A" },
 *   { id: 2, parentId: 1, name: "B" },
 *   { id: 3, parentId: 1, name: "C" },
 * ];
 * const tree = handleTree(data);
 * // Kết quả: [ { id: 1, parentId: 0, name: "A", children: [{...}, {...}] } ]
 */
export function handleTree(data: any[], id?: string, parentId?: string, children?: string): any {
  if (!Array.isArray(data)) {
    console.warn('Dữ liệu đầu vào (data) phải là một mảng')
    return []
  }
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }

  const childrenListMap: any = {}
  const nodeIds: any = {}
  const tree = []

  // Duyệt qua tất cả phần tử và lưu mối quan hệ cha-con
  for (const d of data) {
    const parentId = d[config.parentId]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  // Xác định các node gốc (những node không có cha)
  for (const d of data) {
    const parentId = d[config.parentId]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  // Đệ quy tạo danh sách con cho từng node
  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o: Record<string, any>) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }
  return tree
}

export interface TreeConfigOptions {
  /** Tên thuộc tính con, mặc định là "children" */
  childProps: string
}

/**
 * @description Duyệt cây theo chiều sâu (DFS) và lấy ra danh sách các giá trị theo điều kiện
 * @param tree Mảng các node gốc của cây
 * @param getValue Hàm dùng để trích xuất giá trị từ mỗi node
 * @param options Cấu hình tùy chọn (tên thuộc tính chứa danh sách con)
 * @returns Mảng chứa tất cả giá trị được trích xuất từ các node
 *
 * @example
 * const tree = [{ id: 1, children: [{ id: 2 }] }];
 * traverseTreeValues(tree, node => node.id);
 * // Kết quả: [1, 2]
 */
export function traverseTreeValues<T, V>(tree: T[], getValue: (node: T) => V, options?: TreeConfigOptions): V[] {
  const result: V[] = []
  const { childProps } = options || { childProps: 'children' }

  const dfs = (treeNode: T) => {
    const value = getValue(treeNode)
    result.push(value)
    const children = (treeNode as Record<string, any>)?.[childProps]
    if (!children) return
    if (children.length > 0) {
      for (const child of children) {
        dfs(child)
      }
    }
  }

  for (const treeNode of tree) {
    dfs(treeNode)
  }
  return result.filter(Boolean)
}

/**
 * @description Lọc các node trong cây theo điều kiện cho trước, giữ nguyên thứ tự ban đầu
 * @param tree Mảng các node gốc của cây
 * @param filter Hàm điều kiện dùng để lọc từng node
 * @param options Cấu hình tùy chọn (tên thuộc tính con)
 * @returns Mảng các node thỏa điều kiện lọc
 *
 * @example
 * const tree = [
 *   { id: 1, children: [{ id: 2 }, { id: 3 }] },
 *   { id: 4 },
 * ];
 * filterTree(tree, node => node.id !== 3);
 * // Kết quả: [{ id: 1, children: [{ id: 2 }] }, { id: 4 }]
 */
export function filterTree<T extends Record<string, any>>(
  tree: T[],
  filter: (node: T) => boolean,
  options?: TreeConfigOptions
): T[] {
  const { childProps } = options || { childProps: 'children' }

  const _filterTree = (nodes: T[]): T[] => {
    return nodes.filter((node: Record<string, any>) => {
      if (filter(node as T)) {
        if (node[childProps]) {
          node[childProps] = _filterTree(node[childProps])
        }
        return true
      }
      return false
    })
  }

  return _filterTree(tree)
}

/**
 * @description Ánh xạ (map) lại toàn bộ cây theo một quy tắc mới
 * @param tree Mảng các node gốc của cây
 * @param mapper Hàm ánh xạ: nhận một node, trả về node mới
 * @param options Cấu hình tùy chọn (tên thuộc tính con)
 * @returns Cây mới sau khi được ánh xạ lại
 *
 * @example
 * const tree = [{ id: 1, children: [{ id: 2 }] }];
 * mapTree(tree, node => ({ ...node, label: `Node-${node.id}` }));
 * // Kết quả: [{ id: 1, label: "Node-1", children: [{ id: 2, label: "Node-2" }] }]
 */
export function mapTree<T, V extends Record<string, any>>(
  tree: T[],
  mapper: (node: T) => V,
  options?: TreeConfigOptions
): V[] {
  const { childProps } = options || { childProps: 'children' }
  return tree.map((node) => {
    const mapperNode: Record<string, any> = mapper(node)
    if (mapperNode[childProps]) {
      mapperNode[childProps] = mapTree(mapperNode[childProps], mapper, options)
    }
    return mapperNode as V
  })
}
