import { Button, Checkbox, Input } from "antd";
import Form from "./Form/index";

const Basic: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success', values);
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }
  return (
    <Form
      initialValues={{ remember: true, username: "你好啊春日" }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }, {
          max: 6,
          message: '用户名最多6个字符'
        }]}

      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remeber" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Basic;