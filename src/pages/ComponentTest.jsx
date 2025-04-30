import { useState } from 'react';
import FormInput from '@components/FormInput';
import FormTextarea from '@components/FormTextArea';

const FormInputTest = () => {
    const [value, setValue] = useState('');

    return (
        <div>
            <FormInput
                placeholder="Enter text"
                value={value}
                handleChange={(v) => setValue(v)}
                readOnly={false}
                type="text"
                hideCursor={false}
                disabled={false}
            />
            <div> value: {value}</div>
        </div>
    )
}

const FormTextAreaTest = () => {
    const [value, setValue] = useState('');

    return (
        <div>
            <FormTextarea
                placeholder="Enter text"
                value={value}
                handleChange={(v) => setValue(v)}
                readOnly={false}
                hideCursor={false}
                disabled={false}
            />
            <div> value: {value}</div>
        </div>
    )
}


const ComponentTest = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div> Component Test </div>
            <FormInputTest />
            <FormTextAreaTest />
        </div>
    );
}

export default ComponentTest;