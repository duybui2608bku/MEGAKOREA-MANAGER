import React from 'react'
import { Typography, Steps, Card, Alert, Divider, List, Tag, Collapse } from 'antd'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

export const Instruct: React.FC = () => {
  return (
    <div>
      <Typography>
        <Title level={3}>Hướng dẫn sử dụng công cụ Tạo bài viết hàng loạt</Title>
        <Paragraph>
          Trang này hướng dẫn thao tác trên công cụ đăng bài cho nhiều Fanpage cùng lúc, chọn dịch vụ, tạo nội dung bằng
          AI, tải ảnh, xem trước và đăng hàng loạt.
        </Paragraph>
      </Typography>

      <Alert
        type='info'
        showIcon
        message='Yêu cầu quyền truy cập'
        description={
          <span>
            Đảm bảo tài khoản của bạn đã được cấp quyền quản trị viên hoặc biên tập viên trên Trang cần đăng. Hệ thống
            cần quyền đăng và quản lý bài viết để thực thi tự động.
          </span>
        }
        style={{ marginBottom: 16 }}
      />

      <Card bordered>
        <Steps
          direction='vertical'
          items={[
            {
              title: 'Chọn dịch vụ',
              description: (
                <Paragraph>
                  Dùng ô <Text strong>Chọn dịch vụ</Text> để chọn nhóm Trang mục tiêu. Trường này là{' '}
                  <Text strong>bắt buộc</Text> và là điều kiện để bật tính năng tạo nội dung AI và đăng hàng loạt.
                </Paragraph>
              )
            },
            {
              title: 'Tạo nội dung bằng AI (tuỳ chọn)',
              description: (
                <div>
                  <Paragraph>
                    Trong thẻ <Text strong>"Tạo nội dung bằng AI"</Text>:
                  </Paragraph>
                  <List
                    size='small'
                    dataSource={[
                      'Chọn "Phương pháp" để xác định kiểu nội dung',
                      'Chọn "Emoji" (Có/Không) theo mong muốn',
                      'Nhập "Thông tin thêm" để AI có ngữ cảnh (tuỳ chọn)',
                      'Nhấn nút AI ở góc phải tiêu đề thẻ để tạo nội dung'
                    ]}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                  <Paragraph style={{ marginTop: 8 }}>
                    Lưu ý: nút AI sẽ bị vô hiệu nếu chưa chọn dịch vụ. Khi tạo thành công, nội dung sẽ tự động điền vào
                    ô <Text strong>"Nội dung bài viết"</Text>.
                  </Paragraph>
                </div>
              )
            },
            {
              title: 'Tải ảnh bài viết',
              description: (
                <Paragraph>
                  Sử dụng khu vực <Text strong>Tải ảnh</Text> để upload ảnh. Ảnh là <Text strong>bắt buộc</Text> để có
                  thể đăng hàng loạt. Khi tải thành công, ảnh sẽ xuất hiện ngay ở khung{' '}
                  <Text strong>"Bản xem trước"</Text> bên phải.
                </Paragraph>
              )
            },
            {
              title: 'Soạn/Chỉnh sửa nội dung',
              description: (
                <Paragraph>
                  Hoàn thiện nội dung tại ô <Text strong>"Nội dung bài viết"</Text>. Bạn có thể sửa lại nội dung AI vừa
                  tạo hoặc tự soạn mới.
                </Paragraph>
              )
            },
            {
              title: 'Xem trước',
              description: (
                <Paragraph>
                  Khung <Text strong>"Bản xem trước"</Text> phản ánh ngay nội dung và ảnh hiện tại để bạn kiểm tra nhanh
                  trước khi đăng.
                </Paragraph>
              )
            },
            {
              title: 'Đăng bài hàng loạt',
              description: (
                <Paragraph>
                  Nhấn nút <Text strong>Đăng</Text> (biểu tượng bàn tay chỉ lên) ở góc phải tiêu đề thẻ chính. Nút chỉ
                  khả dụng khi đã chọn <Text strong>Dịch vụ</Text>, nhập <Text strong>Nội dung</Text> và tải{' '}
                  <Text strong>Ảnh</Text>.
                </Paragraph>
              )
            },
            {
              title: 'Trạng thái & thông báo',
              description: (
                <Paragraph>
                  Hệ thống hiển thị thông báo: thành công "Đăng bài viết hàng loạt trên fanpage thành công" hoặc lỗi
                  tương ứng để bạn xử lý.
                </Paragraph>
              )
            }
          ]}
        />
      </Card>

      <Divider />

      <Card title='Điều kiện để nút Đăng khả dụng' bordered style={{ marginBottom: 16 }}>
        <List
          size='small'
          dataSource={[
            'Đã chọn dịch vụ trong ô "Chọn dịch vụ"',
            'Ô "Nội dung bài viết" có nội dung',
            'Đã tải lên ít nhất 1 ảnh'
          ]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>

      <Collapse bordered>
        <Panel header='Câu hỏi thường gặp (FAQ)' key='faq'>
          <Paragraph>
            <Text strong>Vì sao nút AI bị vô hiệu?</Text>
            <br />
            Bạn cần chọn <Text strong>Dịch vụ</Text> trước. Khi chưa chọn, nút AI bị vô hiệu và hiển thị gợi ý.
          </Paragraph>
          <Paragraph>
            <Text strong>Vì sao nút Đăng bị mờ?</Text>
            <br />
            Cần thoả cả 3 điều kiện: đã chọn dịch vụ, có nội dung, và đã tải ảnh.
          </Paragraph>
          <Paragraph>
            <Text strong>Không tạo được nội dung AI?</Text>
            <br />
            Kiểm tra kết nối mạng, thử lại sau vài phút, hoặc tinh chỉnh "Phương pháp" và "Thông tin thêm" cho cụ thể
            hơn.
          </Paragraph>
        </Panel>
        <Panel header='Sự cố phổ biến & cách khắc phục' key='troubleshoot'>
          <List
            size='small'
            dataSource={[
              'Nút AI không chạy: cần chọn dịch vụ trước khi bấm',
              'Nút Đăng bị mờ: thiếu nội dung hoặc chưa tải ảnh',
              'Ảnh lỗi: kiểm tra định dạng/dung lượng và thử lại'
            ]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>
      </Collapse>
    </div>
  )
}
