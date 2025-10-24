import type { TreeDataNodeWithId } from '#src/components'

import { FormTreeItem } from '#src/components'
import { DrawerForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { Form } from 'antd'
import { useEffect } from 'react'
import { DepartmentItemType } from '#src/api/system/derpartment/types.js'
import { RadioTypeEnum } from '#src/enum/global.js'
import { StatusOptionsGlobal } from '#src/constants/option/index.js'
import { createDepartment, updateDepartment } from '#src/api/system/derpartment/index.js'

interface DetailProps {
  treeData: TreeDataNodeWithId[]
  title: React.ReactNode
  open: boolean
  detailData: Partial<DepartmentItemType>
  onCloseChange: () => void
  refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, treeData, refreshTable }: DetailProps) {
  const [form] = Form.useForm<DepartmentItemType>()

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment
  })

  const createDepartmentMutation = useMutation({
    mutationFn: createDepartment
  })

  const onFinish = async (values: DepartmentItemType) => {
    const assignedMenus = Array.isArray(values.assigned_menus)
      ? values.assigned_menus
      : (values.assigned_menus as any).checked || []
    const dataToSend = {
      ...values,
      assigned_menus: assignedMenus
    }
    if (detailData._id) {
      const updateData = { ...dataToSend, _id: detailData._id }
      await updateDepartmentMutation.mutateAsync(updateData)
      window.$message?.success('Cập nhật thành công')
    } else {
      await createDepartmentMutation.mutateAsync(dataToSend)
      window.$message?.success('Thêm thành công')
    }
    refreshTable?.()
    return true
  }

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        ...detailData,
        assigned_menus: detailData.assigned_menus || []
      })
    }
  }, [open, detailData, form])

  return (
    <DrawerForm<DepartmentItemType>
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
      onFinish={onFinish}
      initialValues={{
        status: 1,
        assigned_menus: []
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

      <ProFormText allowClear width='md' name='code' label='Mã phòng ban' placeholder='Nhập mã phòng ban' />

      <ProFormRadio.Group
        name='status'
        label='Trạng thái'
        radioType={RadioTypeEnum.CHECKBOX as 'button' | 'radio' | undefined}
        options={StatusOptionsGlobal}
      />

      <ProFormTextArea
        style={{
          height: 300
        }}
        placeholder='Nhập miêu tả'
        allowClear
        width='md'
        name='description'
        label='Miêu tả'
      />

      <Form.Item name='assigned_menus' label='Phân quyền'>
        <FormTreeItem value={detailData.assigned_menus} treeData={treeData} />
      </Form.Item>
    </DrawerForm>
  )
}
