import { Form, Input, Button, DatePicker } from 'antd';
import "antd/dist/antd.css";

const { RangePicker } = DatePicker;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const VehicleForm = (props) => {
    const onFinish = (values) => {
        console.log('Success:', values);
        props.setFormValue(values)
        props.setIsFormValid(true)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        props.setIsFormValid(false)
    };

    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Vehicle Registration"
                name="vehicleRegistration"
                rules={[
                    {
                        required: true,
                        message: 'KA2134',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="NIC"
                name="nic"
                rules={[
                    {
                        required: true,
                        message: 'Your NIC',
                    },
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item label="Report Range:" name="range">
                <RangePicker picker="month"/>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
        </Button>
            </Form.Item>
        </Form>
    );
};

export default VehicleForm;