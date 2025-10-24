import type { TreeProps } from 'antd'

import type { BasicDataNode } from 'antd/lib/tree'
import { Checkbox, Input, Tree } from 'antd'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { GlobalEnum } from '#src/enum/global.js'

export interface TreeDataNodeWithId extends BasicDataNode {
  _id: string
  title: string
  children: TreeDataNodeWithId[]
}

interface FormTreeItemProps {
  treeData: TreeDataNodeWithId[]
  value?: React.Key[]
  onChange?: (value: React.Key[]) => void
}

const { Search } = Input

function getParentKey(key: React.Key, tree: TreeDataNodeWithId[]): React.Key {
  let parentKey: React.Key
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item._id === key)) {
        parentKey = node._id
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey!
}

export function FormTreeItem({ treeData, value, onChange }: FormTreeItemProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [checkedOptions, setCheckedOptions] = useState<string[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  // const onSelect: TreeProps["onSelect"] = (selectedKeys) => {
  // 	onChange?.(selectedKeys);
  // };

  const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
    onChange?.(checkedKeys as React.Key[])
  }

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys)
    setAutoExpandParent(false)
  }

  const flattenTreeData = useMemo(() => {
    const dataList: { _id: string; title: string }[] = []
    const generateList = (data: TreeDataNodeWithId[]) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        dataList.push({ _id: node._id, title: node.title as string })
        if (node.children) {
          generateList(node.children)
        }
      }
    }
    generateList(treeData)

    return dataList
  }, [treeData])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const newExpandedKeys = flattenTreeData
      .map((item) => {
        if (item.title.includes(value)) {
          return getParentKey(item._id, treeData)
        }
        return null
      })
      .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i))
    setExpandedKeys(newExpandedKeys)
    setSearchValue(value)
    setAutoExpandParent(true)
  }

  const onCheckboxChange = (checkedValues: string[]) => {
    setCheckedOptions(checkedValues)
  }

  useEffect(() => {
    if (checkedOptions.includes('expandAll')) {
      setExpandedKeys(flattenTreeData.map((item) => item._id))
    } else {
      setExpandedKeys([])
    }
    if (checkedOptions.includes('checkAll')) {
      onChange?.(flattenTreeData.map((item) => item._id))
    } else {
      onChange?.([])
    }
  }, [checkedOptions, flattenTreeData])

  return (
    <Fragment>
      <Search className='mb-3' placeholder='Tìm kiếm' allowClear value={searchValue} onChange={handleSearchChange} />
      <Checkbox.Group
        options={[
          { label: checkedOptions.includes('expandAll') ? 'Thu gọn tất cả' : 'Mở rộng tất cả', value: 'expandAll' },
          { label: checkedOptions.includes('checkAll') ? 'Bỏ chọn tất cả' : 'Chọn tất cả', value: 'checkAll' }
        ]}
        value={checkedOptions}
        rootClassName='flex justify-between items-center mb-3'
        onChange={onCheckboxChange}
      />

      <Tree
        checkable
        blockNode
        defaultExpandAll
        checkStrictly
        titleRender={(node) => node.title as string}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        fieldNames={{
          key: GlobalEnum.MAIN_KEY as string
        }}
        checkedKeys={value}
        // onSelect={onSelect}
        treeData={treeData as any}
        onCheck={onCheck}
      />
    </Fragment>
  )
}
