import type { RoleItemType } from '#src/api/system'
import type { TreeDataNodeWithId } from '#src/components'
import { fetchAddRoleItem, fetchUpdateRoleItem } from '#src/api/system'
import { FormTreeItem } from '#src/components'

import { DrawerForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Form } from 'antd'
import { useEffect } from 'react'
import { DepartmentItemType } from '#src/api/derpartment/types.js'
import { DerpartmentStatus } from '../enum'
import { RadioTypeEnum } from '#src/enum/global.js'
import { StatusOptionsGlobal } from '#src/constants/option/index.js'

interface DetailProps {
  treeData: TreeDataNodeWithId[]
  title: React.ReactNode
  open: boolean
  detailData: Partial<RoleItemType>
  onCloseChange: () => void
  refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, treeData, refreshTable }: DetailProps) {
  const [form] = Form.useForm<RoleItemType>()

  const addRoleItemMutation = useMutation({
    mutationFn: fetchAddRoleItem
  })
  const updateRoleItemMutation = useMutation({
    mutationFn: fetchUpdateRoleItem
  })

  const onFinish = async (values: DepartmentItemType) => {
    // if (detailData._id) {
    //   await updateRoleItemMutation.mutateAsync(values)
    //   window.$message?.success(t('common.updateSuccess'))
    // } else {
    //   await addRoleItemMutation.mutateAsync(values)
    //   window.$message?.success(t('common.addSuccess'))
    // }
    refreshTable?.()
    return true
  }

  useEffect(() => {
    if (open) {
      form.setFieldsValue(detailData)
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
        onResize() {},
        maxWidth: window.innerWidth * 0.8,
        minWidth: 550
      }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 24, offset: 2 }}
      layout='horizontal'
      form={form}
      autoFocusFirstInput
      drawerProps={{
        destroyOnHidden: true
      }}
      // onFinish={onFinish}
      initialValues={{
        status: 1,
        menus: []
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
        label='Tên phòng ban'
        tooltip='Tên phòng ban không được để trống'
        placeholder='Nhập tên phòng ban'
      />

      <ProFormText
        allowClear
        rules={[
          {
            required: true
          }
        ]}
        width='md'
        name='code'
        label='Mã phòng ban'
        placeholder='Nhập mã phòng ban'
      />

      <ProFormRadio.Group
        name='status'
        label='Trạng thái'
        radioType={RadioTypeEnum.CHECKBOX as 'button' | 'radio' | undefined}
        options={StatusOptionsGlobal}
      />

      <ProFormTextArea placeholder='Nhập miêu tả' allowClear width='md' name='description' label='Miêu tả' />

      {/* <Form.Item name='menus' label={t('system.role.assignMenu')}>
        <FormTreeItem treeData={treeData} />
      </Form.Item> */}
    </DrawerForm>
  )
}
