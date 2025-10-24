import type { RoleItemType } from '#src/api/system'
import { fetchAddRoleItem, fetchUpdateRoleItem } from '#src/api/system'
import { getStatusOptions } from '#src/constants/options.js'
import { LayoutEnum } from '#src/enum/global.js'

import {
  DrawerForm,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Form } from 'antd'
import { useEffect } from 'react'
import { getPermissionOptions, getRoleCodeOptions } from './options'
import { RoleStatusEnum } from '../enum'

interface DetailProps {
  title: React.ReactNode
  open: boolean
  detailData: Partial<RoleItemType>
  onCloseChange: () => void
  refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, refreshTable }: DetailProps) {
  const [form] = Form.useForm<RoleItemType>()

  const addRoleItemMutation = useMutation({
    mutationFn: fetchAddRoleItem
  })
  const updateRoleItemMutation = useMutation({
    mutationFn: fetchUpdateRoleItem
  })

  const onFinish = async (values: RoleItemType) => {
    if (detailData._id) {
      const dataToUpdate = {
        ...values,
        _id: detailData._id
      }
      await updateRoleItemMutation.mutateAsync(dataToUpdate)
      window.$message?.success('Cập nhật thành công')
    } else {
      await addRoleItemMutation.mutateAsync(values)
      window.$message?.success('Thêm thành công')
    }
    form.resetFields()
    refreshTable?.()
    onCloseChange()
    return true
  }

  useEffect(() => {
    if (open) {
      const formData = {
        ...detailData,
        permissions: Array.isArray(detailData.permissions)
          ? detailData.permissions.map((p) => (typeof p === 'object' ? p._id : p))
          : []
      }
      form.setFieldsValue(formData as any)
    }
  }, [open])

  return (
    <DrawerForm<RoleItemType>
      title={title}
      open={open}
      onOpenChange={(visible) => {
        if (visible === false) {
          onCloseChange()
        }
      }}
      resize={{
        maxWidth: window.innerWidth * 0.8,
        minWidth: 500
      }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 24 }}
      layout={LayoutEnum.HORIZONTAL}
      form={form}
      autoFocusFirstInput
      drawerProps={{
        destroyOnHidden: true
      }}
      onFinish={onFinish}
      initialValues={{
        status: RoleStatusEnum.ACTIVE
      }}
    >
      <ProFormText
        allowClear
        rules={[
          {
            required: true
          }
        ]}
        width='md'
        name='name'
        label='Tên chức vụ'
      />

      <ProFormSelect
        allowClear
        rules={[
          {
            required: true
          }
        ]}
        width='md'
        name='code'
        label='Mã chức vụ'
        options={getRoleCodeOptions()}
      />

      <ProFormRadio.Group name='status' label='Trạng thái' radioType='button' options={getStatusOptions()} />
      <ProFormCheckbox.Group
        allowClear
        rules={[
          {
            required: true
          }
        ]}
        width='md'
        name='permissions'
        label='Quyền'
        options={getPermissionOptions()}
      />
      <ProFormTextArea allowClear width='md' name='description' label='Mô tả' />
    </DrawerForm>
  )
}
