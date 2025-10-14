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
import { useEffect } from 'react'

import { getMenuTypeOptions } from '../constants'

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
    if (detailData.id) {
      await fetchUpdateMenuItem(values)
      window.$message?.success('Cập nhật thành công')
    } else {
      await fetchAddMenuItem(values)
      window.$message?.success('Thêm thành công')
    }
    refreshTable?.()
    return true
  }

  useEffect(() => {
    if (open) {
      form.setFieldsValue(detailData)
    }
  }, [open])

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
      // wrapperCol={{ span: 24 }}
      layout='horizontal'
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnHidden: true
      }}
      grid
      width={{
        xl: 800,
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

      <ProFormCascader
        name='parentId'
        label='Menu cha'
        fieldProps={{
          showSearch: true,
          autoClearSearchValue: true,
          fieldNames: {
            label: 'name',
            value: 'id',
            children: 'children'
          }
        }}
        request={async () => {
          return handleTree(flatParentMenus)
        }}
      />

      <ProFormDependency name={['menuType']}>
        {({ menuType }) => {
          if (Number(menuType) === 0) {
            return (
              <>
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
                  label='Đường dẫn component'
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
                      value: 1
                    },
                    {
                      label: 'Ngưng',
                      value: 0
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
                      value: 1
                    },
                    {
                      label: 'Ngưng',
                      value: 0
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
                      value: 1
                    },
                    {
                      label: 'Ngưng',
                      value: 0
                    }
                  ]}
                />

                <ProFormText
                  allowClear
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  name='currentActiveMenu'
                  label='Menu active'
                />

                <ProFormText
                  allowClear
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  name='iframeLink'
                  label='Iframe'
                />

                <ProFormText
                  allowClear
                  labelCol={{ md: 5, xl: 6 }}
                  colProps={{ md: 24, xl: 12 }}
                  name='externalLink'
                  label='External'
                />
              </>
            )
          }
        }}
      </ProFormDependency>
    </ModalForm>
  )
}
