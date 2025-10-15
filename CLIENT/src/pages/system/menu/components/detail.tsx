import type { MenuItemType } from '#src/api/system'
import { fetchAddMenuItem, fetchUpdateMenuItem } from '#src/api/system'
import { handleTree } from '#src/utils'

import {
  ModalForm,
  ProFormCascader,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText
} from '@ant-design/pro-components'

import { Form } from 'antd'
import { Fragment, useEffect } from 'react'

import { getMenuTypeOptions } from '../constants'
import { GlobalEnum, LayoutEnum } from '#src/enum/global.js'
import { MenuAction, MenuStatus, MenuType } from '#src/enum/menu/enum.menu.js'

interface DetailProps {
  title: React.ReactNode
  flatParentMenus: MenuItemType[]
  open: boolean
  detailData: Partial<MenuItemType>
  onCloseChange: () => void
  refreshTable?: () => void
}

export function Detail({ title, open, flatParentMenus, onCloseChange, detailData, refreshTable }: DetailProps) {
  const [form] = Form.useForm<MenuItemType>()

  const onFinish = async (values: MenuItemType) => {
    if (values.parentId && Array.isArray(values.parentId)) {
      values.parentId = values.parentId[values.parentId.length - 1]
    }

    if (detailData._id) {
      await fetchUpdateMenuItem(values)
      window.$message?.success('Cập nhật thành công')
    } else {
      await fetchAddMenuItem(values)
      window.$message?.success('Thêm thành công')
    }
    refreshTable?.()
    return true
  }

  const findPathToNode = (nodeId: string, flatMenus: MenuItemType[]): string[] => {
    if (!nodeId) return []

    const path: string[] = []
    let currentId = nodeId

    while (currentId) {
      const menu = flatMenus.find((m) => m._id === currentId)
      if (!menu) break

      path.unshift(currentId)
      currentId = menu.parentId as string
    }

    return path
  }

  useEffect(() => {
    if (open) {
      const formData = { ...detailData }
      if (formData.parentId && typeof formData.parentId === 'string') {
        formData.parentId = findPathToNode(formData.parentId, flatParentMenus)
      }

      form.setFieldsValue(formData)
    }
  }, [open, detailData, flatParentMenus])

  return (
    <ModalForm<MenuItemType>
      title={title}
      open={open}
      onOpenChange={(visible) => {
        if (visible === false) {
          onCloseChange()
        }
      }}
      labelCol={{ md: 5, xl: 3 }}
      wrapperCol={{ span: 24 }}
      layout={LayoutEnum.HORIZONTAL}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnHidden: true
      }}
      grid
      width={{
        xl: 1150,
        md: 500
      }}
      onFinish={onFinish}
      initialValues={{
        menuType: 0,
        status: 1
      }}
    >
      <ProFormRadio.Group
        fieldProps={{
          buttonStyle: 'solid'
        }}
        name='menuType'
        label={'Loại menu'}
        radioType='button'
        required
        options={getMenuTypeOptions()}
      />

      <ProFormRadio.Group
        name='name'
        label='Hành động'
        radioType='button'
        labelCol={{ md: 5, xl: 6 }}
        colProps={{ md: 24, xl: 12 }}
        options={[
          {
            label: MenuAction.ADD,
            value: MenuAction.ADD
          },
          {
            label: MenuAction.EDIT,
            value: MenuAction.EDIT
          },
          {
            label: MenuAction.DELETE,
            value: MenuAction.DELETE
          },
          {
            label: MenuAction.VIEW,
            value: MenuAction.VIEW
          }
        ]}
      />

      <ProFormCascader
        name='parentId'
        label='Menu cha'
        fieldProps={{
          showSearch: true,
          autoClearSearchValue: true,
          fieldNames: {
            label: 'name',
            value: GlobalEnum.MAIN_KEY as string,
            children: 'children'
          }
        }}
        request={async () => {
          return handleTree(flatParentMenus)
        }}
      />

      <ProFormDependency name={['menuType']}>
        {({ menuType }) => {
          if (Number(menuType) === MenuType.MENU) {
            return (
              <Fragment>
                <ProFormText
                  allowClear
                  rules={[
                    {
                      required: true
                    }
                  ]}
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  name='name'
                  label='Tên menu'
                  tooltip={'Tên menu không được vượt quá 24 ký tự'}
                />

                <ProFormText
                  allowClear
                  rules={[
                    {
                      required: true
                    }
                  ]}
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  name='path'
                  label='Đường dẫn'
                />

                <ProFormDigit
                  allowClear
                  rules={[
                    {
                      required: true
                    }
                  ]}
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  name='order'
                  label='Thứ tự'
                />

                <ProFormText
                  allowClear
                  rules={[
                    {
                      required: true
                    }
                  ]}
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  name='icon'
                  label='Icon'
                />

                <ProFormText
                  allowClear
                  rules={[
                    {
                      required: true
                    }
                  ]}
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  name='component'
                  label='Component'
                />

                <ProFormRadio.Group
                  name='status'
                  label='Trạng thái'
                  radioType='button'
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  options={[
                    {
                      label: 'Kích hoạt',
                      value: MenuStatus.ENABLE
                    },
                    {
                      label: 'Ngưng',
                      value: MenuStatus.DISABLE
                    }
                  ]}
                />

                <ProFormRadio.Group
                  name='keepAlive'
                  label='Cache'
                  radioType='button'
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  options={[
                    {
                      label: 'Kích hoạt',
                      value: MenuStatus.ENABLE
                    },
                    {
                      label: 'Ngưng',
                      value: MenuStatus.DISABLE
                    }
                  ]}
                />

                <ProFormRadio.Group
                  name='hideInMenu'
                  label='Ẩn trong menu'
                  radioType='button'
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  options={[
                    {
                      label: 'Kích hoạt',
                      value: MenuStatus.ENABLE
                    },
                    {
                      label: 'Ngưng',
                      value: MenuStatus.DISABLE
                    }
                  ]}
                />

                <ProFormText
                  allowClear
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  name='currentActiveMenu'
                  label='Menu hiển thị'
                  tooltip='Trường này dùng để làm nổi bật menu ở sidebar'
                />
              </Fragment>
            )
          }
        }}
      </ProFormDependency>
    </ModalForm>
  )
}
