import { useState } from 'react';
import FormInput from '@components/FormInput';

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
                onClick={() => console.log('Input clicked')}
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
        </div>
    );
}

export default ComponentTest;