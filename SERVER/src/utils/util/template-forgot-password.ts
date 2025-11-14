interface NewPasswordTemplateParams {
  email: string
  newPassword: string
}

const LOGO_COMPANY = 'https://megakorea.vn/wp-content/uploads/2024/08/megakorea-logo-300x105-1.png'

const NewPasswordTemplate = ({ email, newPassword }: NewPasswordTemplateParams): string => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mật khẩu mới của bạn</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                                <img src=${LOGO_COMPANY} alt="Megakorea Logo" style="max-width: 150px; height: auto; margin-bottom: 20px; display: block; margin: 0 auto 20px auto;">
                                <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: 600;">Megakorea</h1>
                                <p style="color: #ffffff; font-size: 16px; margin: 0; opacity: 0.9;">Mật khẩu mới của bạn</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="color: #333; font-size: 20px; margin: 0 0 20px 0;">Xin chào!</h2>
                                
                                <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Chúng tôi đã tạo mật khẩu mới cho tài khoản <strong>${email}</strong>. 
                                    Vui lòng sử dụng mật khẩu bên dưới để đăng nhập vào hệ thống.
                                </p>
                                
                                <!-- New Password Display -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px 50px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                                                <span style="color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 3px; font-family: 'Courier New', monospace; text-shadow: 0 2px 4px rgba(0,0,0,0.2); word-break: break-all;">
                                                    ${newPassword}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0; text-align: center;">
                                    Sử dụng mật khẩu này để đăng nhập vào tài khoản của bạn
                                </p>
                                
                                <!-- Security Notice -->
                                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                                    <h3 style="color: #856404; font-size: 16px; margin: 0 0 10px 0;">🔒 Khuyến nghị bảo mật</h3>
                                    <p style="color: #856404; font-size: 14px; margin: 0 0 8px 0;">• <strong>Đổi mật khẩu ngay</strong> sau khi đăng nhập lần đầu</p>
                                    <p style="color: #856404; font-size: 14px; margin: 0 0 8px 0;">• Không chia sẻ mật khẩu này với bất kỳ ai</p>
                                    <p style="color: #856404; font-size: 14px; margin: 0 0 8px 0;">• Sử dụng mật khẩu mạnh kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</p>
                                    <p style="color: #856404; font-size: 14px; margin: 0;">• Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng liên hệ ngay với chúng tôi</p>
                                </div>
                                
                                <!-- Login Button -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="https://megakorea.vn/login" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                                                Đăng nhập ngay
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #999; font-size: 12px; line-height: 1.5; margin: 30px 0 0 0; text-align: center;">
                                    Nếu bạn gặp khó khăn trong việc đăng nhập, vui lòng liên hệ với chúng tôi để được hỗ trợ.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
                                    Email này được gửi từ <strong>Megakorea</strong>
                                </p>
                                <p style="color: #666; font-size: 12px; margin: 0;">
                                    © 2024 Megakorea. Tất cả quyền được bảo lưu.
                                </p>
                                <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">
                                    Nếu bạn có thắc mắc, vui lòng liên hệ: 
                                    <a href="mailto:megakorea@gmail.com" style="color: #667eea; text-decoration: none;">megakorea@gmail.com</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `
}

export default NewPasswordTemplate
